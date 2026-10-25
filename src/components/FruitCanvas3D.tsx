import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type FruitPreset = 'citrus' | 'strawberry' | 'tropical';

interface FruitCanvas3DProps {
  className?: string;
  preset?: FruitPreset;
  onPresetChange?: (preset: FruitPreset) => void;
}

export const FruitCanvas3D: React.FC<FruitCanvas3DProps> = ({
  className = '',
  preset = 'citrus',
  onPresetChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<FruitPreset>(preset);
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Sync internal preset if prop changes
  useEffect(() => {
    setActivePreset(preset);
  }, [preset]);

  // Animation and interaction state
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const manualRotationRef = useRef({ x: 0.35, y: -0.3 });
  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  const currentPresetRef = useRef(activePreset);
  currentPresetRef.current = activePreset;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 480;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 6.4);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Studio Lighting Rig (Warm Key + Cool Fill + Sharp Rim)
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.9);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffedd5, 0xdcfce7, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xff9800, 2.4);
    keyLight.position.set(3.5, 4.5, 3.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x84cc16, 1.4);
    fillLight.position.set(-3.5, -2, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 2.6, 8);
    rimLight.position.set(0, 3.5, -2.5);
    scene.add(rimLight);

    // Master Group for 3D Fruit Scene
    const masterFruitGroup = new THREE.Group();
    masterFruitGroup.scale.set(0.72, 0.72, 0.72);
    scene.add(masterFruitGroup);

    // Sub-groups for presets
    const citrusGroup = new THREE.Group();
    const strawberryGroup = new THREE.Group();
    const tropicalGroup = new THREE.Group();

    masterFruitGroup.add(citrusGroup);
    masterFruitGroup.add(strawberryGroup);
    masterFruitGroup.add(tropicalGroup);

    // --- PROCEDURAL 3D FRUIT CREATION ---

    // A. Procedural Citrus Wheel (Orange / Lime / Grapefruit)
    function createCitrusSlice(
      radius: number,
      thickness: number,
      rindColor: number,
      pulpColor: number,
      segmentsCount = 8
    ) {
      const group = new THREE.Group();

      // Outer Rind Ring
      const rindGeo = new THREE.CylinderGeometry(radius, radius, thickness, 36, 1, true);
      const rindMat = new THREE.MeshStandardMaterial({
        color: rindColor,
        roughness: 0.38,
        metalness: 0.05,
      });
      const rind = new THREE.Mesh(rindGeo, rindMat);
      group.add(rind);

      // Inner White Pith Layer
      const pithGeo = new THREE.CylinderGeometry(radius * 0.97, radius * 0.97, thickness * 0.97, 36, 1, false);
      const pithMat = new THREE.MeshStandardMaterial({
        color: 0xfffbeb,
        roughness: 0.55,
      });
      const pith = new THREE.Mesh(pithGeo, pithMat);
      group.add(pith);

      // Pulp Segments (Juicy translucency & physical depth)
      const angleStep = (Math.PI * 2) / segmentsCount;
      const pulpMat = new THREE.MeshPhysicalMaterial({
        color: pulpColor,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 0.95,
        clearcoatRoughness: 0.12,
        transmission: isSoftwareGl ? 0 : 0.45,
        transparent: true,
        opacity: isSoftwareGl ? 0.88 : 0.96,
      });

      for (let i = 0; i < segmentsCount; i++) {
        const shape = new THREE.Shape();
        const startAngle = i * angleStep + 0.05;
        const endAngle = (i + 1) * angleStep - 0.05;
        const innerR = radius * 0.16;
        const outerR = radius * 0.9;

        shape.moveTo(Math.cos(startAngle) * innerR, Math.sin(startAngle) * innerR);
        shape.lineTo(Math.cos(startAngle) * outerR, Math.sin(startAngle) * outerR);
        shape.absarc(0, 0, outerR, startAngle, endAngle, false);
        shape.lineTo(Math.cos(endAngle) * innerR, Math.sin(endAngle) * innerR);
        shape.absarc(0, 0, innerR, endAngle, startAngle, true);

        const extrudeSettings = {
          depth: thickness * 0.96,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.02,
          bevelThickness: 0.02,
        };

        const segmentGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        segmentGeo.center();
        const segmentMesh = new THREE.Mesh(segmentGeo, pulpMat);
        segmentMesh.rotation.x = Math.PI / 2;
        group.add(segmentMesh);
      }

      // Center Seed Core
      const coreGeo = new THREE.CylinderGeometry(radius * 0.14, radius * 0.14, thickness * 1.02, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.5,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      return group;
    }

    // B. Procedural Strawberry
    function createStrawberry() {
      const group = new THREE.Group();

      const points: THREE.Vector2[] = [];
      const steps = 18;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const y = (1 - t) * 1.3 - 0.65;
        const x = Math.sin(t * Math.PI) * (0.7 * (1 - t * 0.35));
        points.push(new THREE.Vector2(x, y));
      }
      const berryGeo = new THREE.LatheGeometry(points, 24);
      const berryMat = new THREE.MeshPhysicalMaterial({
        color: 0xd91636,
        roughness: 0.22,
        metalness: 0.08,
        clearcoat: 0.9,
        clearcoatRoughness: 0.18,
      });
      const berryMesh = new THREE.Mesh(berryGeo, berryMat);
      group.add(berryMesh);

      // Calyx Leaves
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.4,
        side: THREE.DoubleSide,
      });
      const numLeaves = 5;
      for (let i = 0; i < numLeaves; i++) {
        const leafGeo = new THREE.ConeGeometry(0.2, 0.48, 4);
        leafGeo.translate(0, 0.24, 0);
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        const angle = (i * Math.PI * 2) / numLeaves;
        leaf.position.set(0, 0.6, 0);
        leaf.rotation.z = 1.1;
        leaf.rotation.y = angle;
        group.add(leaf);
      }

      // Stem
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.36, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.5 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.78;
      group.add(stem);

      return group;
    }

    // C. Procedural Spearmint Leaves
    function createMintLeaf(scale = 1) {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.bezierCurveTo(0.35, 0.45, 0.55, 0.85, 0, 1.5);
      shape.bezierCurveTo(-0.55, 0.85, -0.35, 0.45, 0, 0);

      const leafGeo = new THREE.ShapeGeometry(shape, 8);
      const leafMat = new THREE.MeshPhysicalMaterial({
        color: 0x22c55e,
        roughness: 0.3,
        metalness: 0.05,
        clearcoat: 0.6,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(leafGeo, leafMat);
      mesh.scale.set(scale, scale, scale);
      return mesh;
    }

    // D. Crystalline Dewdrop
    function createDewDrop(radius: number) {
      const dropGeo = new THREE.SphereGeometry(radius, 16, 16);
      const dropMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.04,
        metalness: 0.0,
        clearcoat: 1.0,
        transmission: isSoftwareGl ? 0 : 0.9,
        transparent: true,
        opacity: isSoftwareGl ? 0.7 : 0.95,
        ior: 1.33,
      });
      return new THREE.Mesh(dropGeo, dropMat);
    }

    // --- POPULATE PRESETS ---

    // 1. CITRUS PRESET (Nagpur Orange Hero + Lime + Mint + Drops)
    const orangeSlice = createCitrusSlice(1.35, 0.22, 0xe65100, 0xff7700, 8);
    orangeSlice.position.set(0, 0.1, 0);
    citrusGroup.add(orangeSlice);

    const limeSlice = createCitrusSlice(0.85, 0.16, 0x4d7c0f, 0x84cc16, 8);
    limeSlice.position.set(1.65, 1.15, -0.6);
    limeSlice.rotation.set(-0.35, 0.5, -0.2);
    citrusGroup.add(limeSlice);

    const mintCitrus1 = createMintLeaf(0.7);
    mintCitrus1.position.set(-1.2, 1.3, 0.3);
    mintCitrus1.rotation.set(-0.3, 0.4, 0.8);
    citrusGroup.add(mintCitrus1);

    const mintCitrus2 = createMintLeaf(0.55);
    mintCitrus2.position.set(1.35, -1.15, 0.25);
    mintCitrus2.rotation.set(0.5, -0.6, -0.9);
    citrusGroup.add(mintCitrus2);

    for (let i = 0; i < 5; i++) {
      const d = createDewDrop(0.06 + (i % 3) * 0.03);
      const a = (i * Math.PI * 2) / 5;
      d.position.set(Math.cos(a) * 1.5, Math.sin(a) * 1.3, 0.5 + (i % 2) * 0.3);
      citrusGroup.add(d);
    }

    // 2. STRAWBERRY PRESET (Large Center Strawberry + Mini Strawberries + Mint Sprig)
    const heroBerry = createStrawberry();
    heroBerry.scale.set(1.5, 1.5, 1.5);
    heroBerry.position.set(0, 0, 0);
    strawberryGroup.add(heroBerry);

    const miniBerry1 = createStrawberry();
    miniBerry1.scale.set(0.85, 0.85, 0.85);
    miniBerry1.position.set(1.5, 0.9, -0.4);
    miniBerry1.rotation.set(0.3, -0.4, -0.5);
    strawberryGroup.add(miniBerry1);

    const miniBerry2 = createStrawberry();
    miniBerry2.scale.set(0.75, 0.75, 0.75);
    miniBerry2.position.set(-1.4, -0.85, 0.3);
    miniBerry2.rotation.set(-0.4, 0.5, 0.6);
    strawberryGroup.add(miniBerry2);

    const mintBerry = createMintLeaf(0.85);
    mintBerry.position.set(-0.9, 1.25, 0.4);
    mintBerry.rotation.set(-0.4, 0.5, 0.9);
    strawberryGroup.add(mintBerry);

    // 3. TROPICAL PRESET (Dual Overlapping Grapefruit & Kiwi Wheels)
    const tropicalOrange = createCitrusSlice(1.3, 0.22, 0xd84315, 0xff5722, 10);
    tropicalOrange.position.set(-0.35, -0.1, 0.1);
    tropicalGroup.add(tropicalOrange);

    const kiwiSlice = createCitrusSlice(1.0, 0.18, 0x558b2f, 0x7cb342, 10);
    kiwiSlice.position.set(1.1, 0.8, -0.3);
    kiwiSlice.rotation.set(0.4, -0.4, 0.3);
    tropicalGroup.add(kiwiSlice);

    const mintTrop = createMintLeaf(0.75);
    mintTrop.position.set(0.8, -1.2, 0.4);
    mintTrop.rotation.set(0.3, -0.4, -1.0);
    tropicalGroup.add(mintTrop);

    // Initial visibility according to active preset
    citrusGroup.visible = currentPresetRef.current === 'citrus';
    strawberryGroup.visible = currentPresetRef.current === 'strawberry';
    tropicalGroup.visible = currentPresetRef.current === 'tropical';

    // Pointer Parallax & 360 Drag Interaction
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousPointerPosRef.current.x;
        const deltaY = e.clientY - previousPointerPosRef.current.y;
        manualRotationRef.current.y += deltaX * 0.01;
        manualRotationRef.current.x += deltaY * 0.01;
        // Clamp vertical tilt
        manualRotationRef.current.x = Math.max(-1.2, Math.min(1.2, manualRotationRef.current.x));
        previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
      } else {
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouseTargetRef.current = {
          x: Math.max(-1, Math.min(1, nx)) * 0.45,
          y: Math.max(-1, Math.min(1, ny)) * 0.35,
        };
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);

    // Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Render loop with software WebGL pacing guard
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 6);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 6);
    }

    function tick() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Dynamic preset visibility switch
      citrusGroup.visible = currentPresetRef.current === 'citrus';
      strawberryGroup.visible = currentPresetRef.current === 'strawberry';
      tropicalGroup.visible = currentPresetRef.current === 'tropical';

      // Mouse Parallax Damping
      currentRotationRef.current.x = THREE.MathUtils.damp(
        currentRotationRef.current.x,
        mouseTargetRef.current.y,
        3.5,
        delta
      );
      currentRotationRef.current.y = THREE.MathUtils.damp(
        currentRotationRef.current.y,
        mouseTargetRef.current.x,
        3.5,
        delta
      );

      // Auto rotation if enabled
      if (isRotatingRef.current && !isDraggingRef.current) {
        manualRotationRef.current.y += delta * 0.35;
      }

      // Master rotation application
      masterFruitGroup.rotation.x = manualRotationRef.current.x + currentRotationRef.current.x;
      masterFruitGroup.rotation.y = manualRotationRef.current.y + currentRotationRef.current.y;

      // Gentle floating oscillation
      const bob = Math.sin(elapsed * 1.5) * 0.08;
      masterFruitGroup.position.y = bob;

      // Internal fruit subtle animations
      if (citrusGroup.visible) {
        orangeSlice.rotation.z = elapsed * 0.12;
        limeSlice.rotation.z = -elapsed * 0.2;
      }
      if (strawberryGroup.visible) {
        heroBerry.rotation.y = elapsed * 0.2;
        miniBerry1.position.y = 0.9 + Math.sin(elapsed * 2) * 0.05;
      }
      if (tropicalGroup.visible) {
        tropicalOrange.rotation.z = elapsed * 0.15;
        kiwiSlice.rotation.z = -elapsed * 0.18;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    // Start loop
    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSelectPreset = (p: FruitPreset) => {
    setActivePreset(p);
    currentPresetRef.current = p;
    if (onPresetChange) onPresetChange(p);
  };

  const resetAngle = () => {
    manualRotationRef.current = { x: 0.35, y: -0.3 };
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[460px] sm:min-h-[500px] cursor-grab active:cursor-grabbing flex items-center justify-center relative touch-none"
        aria-label="Interactive 3D Fruit Orchard Stage. Drag to rotate 360 degrees or move pointer to tilt"
        role="img"
      />

      {/* Floating 3D Interaction Control Dock */}
      <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 flex flex-col gap-2 pointer-events-auto bg-stone-900/80 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 shadow-xl text-xs text-white">
        
        {/* Preset Selector */}
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            3D Fruit:
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleSelectPreset('citrus')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activePreset === 'citrus'
                  ? 'bg-[#FF5E0E] text-white shadow-xs'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              🍊 Nagpur Orange
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('strawberry')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activePreset === 'strawberry'
                  ? 'bg-[#E11D48] text-white shadow-xs'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              🍓 Strawberry
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('tropical')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activePreset === 'tropical'
                  ? 'bg-[#65A30D] text-white shadow-xs'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              🥝 Tropical Blend
            </button>
          </div>
        </div>

        {/* Action Controls & Hint */}
        <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[11px]">
          <span className="text-stone-300">
            🖐️ Drag to rotate 360° · Pointer tilts
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={resetAngle}
              aria-label="Reset 3D camera angle"
              className="px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 text-stone-200 font-semibold cursor-pointer"
            >
              Reset View
            </button>
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              aria-label={isRotating ? 'Pause rotation' : 'Start rotation'}
              className="px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 text-stone-200 font-semibold cursor-pointer"
            >
              {isRotating ? '⏸ Pause' : '▶ Spin'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
