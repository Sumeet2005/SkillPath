import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Helper to create crisp 2D Canvas Sprite Text Labels for 3D Nodes
function createTextSprite(text, color = "#ffffff", isTarget = false, isJob = false) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 80;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isTarget) {
    ctx.fillStyle = "rgba(139, 92, 246, 0.45)";
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(24, 8, 464, 64, 32);
    ctx.fill();
    ctx.stroke();
  }

  ctx.font = isTarget
    ? "Bold 32px Inter, sans-serif"
    : isJob
    ? "Bold 26px Inter, sans-serif"
    : "500 24px Inter, sans-serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
  ctx.shadowBlur = 8;
  ctx.fillText(text, 256, 40);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(5.5, 0.86, 1);
  return sprite;
}

const KnowledgeGraph3D = forwardRef(function KnowledgeGraph3D(
  {
    nodes = [],
    edges = [],
    selectedNodeId,
    hoveredNodeId,
    onHoverNode,
    onSelectNode,
    autoRotate = true,
    searchQuery = "",
    targetJob = "",
    selectedCategory = "All",
    fitSignal = 0,
  },
  ref
) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const nodeMeshesRef = useRef(new Map());
  const edgeLinesRef = useRef([]);

  // Transition refs for camera animation (active ONLY during automatic camera fit/focus)
  const targetCameraPosRef = useRef(null);
  const targetLookAtRef = useRef(null);
  const isTransitioningRef = useRef(false);

  const isInteractingRef = useRef(false);
  const positionsRef = useRef(new Map());
  const prevCategoryRef = useRef(selectedCategory);
  const prevSelectedNodeRef = useRef(selectedNodeId);

  // Semantic color palette
  const colorHexMap = {
    job: 0x22d3ee,    // Cyan for Careers
    skill: 0x8b5cf6,  // Violet for Skills
    course: 0x34d399, // Green for Courses
  };

  // Expose manual camera control methods to parent component (Zoom In, Zoom Out, Reset View)
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (controlsRef.current) {
        controlsRef.current.dollyIn(1.25);
        controlsRef.current.update();
      }
    },
    zoomOut: () => {
      if (controlsRef.current) {
        controlsRef.current.dollyOut(1.25);
        controlsRef.current.update();
      }
    },
    resetView: () => {
      triggerCameraFit();
    },
  }));

  // Helper to trigger one-shot camera fit to current node bounds
  const triggerCameraFit = () => {
    if (!controlsRef.current || !cameraRef.current || positionsRef.current.size === 0) return;

    const box = new THREE.Box3();
    positionsRef.current.forEach((pos) => box.expandByPoint(pos));

    const center = new THREE.Vector3();
    box.getCenter(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.15;
    cameraZ = Math.max(cameraZ, 16);

    targetLookAtRef.current = center;
    targetCameraPosRef.current = new THREE.Vector3(center.x, center.y + 1.5, center.z + cameraZ);
    isTransitioningRef.current = true;
  };

  // 1. One-Time WebGL Renderer & Scene Initialization (Mount ONLY)
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f16); // Dark graphite
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 24);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);

    const light1 = new THREE.DirectionalLight(0xa855f7, 1.2);
    light1.position.set(20, 30, 25);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x22d3ee, 0.85);
    light2.position.set(-20, -15, -20);
    scene.add(light2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 55;
    controls.minDistance = 5;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.4;
    controlsRef.current = controls;

    const startInteract = () => { isInteractingRef.current = true; };
    const endInteract = () => { isInteractingRef.current = false; };

    controls.addEventListener("start", startInteract);
    controls.addEventListener("end", endInteract);

    // Raycasting for node hover & click picking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(nodeMeshesRef.current.values()).map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        canvas.style.cursor = "pointer";
        if (hitMesh.userData?.id) {
          onHoverNode(hitMesh.userData.id);
        }
      } else {
        canvas.style.cursor = "default";
        onHoverNode(null);
      }
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(nodeMeshesRef.current.values()).map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        if (hitMesh.userData?.node) {
          onSelectNode(hitMesh.userData.node);
        }
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("click", handleClick);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Continuous Render & Animation Loop (Runs unconditionally)
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto-rotation runs ONLY when idle & enabled
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate && !isInteractingRef.current && !hoveredNodeId;
        controlsRef.current.update();
      }

      // Smooth camera transition ONLY when active transition signal is set
      if (isTransitioningRef.current && targetCameraPosRef.current && targetLookAtRef.current) {
        camera.position.lerp(targetCameraPosRef.current, 0.06);
        controls.target.lerp(targetLookAtRef.current, 0.06);

        if (camera.position.distanceTo(targetCameraPosRef.current) < 0.15) {
          isTransitioningRef.current = false;
          targetCameraPosRef.current = null;
          targetLookAtRef.current = null;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      controls.removeEventListener("start", startInteract);
      controls.removeEventListener("end", endInteract);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONLY once on mount

  // Update OrbitControls autoRotate flag dynamically without re-creating renderer
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // One-shot camera fit on explicit fitSignal prop
  useEffect(() => {
    if (fitSignal > 0) {
      triggerCameraFit();
    }
  }, [fitSignal]);

  // 2. Build 3D Node Meshes & Edge Lines on Data / Filter Change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear previous node meshes & edges
    nodeMeshesRef.current.forEach((item) => scene.remove(item.group));
    nodeMeshesRef.current.clear();

    edgeLinesRef.current.forEach((line) => scene.remove(line));
    edgeLinesRef.current = [];

    const positions = new Map();
    const jobs = nodes.filter((n) => n.type === "job");
    const skills = nodes.filter((n) => n.type === "skill");
    const courses = nodes.filter((n) => n.type === "course");

    // Deterministic layout calculations
    if (selectedCategory === "Jobs") {
      jobs.forEach((job, i) => {
        const spread = jobs.length > 1 ? (i / (jobs.length - 1) - 0.5) * 26 : 0;
        positions.set(job.id, new THREE.Vector3(spread, 0, (i % 2 === 0 ? 0 : -2)));
      });
    } else if (selectedCategory === "Skills") {
      skills.forEach((skill, i) => {
        const angle = (i / Math.max(skills.length, 1)) * Math.PI * 2;
        const r = 8 + (i % 3) * 3;
        const y = ((i % 4) - 1.5) * 2.5;
        positions.set(skill.id, new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
      });
    } else if (selectedCategory === "Courses") {
      courses.forEach((course, i) => {
        const angle = (i / Math.max(courses.length, 1)) * Math.PI * 2;
        positions.set(course.id, new THREE.Vector3(Math.cos(angle) * 9, ((i % 3) - 1) * 2, Math.sin(angle) * 9));
      });
    } else {
      // 3-Tier All View
      jobs.forEach((job, i) => {
        const spread = jobs.length > 1 ? (i / (jobs.length - 1) - 0.5) * 28 : 0;
        positions.set(job.id, new THREE.Vector3(spread, 6.5, (i % 2 === 0 ? 0 : -2)));
      });

      skills.forEach((skill, i) => {
        const angle = (i / Math.max(skills.length, 1)) * Math.PI * 2 + 0.2;
        const r = 8 + (i % 4) * 2.2;
        const y = ((i % 5) - 2) * 1.5;
        positions.set(skill.id, new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
      });

      courses.forEach((course, i) => {
        const spread = courses.length > 1 ? (i / (courses.length - 1) - 0.5) * 22 : 0;
        positions.set(course.id, new THREE.Vector3(spread, -6.5, (i % 2 === 0 ? 0 : 2)));
      });
    }

    positionsRef.current = positions;

    // Active Connected Set for Hover/Selection
    const activeId = hoveredNodeId || selectedNodeId;
    const connectedSet = new Set();
    if (activeId) {
      connectedSet.add(activeId);
      edges.forEach((e) => {
        if (e.source === activeId) connectedSet.add(e.target);
        if (e.target === activeId) connectedSet.add(e.source);
      });
    }

    const searchSet = searchQuery.trim()
      ? new Set(
          nodes
            .filter((n) => n.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
            .map((n) => n.id)
        )
      : null;

    // Create 3D Node Meshes & Text Labels
    nodes.forEach((node) => {
      const pos = positions.get(node.id) || new THREE.Vector3();
      const isSelected = node.id === selectedNodeId;
      const isHovered = node.id === hoveredNodeId;
      const isConnected = connectedSet.has(node.id);
      const isMatch = !searchSet || searchSet.has(node.id);
      const isDimmed = (activeId && !isConnected) || (searchSet && !isMatch);
      const isTarget = node.name === targetJob;

      const group = new THREE.Group();
      group.position.copy(pos);

      const radius = node.type === "job" ? 0.75 : node.type === "skill" ? 0.52 : 0.42;
      const colorVal = colorHexMap[node.type] || 0x8b5cf6;

      const geometry = new THREE.SphereGeometry(radius, 24, 24);
      const material = new THREE.MeshStandardMaterial({
        color: colorVal,
        emissive: colorVal,
        emissiveIntensity: isSelected ? 0.95 : isHovered ? 0.75 : isTarget ? 0.6 : 0.25,
        roughness: 0.2,
        transparent: true,
        opacity: isDimmed ? 0.12 : 1,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { id: node.id, node };
      group.add(mesh);

      if (isSelected || isTarget) {
        const ringGeo = new THREE.RingGeometry(radius * 1.3, radius * 1.45, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorVal,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        group.add(ringMesh);
      }

      const shouldShowLabel =
        node.type === "job" ||
        isTarget ||
        isSelected ||
        isHovered ||
        (searchSet && isMatch) ||
        (selectedCategory !== "All");

      if (shouldShowLabel) {
        const labelColor = isSelected
          ? "#22d3ee"
          : isHovered
          ? "#c4b5fd"
          : isTarget
          ? "#a855f7"
          : node.type === "job"
          ? "#22d3ee"
          : "#f8fafc";

        const sprite = createTextSprite(node.name, labelColor, isTarget, node.type === "job");
        sprite.position.set(0, radius + 0.6, 0);
        group.add(sprite);
      }

      scene.add(group);
      nodeMeshesRef.current.set(node.id, { group, mesh, material });
    });

    // Create Connection Lines
    const processedEdgeKeys = new Set();
    edges.forEach((edge) => {
      const edgeKey = `${edge.source}->${edge.target}`;
      if (processedEdgeKeys.has(edgeKey)) return;
      processedEdgeKeys.add(edgeKey);

      const start = positions.get(edge.source);
      const end = positions.get(edge.target);
      if (!start || !end) return;

      const isHighlighted = connectedSet.has(edge.source) && connectedSet.has(edge.target);
      const isDimmed = (activeId && !isHighlighted) || (searchSet && (!searchSet.has(edge.source) || !searchSet.has(edge.target)));

      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.y += start.distanceTo(end) * 0.12;

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(20);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

      const lineMat = new THREE.LineBasicMaterial({
        color: isHighlighted ? 0x22d3ee : 0x8b5cf6,
        transparent: true,
        opacity: isDimmed ? 0.03 : isHighlighted ? 0.85 : 0.16,
      });

      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      edgeLinesRef.current.push(line);
    });

    // Trigger ONE-TIME camera fit ONLY when category changes
    if (prevCategoryRef.current !== selectedCategory) {
      prevCategoryRef.current = selectedCategory;
      triggerCameraFit();
    }

    // Trigger ONE-TIME camera focus ONLY when a node is newly clicked/selected
    if (selectedNodeId && prevSelectedNodeRef.current !== selectedNodeId && positions.has(selectedNodeId)) {
      prevSelectedNodeRef.current = selectedNodeId;
      const p = positions.get(selectedNodeId);
      targetLookAtRef.current = p.clone();
      targetCameraPosRef.current = new THREE.Vector3(p.x + 2.5, p.y + 2.5, p.z + 9);
      isTransitioningRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, selectedNodeId, hoveredNodeId, searchQuery, targetJob, selectedCategory]);

  return (
    <div ref={containerRef} className="webgl-canvas-wrapper" style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
});

export default KnowledgeGraph3D;
