import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Material, ModelConfiguration, STLGeometryData } from '../../types';
import {
  Camera,
  Compass,
  Crosshair,
  Eye,
  Maximize2,
  Minimize2,
  Move3d,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Sliders,
} from 'lucide-react';

interface STLViewer3DProps {
  geometry: THREE.BufferGeometry | null;
  geometryData: STLGeometryData | null;
  config: ModelConfiguration;
  material?: Material;
  height?: string;
  interactive?: boolean;
  showControls?: boolean;
  onOrientationChange?: () => void;
  extraHeaderLeft?: React.ReactNode;
  extraHeaderRight?: React.ReactNode;
}

export const STLViewer3D: React.FC<STLViewer3DProps> = ({
  geometry,
  geometryData,
  config,
  material,
  height = '500px',
  interactive = true,
  showControls = true,
  onOrientationChange,
  extraHeaderLeft,
  extraHeaderRight,
}) => {
  const normalContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const wireframeMeshRef = useRef<THREE.Mesh | null>(null);
  const boxHelperRef = useRef<THREE.Box3Helper | null>(null);
  const clipPlaneRef = useRef<THREE.Plane | null>(null);

  // Viewer State
  const [viewMode, setViewMode] = useState<'solid' | 'wireframe' | 'slicer'>('solid');
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [sliceProgress, setSliceProgress] = useState<number>(100); // 0 to 100%
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [rotationOffsets, setRotationOffsets] = useState<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0,
  });

  // Handle Fullscreen Escape key & scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Relocate Three.js canvas between normal and fullscreen containers & handle resize
  useEffect(() => {
    const target = isFullscreen ? fullscreenContainerRef.current : normalContainerRef.current;
    if (!target || !rendererRef.current || !cameraRef.current) return;

    if (!target.contains(rendererRef.current.domElement)) {
      target.appendChild(rendererRef.current.domElement);
    }

    const updateSize = () => {
      if (!target || !rendererRef.current || !cameraRef.current) return;
      const w = target.clientWidth;
      const h = target.clientHeight;
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(target);

    return () => {
      ro.disconnect();
    };
  }, [isFullscreen]);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!normalContainerRef.current) return;

    const container = normalContainerRef.current;
    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e0e);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 10000);
    camera.position.set(160, 140, 200);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI; // Allow full 360 vertical rotation to inspect the bottom of models
    controls.minPolarAngle = 0;
    controls.minDistance = 0.5;
    controls.maxDistance = 10000;
    controls.enabled = interactive;
    controlsRef.current = controls;

    // Responsive Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 5. Clean Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainKeyLight.position.set(150, 250, 150);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    scene.add(mainKeyLight);

    const fillLight = new THREE.DirectionalLight(0xa0c0ff, 0.4);
    fillLight.position.set(-150, 100, -100);
    scene.add(fillLight);

    const rimRedLight = new THREE.DirectionalLight(0xe10600, 0.9);
    rimRedLight.position.set(0, -40, -150);
    scene.add(rimRedLight);

    // Underside light to clearly illuminate the bottom of models when rotating underneath
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.75);
    bottomLight.position.set(0, -200, 0);
    scene.add(bottomLight);

    // 6. Clean Minimalist Print Bed (300mm x 300mm build area)
    const bedGroup = new THREE.Group();
    bedGroup.name = 'bedGroup';

    const plateGeo = new THREE.BoxGeometry(260, 2, 260);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.85,
      metalness: 0.1,
      transparent: true,
      opacity: 0.25, // Translucent bed allows clear view of the model underside
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.y = -1;
    plateMesh.receiveShadow = true;
    bedGroup.add(plateMesh);

    // Bed Grid Lines
    const grid = new THREE.GridHelper(260, 26, 0x444444, 0x222222);
    grid.position.y = 0.1;
    bedGroup.add(grid);

    scene.add(bedGroup);

    // 7. Clipping Plane for Slicer simulation
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 500);
    clipPlaneRef.current = clipPlane;

    // 8. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating && meshRef.current && interactive) {
        meshRef.current.rotation.y += 0.005;
        if (wireframeMeshRef.current) {
          wireframeMeshRef.current.rotation.y = meshRef.current.rotation.y;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [interactive]);

  // Update Geometry & Mesh when model, material or orientation changes
  useEffect(() => {
    if (!sceneRef.current || !geometry) return;

    const scene = sceneRef.current;

    // Remove existing meshes
    if (meshRef.current) {
      scene.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      meshRef.current = null;
    }
    if (wireframeMeshRef.current) {
      scene.remove(wireframeMeshRef.current);
      wireframeMeshRef.current.geometry.dispose();
      wireframeMeshRef.current = null;
    }
    if (boxHelperRef.current) {
      scene.remove(boxHelperRef.current);
      boxHelperRef.current = null;
    }

    // Clone geometry and apply manual orientation rotations
    const activeGeo = geometry.clone();
    if (rotationOffsets.x !== 0) activeGeo.rotateX(rotationOffsets.x);
    if (rotationOffsets.y !== 0) activeGeo.rotateY(rotationOffsets.y);
    if (rotationOffsets.z !== 0) activeGeo.rotateZ(rotationOffsets.z);

    activeGeo.computeBoundingBox();
    activeGeo.computeVertexNormals();

    const box = activeGeo.boundingBox || new THREE.Box3();
    const size = new THREE.Vector3();
    box.getSize(size);

    activeGeo.center();
    activeGeo.translate(0, size.y / 2, 0);

    // Determine Material Color & Finish
    const selectedColorHex = config.colorId
      ? material?.colors.find((c) => c.id === config.colorId)?.hex || '#E10600'
      : '#E10600';

    let roughness = 0.4;
    let metalness = 0.1;
    let clearcoat = 0.2;

    if (material?.finish === 'Matte') {
      roughness = 0.75;
      metalness = 0.05;
      clearcoat = 0.0;
    } else if (material?.finish === 'Glossy') {
      roughness = 0.25;
      metalness = 0.15;
      clearcoat = 0.6;
    } else if (material?.finish === 'Rubberized') {
      roughness = 0.85;
      metalness = 0.0;
    }

    const meshMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedColorHex),
      roughness,
      metalness,
      clearcoat,
      clearcoatRoughness: 0.1,
      clippingPlanes: viewMode === 'slicer' && clipPlaneRef.current ? [clipPlaneRef.current] : [],
      clipShadows: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(activeGeo, meshMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Apply scale factor
    const scale = (config.scalePercentage || 100) / 100;
    mesh.scale.set(scale, scale, scale);

    scene.add(mesh);
    meshRef.current = mesh;

    // Wireframe Mesh overlay if in wireframe mode
    if (viewMode === 'wireframe') {
      const wireGeo = new THREE.WireframeGeometry(activeGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
      });
      const wireMesh = new THREE.LineSegments(wireGeo, wireMat) as unknown as THREE.Mesh;
      wireMesh.scale.set(scale, scale, scale);
      scene.add(wireMesh);
      wireframeMeshRef.current = wireMesh;
    }

    // Bounding Box Helper if measurements enabled
    if (showMeasurements) {
      const currentBox = new THREE.Box3().setFromObject(mesh);
      const boxHelper = new THREE.Box3Helper(currentBox, new THREE.Color(0xe10600));
      scene.add(boxHelper);
      boxHelperRef.current = boxHelper;
    }

    // Auto fit camera safely
    if (cameraRef.current && controlsRef.current) {
      const currentBox = new THREE.Box3().setFromObject(mesh);
      const center = currentBox.getCenter(new THREE.Vector3());
      const currentSize = currentBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(currentSize.x, currentSize.y, currentSize.z);
      const safeDim = (!isFinite(maxDim) || maxDim <= 0) ? 60 : maxDim;

      controlsRef.current.target.copy(center);
      const distance = safeDim * 1.8;
      cameraRef.current.position.set(
        center.x + distance * 0.9,
        center.y + distance * 0.7,
        center.z + distance * 1.1
      );
      cameraRef.current.near = Math.max(0.1, safeDim / 200);
      cameraRef.current.far = Math.max(5000, safeDim * 30);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.lookAt(center);

      controlsRef.current.minDistance = Math.max(0.1, safeDim / 50);
      controlsRef.current.maxDistance = Math.max(1000, safeDim * 15);
      controlsRef.current.update();
    }
  }, [geometry, config.scalePercentage, config.colorId, material, viewMode, showMeasurements, rotationOffsets]);

  // Handle Slicer Clipping Plane Slider
  useEffect(() => {
    if (!clipPlaneRef.current || !meshRef.current) return;

    if (viewMode === 'slicer') {
      const box = new THREE.Box3().setFromObject(meshRef.current);
      const minY = box.min.y;
      const maxY = box.max.y;
      const height = maxY - minY;
      const currentCutY = minY + (height * sliceProgress) / 100;

      clipPlaneRef.current.constant = currentCutY;
    }
  }, [sliceProgress, viewMode]);

  // Orientation Actions
  const handleRotateAxis = (axis: 'x' | 'y' | 'z') => {
    setRotationOffsets((prev) => ({
      ...prev,
      [axis]: prev[axis] + Math.PI / 2,
    }));
    onOrientationChange?.();
  };

  const handleResetOrientation = () => {
    setRotationOffsets({ x: 0, y: 0, z: 0 });
    onOrientationChange?.();
  };

  // Camera presets
  const setCameraView = (view: 'top' | 'front' | 'side' | 'bottom' | 'iso' | 'reset') => {
    if (!cameraRef.current || !controlsRef.current || !meshRef.current) return;

    setIsRotating(false);
    const box = new THREE.Box3().setFromObject(meshRef.current);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 50);

    controlsRef.current.target.copy(center);

    switch (view) {
      case 'top':
        cameraRef.current.position.set(center.x, center.y + maxDim * 2.2, center.z + 0.001);
        break;
      case 'bottom':
        cameraRef.current.position.set(center.x, center.y - maxDim * 2.2, center.z + 0.001);
        break;
      case 'front':
        cameraRef.current.position.set(center.x, center.y + maxDim * 0.3, center.z + maxDim * 2.0);
        break;
      case 'side':
        cameraRef.current.position.set(center.x + maxDim * 2.0, center.y + maxDim * 0.3, center.z);
        break;
      case 'iso':
      case 'reset':
      default:
        cameraRef.current.position.set(center.x + maxDim * 1.5, center.y + maxDim * 1.3, center.z + maxDim * 1.7);
        break;
    }
    cameraRef.current.lookAt(center);
    controlsRef.current.update();
  };

  const scaleFactor = (config.scalePercentage || 100) / 100;
  const currentDims = geometryData
    ? {
        x: (geometryData.dimensions.x * scaleFactor).toFixed(1),
        y: (geometryData.dimensions.y * scaleFactor).toFixed(1),
        z: (geometryData.dimensions.z * scaleFactor).toFixed(1),
      }
    : { x: '0', y: '0', z: '0' };

  return (
    <>
      {/* Normal View Container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-[#0e0e0e] border border-white/10 group select-none shadow-2xl"
        style={{ height }}
      >
        {/* Three.js Canvas Container (Normal) */}
        <div ref={normalContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Normal Top Toolbar - Strictly 2 sides (Left & Right) with zero overlapping */}
        <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
          {/* Left: Dimensions and/or Part Badge */}
          <div className="flex items-center gap-2 pointer-events-auto min-w-0">
            {extraHeaderLeft}
            {geometryData && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-xs font-mono text-white shrink-0 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-brand-red shrink-0" />
                <span className="text-white/60 hidden sm:inline">Dim:</span>
                <span className="font-bold text-white whitespace-nowrap">
                  {currentDims.x} × {currentDims.y} × {currentDims.z} mm
                </span>
              </div>
            )}
          </div>

          {/* Right: Render Modes + Fullscreen + Extra Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0 ml-auto">
            {showControls && (
              <div className="flex items-center gap-1 bg-black/85 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs shadow-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('solid')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    viewMode === 'solid'
                      ? 'bg-brand-red text-white font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Solid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('wireframe')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    viewMode === 'wireframe'
                      ? 'bg-brand-red text-white font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Wireframe
                </button>
              </div>
            )}

            {/* Fullscreen Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 hover:border-brand-red text-white/70 hover:text-white transition-all shadow-lg flex items-center justify-center gap-1.5"
              title="Full Screen Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs font-mono">Full Screen</span>
            </button>

            {extraHeaderRight}
          </div>
        </div>

        {/* Slicer Slice Height Slider */}
        {viewMode === 'slicer' && (
          <div className="absolute bottom-16 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 z-20 p-3.5 rounded-xl bg-black/85 backdrop-blur-md border border-brand-red/40 shadow-2xl space-y-2 animate-slide-up">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-brand-redBright font-semibold flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Layer Slicing Cut
              </span>
              <span className="text-white font-bold">{sliceProgress}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={sliceProgress}
              onChange={(e) => setSliceProgress(Number(e.target.value))}
              className="w-full accent-brand-red cursor-pointer"
            />
          </div>
        )}

        {/* Bottom Floating Toolbar: Camera Presets, Orient Controls & Toggles */}
        {showControls && (
          <div className="absolute bottom-4 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Camera Angles (including Bottom view) */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-lg">
              <button
                onClick={() => setCameraView('iso')}
                className="px-2 py-1 rounded text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                ISO
              </button>
              <button
                onClick={() => setCameraView('top')}
                className="px-2 py-1 rounded text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                Top
              </button>
              <button
                onClick={() => setCameraView('bottom')}
                className="px-2 py-1 rounded text-xs font-mono text-brand-redBright font-semibold hover:text-white hover:bg-white/10 transition-colors"
                title="View Model Underside"
              >
                Bottom
              </button>
              <button
                onClick={() => setCameraView('front')}
                className="px-2 py-1 rounded text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                Front
              </button>
              <button
                onClick={() => setCameraView('side')}
                className="px-2 py-1 rounded text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                Side
              </button>
              <button
                onClick={() => setCameraView('reset')}
                className="p-1 rounded text-white/50 hover:text-brand-red transition-colors"
                title="Reset Camera View"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Model Orientation Controls (Comfortably located in bottom bar without crowding the top!) */}
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10 text-xs font-mono pointer-events-auto shadow-lg">
              <span className="text-[10px] text-white/50 uppercase pr-0.5 hidden sm:inline">Orient:</span>
              <button
                type="button"
                onClick={() => handleRotateAxis('x')}
                className="px-1.5 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors text-[11px]"
                title="Rotate 90° X"
              >
                ↺ X
              </button>
              <button
                type="button"
                onClick={() => handleRotateAxis('y')}
                className="px-1.5 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors text-[11px]"
                title="Rotate 90° Y"
              >
                ↻ Y
              </button>
              <button
                type="button"
                onClick={() => handleRotateAxis('z')}
                className="px-1.5 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors text-[11px]"
                title="Rotate 90° Z"
              >
                ↺ Z
              </button>
              <button
                type="button"
                onClick={handleResetOrientation}
                className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-brand-red transition-colors"
                title="Reset Orientation"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Auto-Rotate Toggle */}
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-lg">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  isRotating ? 'text-brand-red font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                Auto-Rotate: {isRotating ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Portaled Fullscreen Overlay (Completely immune to parent layout clipping, transforms or navbars) */}
      {isFullscreen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] w-screen h-screen bg-[#080808] select-none flex flex-col overflow-hidden animate-fade-in">
            {/* Fullscreen Dedicated Top Bar */}
            <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#0e0e0e] border-b border-white/10 backdrop-blur-md z-30 shrink-0">
              {/* Left: Badge & Dimensions */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse shrink-0" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-white whitespace-nowrap hidden sm:inline">
                    STL Fullscreen Inspector
                  </span>
                </div>
                {geometryData && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/80 border border-white/10 text-xs font-mono text-white shrink-0">
                    <span className="text-white/60 hidden md:inline">Dim:</span>
                    <span className="font-bold text-brand-redBright whitespace-nowrap">
                      {currentDims.x} × {currentDims.y} × {currentDims.z} mm
                    </span>
                  </div>
                )}
                {extraHeaderLeft}
              </div>

              {/* Center: Model Orientation Controls */}
              {showControls && (
                <div className="hidden lg:flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-xs font-mono">
                  <span className="text-[10px] text-white/50 uppercase pr-1">Orient:</span>
                  <button
                    type="button"
                    onClick={() => handleRotateAxis('x')}
                    className="px-2 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                    title="Rotate 90° X"
                  >
                    ↺ X
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRotateAxis('y')}
                    className="px-2 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                    title="Rotate 90° Y"
                  >
                    ↻ Y
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRotateAxis('z')}
                    className="px-2 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                    title="Rotate 90° Z"
                  >
                    ↺ Z
                  </button>
                  <button
                    type="button"
                    onClick={handleResetOrientation}
                    className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-brand-red transition-colors ml-1"
                    title="Reset Orientation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Right: Render Mode & Exit Fullscreen */}
              <div className="flex items-center gap-2.5 shrink-0">
                {showControls && (
                  <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('solid')}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                        viewMode === 'solid'
                          ? 'bg-brand-red text-white font-bold'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Solid
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('wireframe')}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                        viewMode === 'wireframe'
                          ? 'bg-brand-red text-white font-bold'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Wireframe
                    </button>
                  </div>
                )}

                {extraHeaderRight}

                {/* Exit Fullscreen Button */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-bold text-xs shadow-red-glow transition-all"
                  title="Exit Fullscreen (Esc)"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit Fullscreen</span>
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/30 text-[10px] font-mono text-white/80">
                    Esc
                  </kbd>
                </button>
              </div>
            </header>

            {/* Canvas Container in Fullscreen */}
            <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
              <div ref={fullscreenContainerRef} className="w-full h-full" />

              {/* Slicer Slice Height Slider */}
              {viewMode === 'slicer' && (
                <div className="absolute bottom-20 left-6 right-6 sm:left-auto sm:right-6 sm:w-80 z-20 p-4 rounded-2xl bg-black/90 backdrop-blur-md border border-brand-red/50 shadow-2xl space-y-2 animate-slide-up">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-brand-redBright font-semibold flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5" /> Layer Slicing Cut
                    </span>
                    <span className="text-white font-bold">{sliceProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={sliceProgress}
                    onChange={(e) => setSliceProgress(Number(e.target.value))}
                    className="w-full accent-brand-red cursor-pointer"
                  />
                </div>
              )}

              {/* Fullscreen Bottom Controls */}
              {showControls && (
                <div className="absolute bottom-6 inset-x-6 z-20 flex items-center justify-between pointer-events-none">
                  {/* Camera Angles */}
                  <div className="flex items-center gap-1 bg-black/85 backdrop-blur-md p-1.5 rounded-xl border border-white/10 pointer-events-auto shadow-2xl">
                    <button
                      onClick={() => setCameraView('iso')}
                      className="px-3 py-1.5 rounded text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      ISO
                    </button>
                    <button
                      onClick={() => setCameraView('top')}
                      className="px-3 py-1.5 rounded text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Top
                    </button>
                    <button
                      onClick={() => setCameraView('bottom')}
                      className="px-3 py-1.5 rounded text-xs font-mono text-brand-redBright font-semibold hover:text-white hover:bg-white/10 transition-colors"
                      title="View Model Underside"
                    >
                      Bottom
                    </button>
                    <button
                      onClick={() => setCameraView('front')}
                      className="px-3 py-1.5 rounded text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Front
                    </button>
                    <button
                      onClick={() => setCameraView('side')}
                      className="px-3 py-1.5 rounded text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Side
                    </button>
                    <button
                      onClick={() => setCameraView('reset')}
                      className="p-1.5 rounded text-white/50 hover:text-brand-red transition-colors"
                      title="Reset Camera View"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Auto-Rotate Toggle */}
                  <div className="flex items-center gap-1 bg-black/85 backdrop-blur-md p-1.5 rounded-xl border border-white/10 pointer-events-auto shadow-2xl">
                    <button
                      onClick={() => setIsRotating(!isRotating)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                        isRotating ? 'text-brand-red font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Auto-Rotate: {isRotating ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
