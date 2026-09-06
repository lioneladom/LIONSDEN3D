import * as THREE from 'three';

export interface SampleModelMeta {
  key: string;
  name: string;
  category: string;
  description: string;
  defaultDims: { x: number; y: number; z: number };
  recommendedMaterial: string;
  previewColor: string;
  icon: string;
}

export const SAMPLE_MODELS: SampleModelMeta[] = [
  {
    key: 'lion-emblem',
    name: 'Lion’s Den Geometric Crest',
    category: 'Showcase / Crest',
    description: 'Relief emblem featuring the iconic geometric Lion’s Den head on a beveled industrial shield.',
    defaultDims: { x: 95, y: 80, z: 22 },
    recommendedMaterial: 'pla',
    previewColor: '#E10600',
    icon: 'Shield',
  },
  {
    key: 'helical-gear',
    name: 'Precision Helical Dual-Gear',
    category: 'Engineering / Functional',
    description: 'High-torque 18-tooth herringbone planetary gear with keyed 8mm shaft collar.',
    defaultDims: { x: 75, y: 75, z: 35 },
    recommendedMaterial: 'petg',
    previewColor: '#A3A3A3',
    icon: 'Cog',
  },
  {
    key: 'lowpoly-dragon',
    name: 'Low-Poly Guardian Dragon',
    category: 'Figures / Art',
    description: 'Faceted geometric dragon figurine optimized for high-detail desktop printing.',
    defaultDims: { x: 110, y: 85, z: 95 },
    recommendedMaterial: 'abs',
    previewColor: '#171717',
    icon: 'Sparkles',
  },
  {
    key: 'drone-arm',
    name: 'Industrial Drone Motor Arm',
    category: 'Robotics / Aerospace',
    description: 'Aerodynamic brushless motor arm with integrated zip-tie channels and dampener recesses.',
    defaultDims: { x: 130, y: 45, z: 28 },
    recommendedMaterial: 'tpu',
    previewColor: '#E10600',
    icon: 'Crosshair',
  },
  {
    key: 'headphone-stand',
    name: 'Apex Modern Headphone Stand',
    category: 'Desk Items',
    description: 'Cantilevered geometric arch with weighted base and integrated cable management perch.',
    defaultDims: { x: 120, y: 110, z: 220 },
    recommendedMaterial: 'petg',
    previewColor: '#111111',
    icon: 'Headphones',
  },
  {
    key: 'controller-dock',
    name: 'Stealth Controller Dock',
    category: 'Gaming',
    description: 'Ergonomic dual controller cradle with angled resting bays and USB-C pass-through channels.',
    defaultDims: { x: 150, y: 90, z: 80 },
    recommendedMaterial: 'pla',
    previewColor: '#E10600',
    icon: 'Gamepad2',
  },
  {
    key: 'robot-gripper',
    name: 'Articulated Robot End-Effector',
    category: 'Robotics / Functional',
    description: 'Dual-jaw compliant robotic gripper mechanism for automated pick-and-place payloads.',
    defaultDims: { x: 88, y: 64, z: 42 },
    recommendedMaterial: 'petg',
    previewColor: '#FFFFFF',
    icon: 'Cpu',
  },
  {
    key: 'cyber-planter',
    name: 'Geometric Hexagon Planter',
    category: 'Decor & Living',
    description: 'Modern faceted succulent pot with internal self-watering reservoir and drainage slots.',
    defaultDims: { x: 90, y: 90, z: 85 },
    recommendedMaterial: 'pla',
    previewColor: '#E10600',
    icon: 'Flower2',
  },
];

export interface SampleAssemblyPartMeta {
  key: string;
  name: string;
  filename: string;
}

export interface SampleAssemblyMeta {
  key: string;
  name: string;
  category: string;
  description: string;
  parts: SampleAssemblyPartMeta[];
}

