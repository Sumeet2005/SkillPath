import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Ambient3DCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Fog Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06050b);
    scene.fog = new THREE.FogExp2(0x06050b, 0.018);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 32);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lighting System (Pushed to outer edges for atmospheric depth)
    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 1.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x22d3ee, 3.5, 90);
    cyanLight.position.set(24, 14, 10);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 4.0, 100);
    violetLight.position.set(-24, -14, 8);
    scene.add(violetLight);

    // 5. 3D Geometric Scene Objects
    const group = new THREE.Group();
    // Offset main group slightly to right edge so central text area remains clean
    group.position.set(8, 0, -2);
    scene.add(group);

    // A. Outer Orbital Torus Rings (Atmospheric Edge Sculptures)
    const ringGeo1 = new THREE.TorusGeometry(12, 0.05, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.position.set(8, 2, -4);
    group.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(18, 0.04, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.position.set(8, 2, -4);
    group.add(ring2);

    // B. Floating Geometric Polyhedra Core (Right Edge Atmosphere)
    const coreGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.3,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(8, 2, -4);
    group.add(coreMesh);

    const innerGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0e7490,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.7,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.position.set(8, 2, -4);
    group.add(innerMesh);

    // C. Floating Satellite Geometries at various Z-depths
    const satellites = [];
    const geoms = [
      new THREE.OctahedronGeometry(0.8, 0),
      new THREE.DodecahedronGeometry(0.7, 0),
      new THREE.IcosahedronGeometry(0.6, 0),
      new THREE.TetrahedronGeometry(0.9, 0),
    ];

    for (let i = 0; i < 18; i++) {
      const g = geoms[i % geoms.length];
      const isCyan = i % 2 === 0;
      const mat = new THREE.MeshStandardMaterial({
        color: isCyan ? 0x22d3ee : 0xc084fc,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        emissive: isCyan ? 0x0891b2 : 0x7e22ce,
        emissiveIntensity: 0.2,
      });
      const mesh = new THREE.Mesh(g, mat);

      const angle = (i / 18) * Math.PI * 2;
      const radius = 14 + (i % 4) * 4;
      mesh.position.set(
        Math.cos(angle) * radius + (Math.random() - 0.5) * 4,
        Math.sin(angle) * radius + (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 20
      );

      mesh.userData = {
        rotX: (Math.random() - 0.5) * 0.01,
        rotY: (Math.random() - 0.5) * 0.01,
        initialY: mesh.position.y,
        speed: 0.001 + Math.random() * 0.002,
        offset: i,
      };

      group.add(mesh);
      satellites.push(mesh);
    }

    // D. Subtle Depth Particle Field
    const particleCount = 280;
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 90;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 45;

      const isCyan = Math.random() > 0.5;
      pColors[i * 3] = isCyan ? 0.13 : 0.65;
      pColors[i * 3 + 1] = isCyan ? 0.82 : 0.36;
      pColors[i * 3 + 2] = isCyan ? 0.93 : 0.96;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);

    // E. Perspective Spatial Grid Plane
    const gridHelper = new THREE.GridHelper(100, 36, 0x8b5cf6, 0x1e1b4b);
    gridHelper.position.y = -22;
    gridHelper.position.z = -10;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.18;
    scene.add(gridHelper);

    // 6. Interaction & Parallax Handlers
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize);

    // 7. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous slow rotation
      ring1.rotation.x += 0.0008;
      ring1.rotation.y += 0.0012;
      ring2.rotation.y += 0.001;
      ring2.rotation.z += 0.0008;

      coreMesh.rotation.x += 0.002;
      coreMesh.rotation.y += 0.003;
      innerMesh.rotation.y -= 0.0015;

      particleSystem.rotation.y += 0.0002;

      // Drifting satellites
      satellites.forEach((sat) => {
        sat.rotation.x += sat.userData.rotX;
        sat.rotation.y += sat.userData.rotY;
        sat.position.y =
          sat.userData.initialY + Math.sin(elapsedTime * 1.2 + sat.userData.offset) * 0.8;
      });

      // Mouse Parallax Interpolation
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      // Scroll-based Z-depth transition
      const scrollY = window.scrollY || 0;
      group.position.y = scrollY * 0.006;
      group.rotation.y = scrollY * 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="ambient-3d-wrapper"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

export default Ambient3DCanvas;
