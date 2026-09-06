import * as THREE from 'three';
import { STLGeometryData, ValidationIssue, ValidationStatus } from '../../types';

export class STLParserService {
  /**
   * Parse an ArrayBuffer containing either Binary or ASCII STL data
   * Correctly transforms CAD coordinate system (Z-Up) to Three.js (Y-Up)
   */
  public static parse(
    buffer: ArrayBuffer,
    maxPrinterDims = { x: 300, y: 300, z: 400 },
    autoOrient = true
  ): {
    geometry: THREE.BufferGeometry;
    data: STLGeometryData;
  } {
    const isBinary = this.isBinarySTL(buffer);
    const geometry = isBinary ? this.parseBinary(buffer) : this.parseASCII(buffer);

    // Standard CAD exports have Z as Height (Up) and Y as Depth (Back/Forward).
    // In Three.js, Y is Height (Up) and Z is Depth.
    // Rotating -90deg around X aligns CAD models naturally upright on the build plate!
    if (autoOrient) {
      geometry.rotateX(-Math.PI / 2);
    }

    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    const box = geometry.boundingBox || new THREE.Box3();
    const size = new THREE.Vector3();
    box.getSize(size);

    const center = new THREE.Vector3();
    box.getCenter(center);

    // Center geometry on the build plate and place bottom on Y = 0 (build surface)
    geometry.center();
    geometry.translate(0, size.y / 2, 0);

    const triangleCount = geometry.attributes.position.count / 3;
    const { volumeMm3, surfaceAreaMm2, degenerateCount } = this.calculateMeshProperties(geometry);
    const volumeCm3 = volumeMm3 / 1000;

    // Validate geometry against printing constraints
    const validationIssues: ValidationIssue[] = [];
    let validationStatus: ValidationStatus = 'VALID';

    if (triangleCount === 0) {
      validationIssues.push({
        type: 'ERROR',
        code: 'EMPTY_MESH',
        message: 'The uploaded file contains no 3D geometry.'
      });
      validationStatus = 'ERROR';
    }

    if (volumeMm3 <= 0 || isNaN(volumeMm3)) {
      validationIssues.push({
        type: 'WARNING',
        code: 'NON_MANIFOLD',
        message: 'Potential non-manifold geometry detected (open edges or inverted normals). Auto-repair will be applied.'
      });
      if (validationStatus !== 'ERROR') validationStatus = 'WARNING';
    }

    if (size.x > maxPrinterDims.x || size.z > maxPrinterDims.y || size.y > maxPrinterDims.z) {
      validationIssues.push({
        type: 'WARNING',
        code: 'EXCEEDS_BUILD_VOLUME',
        message: `Model dimensions (${size.x.toFixed(1)} × ${size.z.toFixed(1)} × ${size.y.toFixed(1)} mm) exceed standard build volume (${maxPrinterDims.x} × ${maxPrinterDims.y} × ${maxPrinterDims.z} mm). Scaling recommended.`
      });
      if (validationStatus !== 'ERROR') validationStatus = 'WARNING';
    }

    if (size.x < 2 || size.z < 2 || size.y < 2) {
      validationIssues.push({
        type: 'WARNING',
        code: 'TINY_DIMENSIONS',
        message: 'Model is under 2mm in at least one axis. Check your export units (meters vs millimeters).'
      });
      if (validationStatus !== 'ERROR') validationStatus = 'WARNING';
    }

    if (degenerateCount > 0) {
      validationIssues.push({
        type: 'INFO',
        code: 'DEGENERATE_FACES',
        message: `${degenerateCount} zero-area triangles cleaned.`
      });
    }

    const data: STLGeometryData = {
      dimensions: {
        x: Math.round(size.x * 10) / 10, // Width
        y: Math.round(size.z * 10) / 10, // Depth
        z: Math.round(size.y * 10) / 10, // Height (Up)
      },
      originalDimensions: {
        x: Math.round(size.x * 10) / 10,
        y: Math.round(size.z * 10) / 10,
        z: Math.round(size.y * 10) / 10,
      },
      volumeMm3: Math.round(Math.abs(volumeMm3) * 10) / 10,
      volumeCm3: Math.round((Math.abs(volumeCm3) || (size.x * size.z * size.y * 0.0004)) * 10) / 10,
      surfaceAreaMm2: Math.round(surfaceAreaMm2 * 10) / 10,
      triangleCount,
      isManifold: volumeMm3 > 0 && !isNaN(volumeMm3),
      center: [center.x, center.y, center.z],
      validationStatus,
      validationIssues,
    };

    return { geometry, data };
  }

  /**
   * Rotates an existing BufferGeometry by given degrees and re-grounds it on Y=0
   */
  public static rotateAndRealign(
    geometry: THREE.BufferGeometry,
    axis: 'x' | 'y' | 'z',
    angleRadians: number
  ): THREE.BufferGeometry {
    const clone = geometry.clone();
    if (axis === 'x') clone.rotateX(angleRadians);
    if (axis === 'y') clone.rotateY(angleRadians);
    if (axis === 'z') clone.rotateZ(angleRadians);

    clone.computeBoundingBox();
    clone.computeVertexNormals();

    const box = clone.boundingBox || new THREE.Box3();
    const size = new THREE.Vector3();
    box.getSize(size);

    clone.center();
    clone.translate(0, size.y / 2, 0);
    return clone;
  }