export const SAMPLE_ASSEMBLIES: SampleAssemblyMeta[] = [
  {
    key: 'assembly-gripper',
    name: '2-Part Robotic End-Effector Assembly',
    category: 'Multi-Part Assembly',
    description: 'Dual-part robotics assembly with base mounting arm and articulated claw effector.',
    parts: [
      { key: 'drone-arm', name: 'Part 1: Mounting Arm', filename: 'gripper_mount_arm.stl' },
      { key: 'robot-gripper', name: 'Part 2: Articulated Claw', filename: 'gripper_claw.stl' },
    ],
  },
  {
    key: 'assembly-gearbox',
    name: '2-Part Helical Planetary Assembly',
    category: 'Multi-Part Assembly',
    description: 'Interlocking mechanical assembly with herringbone gear and chassis cradle.',
    parts: [
      { key: 'helical-gear', name: 'Part 1: Dual Helical Gear', filename: 'helical_drive_gear.stl' },
      { key: 'controller-dock', name: 'Part 2: Gearbox Cradle Base', filename: 'gearbox_cradle.stl' },
    ],
  },
  {
    key: 'assembly-crest',
    name: '2-Part Lion’s Den Trophy Assembly',
    category: 'Multi-Part Assembly',
    description: 'Two-piece showcase assembly with geometric crest and cantilever display stand.',
    parts: [
      { key: 'lion-emblem', name: 'Part 1: Lion Emblem Core', filename: 'lion_crest.stl' },
      { key: 'headphone-stand', name: 'Part 2: Pedestal Base Stand', filename: 'pedestal_base.stl' },
    ],
  },
];

export class ProceduralModelService {
  /**
   * Generates a Three.js BufferGeometry for any of the 8 3D models
   */
  public static generateGeometry(key: string): THREE.BufferGeometry {
    switch (key) {
      case 'lion-emblem':
        return this.createLionEmblem();
      case 'helical-gear':
        return this.createHelicalGear();
      case 'lowpoly-dragon':
        return this.createDragonModel();
      case 'drone-arm':
      case 'drone-mount':
        return this.createDroneArm();
      case 'headphone-stand':
        return this.createHeadphoneStand();
      case 'controller-dock':
        return this.createControllerDock();
      case 'robot-gripper':
        return this.createRobotGripper();
      case 'cyber-planter':
        return this.createCyberPlanter();
      default:
        return this.createLionEmblem();
    }
  }

  /**
   * Convert Three.js BufferGeometry to a valid Binary STL ArrayBuffer
   */
  public static geometryToBinarySTL(geometry: THREE.BufferGeometry): ArrayBuffer {
    const nonIndexed = geometry.index ? geometry.toNonIndexed() : geometry;
    const positions = nonIndexed.attributes.position.array as Float32Array;
    const triangleCount = positions.length / 9;

    const bufferSize = 84 + triangleCount * 50;
    const buffer = new ArrayBuffer(bufferSize);
    const view = new DataView(buffer);

    // 80-byte header
    const header = 'Lion’s Den 3D Binary STL Generator — lionden3d.com';
    for (let i = 0; i < 80; i++) {
      view.setUint8(i, i < header.length ? header.charCodeAt(i) : 32);
    }

    // Number of triangles
    view.setUint32(80, triangleCount, true);

    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();

    let offset = 84;
    for (let i = 0; i < positions.length; i += 9) {
      vA.set(positions[i], positions[i + 1], positions[i + 2]);
      vB.set(positions[i + 3], positions[i + 4], positions[i + 5]);
      vC.set(positions[i + 6], positions[i + 7], positions[i + 8]);

      // Calculate facet normal
      cb.subVectors(vC, vB);
      ab.subVectors(vA, vB);
      cb.cross(ab).normalize();

      // Normal
      view.setFloat32(offset, cb.x, true);
      view.setFloat32(offset + 4, cb.y, true);
      view.setFloat32(offset + 8, cb.z, true);

      // Vertex 1
      view.setFloat32(offset + 12, vA.x, true);
      view.setFloat32(offset + 16, vA.y, true);
      view.setFloat32(offset + 20, vA.z, true);

      // Vertex 2
      view.setFloat32(offset + 24, vB.x, true);
      view.setFloat32(offset + 28, vB.y, true);
      view.setFloat32(offset + 32, vB.z, true);

      // Vertex 3
      view.setFloat32(offset + 36, vC.x, true);
      view.setFloat32(offset + 40, vC.y, true);
      view.setFloat32(offset + 44, vC.z, true);

      // Attribute byte count (0)
      view.setUint16(offset + 48, 0, true);

      offset += 50;
    }

    return buffer;
  }

