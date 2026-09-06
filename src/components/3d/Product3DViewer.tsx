import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ProceduralModelService } from '../../services/3d/proceduralModels';
import { STLParserService } from '../../services/3d/stlParser';
import { Eye, RotateCw } from 'lucide-react';

interface Product3DViewerProps {
  modelKey: string;
  colorHex?: string;
  height?: string;
  interactive?: boolean;
  autoRotate?: boolean;
  showControls?: boolean;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  modelKey,
  colorHex = '#E10600',
  height = '240px',
  interactive = true,
  autoRotate = true,
  showControls = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Generate geometry
  const geometry = useMemo(() => {
    return ProceduralModelService.generateGeometry(modelKey);
  }, [modelKey]);

  useEffect(() => {
    if (!containerRef.current || !geometry) return;

    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const heightPx = container.clientHeight || 240;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e0e);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 1, 1000);
    camera.position.set(120, 90, 140);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = interactive;
    controls.enablePan = false;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.0;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(100, 150, 100);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe10600, 1.1);
    rimLight.position.set(-100, -50, -100);
    scene.add(rimLight);

    // Mesh
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: 0.35,
      metalness: 0.15,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // Center camera on object
    const box = new THREE.Box3().setFromObject(mesh);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    controls.target.copy(center);
    camera.position.set(center.x + maxDim * 1.5, center.y + maxDim * 1.1, center.z + maxDim * 1.6);
    camera.lookAt(center);
    controls.update();

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [geometry, colorHex, interactive, autoRotate]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden bg-[#0e0e0e] group select-none cursor-grab active:cursor-grabbing"
      style={{ height }}
    >
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono text-white/80 border border-white/10 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
        <span>Live 3D CAD</span>
      </div>
    </div>
  );
};