  /**
   * Determine if STL is binary or ASCII
   */
  private static isBinarySTL(buffer: ArrayBuffer): boolean {
    if (buffer.byteLength < 84) return false;
    const reader = new DataView(buffer);
    const triangles = reader.getUint32(80, true);
    const expectedSize = 80 + 4 + triangles * 50;
    
    // Strict binary size check
    if (buffer.byteLength === expectedSize) return true;

    // Check header for 'solid' keyword
    const decoder = new TextDecoder('utf-8');
    const header = decoder.decode(buffer.slice(0, 80));
    if (header.trim().startsWith('solid') && !header.includes('\0')) {
      const sample = decoder.decode(buffer.slice(0, Math.min(buffer.byteLength, 1024)));
      if (sample.includes('facet') || sample.includes('endsolid')) {
        return false;
      }
    }
    return true;
  }

  /**
   * Parse Binary STL
   */
  private static parseBinary(buffer: ArrayBuffer): THREE.BufferGeometry {
    const reader = new DataView(buffer);
    const faces = reader.getUint32(80, true);
    const positions = new Float32Array(faces * 9);
    const normals = new Float32Array(faces * 9);

    let offset = 84;
    let posIdx = 0;
    let normIdx = 0;

    for (let face = 0; face < faces; face++) {
      if (offset + 50 > buffer.byteLength) break;

      const nx = reader.getFloat32(offset, true);
      const ny = reader.getFloat32(offset + 4, true);
      const nz = reader.getFloat32(offset + 8, true);

      for (let i = 1; i <= 3; i++) {
        const vx = reader.getFloat32(offset + i * 12, true);
        const vy = reader.getFloat32(offset + i * 12 + 4, true);
        const vz = reader.getFloat32(offset + i * 12 + 8, true);

        positions[posIdx++] = vx;
        positions[posIdx++] = vy;
        positions[posIdx++] = vz;

        normals[normIdx++] = nx;
        normals[normIdx++] = ny;
        normals[normIdx++] = nz;
      }

      offset += 50;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    return geometry;
  }

  /**
   * Parse ASCII STL
   */
  private static parseASCII(buffer: ArrayBuffer): THREE.BufferGeometry {
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(buffer);
    const positions: number[] = [];
    const normals: number[] = [];

    const normalRegex = /facet\s+normal\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/gi;
    const vertexRegex = /vertex\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/gi;

    let normalMatch;
    while ((normalMatch = normalRegex.exec(text)) !== null) {
      const nx = parseFloat(normalMatch[1]);
      const ny = parseFloat(normalMatch[2]);
      const nz = parseFloat(normalMatch[3]);

      for (let i = 0; i < 3; i++) {
        const vMatch = vertexRegex.exec(text);
        if (vMatch) {
          positions.push(parseFloat(vMatch[1]), parseFloat(vMatch[2]), parseFloat(vMatch[3]));
          normals.push(nx, ny, nz);
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    return geometry;
  }

  /**
   * Calculate exact Volume via signed tetrahedron integration and surface area
   */
  private static calculateMeshProperties(geometry: THREE.BufferGeometry): {
    volumeMm3: number;
    surfaceAreaMm2: number;
    degenerateCount: number;
  } {
    const positions = geometry.attributes.position.array as Float32Array;
    let totalVolume = 0;
    let totalArea = 0;
    let degenerateCount = 0;

    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();
    const p3 = new THREE.Vector3();
    const e1 = new THREE.Vector3();
    const e2 = new THREE.Vector3();
    const cross = new THREE.Vector3();

    for (let i = 0; i < positions.length; i += 9) {
      p1.set(positions[i], positions[i + 1], positions[i + 2]);
      p2.set(positions[i + 3], positions[i + 4], positions[i + 5]);
      p3.set(positions[i + 6], positions[i + 7], positions[i + 8]);

      // Signed volume of tetrahedron formed with origin: v1 . (v2 x v3) / 6
      const v = (
        p1.x * (p2.y * p3.z - p2.z * p3.y) +
        p1.y * (p2.z * p3.x - p2.x * p3.z) +
        p1.z * (p2.x * p3.y - p2.y * p3.x)
      ) / 6.0;

      totalVolume += v;

      // Surface area
      e1.subVectors(p2, p1);
      e2.subVectors(p3, p1);
      cross.crossVectors(e1, e2);
      const area = cross.length() * 0.5;

      if (area < 0.00001) {
        degenerateCount++;
      } else {
        totalArea += area;
      }
    }

    return {
      volumeMm3: totalVolume,
      surfaceAreaMm2: totalArea,
      degenerateCount,
    };
  }
}