  // --- Procedural Generators ---

  private static createLionEmblem(): THREE.BufferGeometry {
    const group = new THREE.Group();

    // Shield base
    const baseShape = new THREE.Shape();
    const w = 45;
    const h = 40;
    const bevel = 12;
    baseShape.moveTo(-w + bevel, -h);
    baseShape.lineTo(w - bevel, -h);
    baseShape.lineTo(w, -h + bevel);
    baseShape.lineTo(w, h - bevel * 1.5);
    baseShape.lineTo(0, h);
    baseShape.lineTo(-w, h - bevel * 1.5);
    baseShape.lineTo(-w, -h + bevel);
    baseShape.closePath();

    const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
      depth: 8,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 2,
      bevelThickness: 2,
    });
    baseGeo.rotateX(-Math.PI / 2);
    group.add(new THREE.Mesh(baseGeo));

    // Outer Torus Ring
    const rimGeo = new THREE.TorusGeometry(26, 2.5, 8, 32);
    rimGeo.rotateX(Math.PI / 2);
    rimGeo.translate(0, 10, 0);
    group.add(new THREE.Mesh(rimGeo));

    // Mane Facets
    const maneGeo = new THREE.ConeGeometry(20, 14, 6);
    maneGeo.rotateX(-Math.PI / 3);
    maneGeo.translate(0, 12, -2);
    group.add(new THREE.Mesh(maneGeo));

    // Snout
    const snoutGeo = new THREE.BoxGeometry(10, 8, 12);
    snoutGeo.translate(0, 13, 6);
    group.add(new THREE.Mesh(snoutGeo));

    // Crown Spikes
    for (let angle = -0.8; angle <= 0.8; angle += 0.4) {
      const spikeGeo = new THREE.ConeGeometry(3, 10, 4);
      spikeGeo.rotateZ(angle);
      spikeGeo.translate(Math.sin(angle) * 22, 11, Math.cos(angle) * 18 - 8);
      group.add(new THREE.Mesh(spikeGeo));
    }

    return this.cleanAndCenter(group);
  }

  private static createHelicalGear(): THREE.BufferGeometry {
    const group = new THREE.Group();

    // Main Gear Body (Cylinder)
    const bodyGeo = new THREE.CylinderGeometry(34, 34, 28, 36);
    group.add(new THREE.Mesh(bodyGeo));

    // Teeth (18 Involute Helical Teeth)
    const teethCount = 18;
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      const toothGeo = new THREE.BoxGeometry(6, 26, 9);
      toothGeo.rotateY(0.25);
      toothGeo.translate(34 * Math.cos(angle), 0, 34 * Math.sin(angle));
      group.add(new THREE.Mesh(toothGeo));
    }

    // Weight reduction pockets
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const pocket = new THREE.TorusGeometry(18, 4, 8, 16);
      pocket.rotateX(Math.PI / 2);
      pocket.translate(18 * Math.cos(angle), 0, 18 * Math.sin(angle));
      group.add(new THREE.Mesh(pocket));
    }

    return this.cleanAndCenter(group);
  }

  private static createDragonModel(): THREE.BufferGeometry {
    const group = new THREE.Group();

    // Body
    const bodyGeo = new THREE.DodecahedronGeometry(28, 1);
    bodyGeo.scale(1, 1.4, 1.1);
    group.add(new THREE.Mesh(bodyGeo));

    // Head
    const headGeo = new THREE.ConeGeometry(14, 28, 5);
    headGeo.rotateX(Math.PI / 2.5);
    headGeo.translate(0, 32, 16);
    group.add(new THREE.Mesh(headGeo));

    // Horns
    const hornL = new THREE.ConeGeometry(4, 24, 4);
    hornL.rotateZ(-0.4);
    hornL.rotateX(-0.3);
    hornL.translate(-12, 44, 4);
    group.add(new THREE.Mesh(hornL));

    const hornR = new THREE.ConeGeometry(4, 24, 4);
    hornR.rotateZ(0.4);
    hornR.rotateX(-0.3);
    hornR.translate(12, 44, 4);
    group.add(new THREE.Mesh(hornR));

    // Wings
    const wingL = new THREE.BoxGeometry(38, 28, 3);
    wingL.rotateY(0.4);
    wingL.rotateZ(0.5);
    wingL.translate(-30, 22, -10);
    group.add(new THREE.Mesh(wingL));

    const wingR = new THREE.BoxGeometry(38, 28, 3);
    wingR.rotateY(-0.4);
    wingR.rotateZ(-0.5);
    wingR.translate(30, 22, -10);
    group.add(new THREE.Mesh(wingR));

    // Pedestal
    const baseGeo = new THREE.CylinderGeometry(36, 40, 10, 8);
    baseGeo.translate(0, -32, 0);
    group.add(new THREE.Mesh(baseGeo));

    return this.cleanAndCenter(group);
  }

  private static createDroneArm(): THREE.BufferGeometry {
    const group = new THREE.Group();

    // Arm spar
    const armGeo = new THREE.BoxGeometry(110, 16, 14);
    group.add(new THREE.Mesh(armGeo));

    // Motor Bell Mount
    const motorMount = new THREE.CylinderGeometry(20, 20, 12, 24);
    motorMount.translate(50, 4, 0);
    group.add(new THREE.Mesh(motorMount));

    // Fuselage clamp
    const clampGeo = new THREE.BoxGeometry(26, 24, 22);
    clampGeo.translate(-45, 0, 0);
    group.add(new THREE.Mesh(clampGeo));

    // Reinforcement rib
    const ribGeo = new THREE.BoxGeometry(70, 8, 4);
    ribGeo.translate(0, 10, 0);
    group.add(new THREE.Mesh(ribGeo));

    return this.cleanAndCenter(group);
  }

  private static createHeadphoneStand(): THREE.BufferGeometry {
    const group = new THREE.Group();

    // Heavy Weighted Base
    const baseGeo = new THREE.CylinderGeometry(55, 60, 14, 32);
    group.add(new THREE.Mesh(baseGeo));

    // Cantilevered Spine Mast
    const mastGeo = new THREE.BoxGeometry(18, 190, 24);
    mastGeo.rotateZ(-0.08);
    mastGeo.translate(-6, 100, 0);
    group.add(new THREE.Mesh(mastGeo));

    // Curved Headband Cradle Rest
    const cradleGeo = new THREE.TorusGeometry(34, 12, 12, 24, Math.PI);
    cradleGeo.rotateZ(Math.PI);
    cradleGeo.translate(0, 200, 0);
    group.add(new THREE.Mesh(cradleGeo));

    // Cable Management Hook
    const hookGeo = new THREE.BoxGeometry(20, 8, 28);
    hookGeo.translate(-16, 80, 0);
    group.add(new THREE.Mesh(hookGeo));

    return this.cleanAndCenter(group);
  }

  private static createControllerDock(): THREE.BufferGeometry {
    const group = new THREE.Group();

    // Angled Base Dock
    const baseGeo = new THREE.BoxGeometry(140, 24, 85);
    group.add(new THREE.Mesh(baseGeo));

    // Dual Controller Rest Slopes
    const slopeL = new THREE.BoxGeometry(50, 40, 40);
    slopeL.rotateX(0.4);
    slopeL.translate(-35, 20, -5);
    group.add(new THREE.Mesh(slopeL));

    const slopeR = new THREE.BoxGeometry(50, 40, 40);
    slopeR.rotateX(0.4);
    slopeR.translate(35, 20, -5);
    group.add(new THREE.Mesh(slopeR));

    // Center divider ridge
    const ridgeGeo = new THREE.BoxGeometry(12, 45, 60);
    ridgeGeo.translate(0, 22, 0);
    group.add(new THREE.Mesh(ridgeGeo));

    return this.cleanAndCenter(group);
  }

  private static createRobotGripper(): THREE.BufferGeometry {
    const group = new THREE.Group();

    // Servo Housing Base
    const baseGeo = new THREE.BoxGeometry(40, 36, 32);
    group.add(new THREE.Mesh(baseGeo));

    // Left Finger
    const fingerL1 = new THREE.BoxGeometry(10, 45, 12);
    fingerL1.rotateZ(0.2);
    fingerL1.translate(-22, 30, 0);
    group.add(new THREE.Mesh(fingerL1));

    const tipL = new THREE.ConeGeometry(6, 16, 4);
    tipL.rotateZ(-0.6);
    tipL.translate(-14, 52, 0);
    group.add(new THREE.Mesh(tipL));

    // Right Finger
    const fingerR1 = new THREE.BoxGeometry(10, 45, 12);
    fingerR1.rotateZ(-0.2);
    fingerR1.translate(22, 30, 0);
    group.add(new THREE.Mesh(fingerR1));

    const tipR = new THREE.ConeGeometry(6, 16, 4);
    tipR.rotateZ(0.6);
    tipR.translate(14, 52, 0);
    group.add(new THREE.Mesh(tipR));

    // Mounting Flange
    const flange = new THREE.CylinderGeometry(18, 18, 8, 16);
    flange.translate(0, -20, 0);
    group.add(new THREE.Mesh(flange));

    return this.cleanAndCenter(group);
  }

  private static createCyberPlanter(): THREE.BufferGeometry {
    const group = new THREE.Group();

    // Hexagonal Faceted Pot Body
    const potGeo = new THREE.CylinderGeometry(42, 30, 70, 6);
    group.add(new THREE.Mesh(potGeo));

    // Geometric Facet Cutouts around rim
    const rimGeo = new THREE.TorusGeometry(38, 4, 6, 6);
    rimGeo.rotateX(Math.PI / 2);
    rimGeo.translate(0, 35, 0);
    group.add(new THREE.Mesh(rimGeo));

    // Base Saucer Tray
    const trayGeo = new THREE.CylinderGeometry(34, 38, 10, 6);
    trayGeo.translate(0, -38, 0);
    group.add(new THREE.Mesh(trayGeo));

    return this.cleanAndCenter(group);
  }

  private static cleanAndCenter(group: THREE.Group): THREE.BufferGeometry {
    const merged = this.mergeGroupGeometries(group);
    merged.computeBoundingBox();
    const box = merged.boundingBox || new THREE.Box3();
    const size = new THREE.Vector3();
    box.getSize(size);
    merged.center();
    merged.translate(0, size.y / 2, 0);
    return merged;
  }

  private static mergeGroupGeometries(group: THREE.Group): THREE.BufferGeometry {
    const geometries: THREE.BufferGeometry[] = [];
    group.updateMatrixWorld(true);

    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geom = mesh.geometry.clone();
        geom.applyMatrix4(mesh.matrixWorld);
        geometries.push(geom.toNonIndexed());
      }
    });

    let totalPositions = 0;
    geometries.forEach((g) => {
      totalPositions += g.attributes.position.array.length;
    });

    const mergedPositions = new Float32Array(totalPositions);
    let offset = 0;
    geometries.forEach((g) => {
      mergedPositions.set(g.attributes.position.array, offset);
      offset += g.attributes.position.array.length;
    });

    const mergedGeometry = new THREE.BufferGeometry();
    mergedGeometry.setAttribute('position', new THREE.BufferAttribute(mergedPositions, 3));
    mergedGeometry.computeVertexNormals();
    return mergedGeometry;
  }
}
