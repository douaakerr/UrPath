import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CLEAN_ROUTE = [
  new THREE.Vector3(-7.8, -3.45, 0.2),
  new THREE.Vector3(-6.3, -3.0, 0.1),
  new THREE.Vector3(-5.1, -2.35, 0),
  new THREE.Vector3(-3.8, -1.55, 0.05),
  new THREE.Vector3(-2.55, -0.75, 0),
  new THREE.Vector3(-1.1, -0.1, 0.05),
  new THREE.Vector3(0.2, 0.45, 0),
  new THREE.Vector3(1.45, 0.95, -0.05),
  new THREE.Vector3(2.6, 1.65, 0),
  new THREE.Vector3(3.65, 2.55, 0.05),
  new THREE.Vector3(4.45, 3.7, 0),
];

const LOST_ROUTES = [
  [[-8.1, -3.5], [-5.8, -2.0], [-7.0, -0.7], [-4.9, 0.4], [-6.1, 1.8]],
  [[-7.6, -3.4], [-5.2, -2.4], [-3.8, -2.7], [-2.8, -1.1], [-3.8, 0.8]],
  [[-7.4, -3.3], [-5.0, -2.1], [-3.4, -1.7], [-1.8, -2.2], [-0.4, -1.2]],
  [[-6.8, -3.2], [-5.1, -1.8], [-4.1, -0.2], [-2.0, 0.8], [-0.7, 1.7]],
  [[-7.7, -3.2], [-6.2, -1.7], [-4.0, -1.0], [-2.7, 0.3], [-1.1, 2.2]],
];

function curveFrom(points) {
  return new THREE.CatmullRomCurve3(
    points.map(([x, y]) => new THREE.Vector3(x, y, 0)),
    false,
    "catmullrom",
    0.35,
  );
}

function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(32, 32, 1, 32, 32, 31);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(143,200,247,.95)");
  gradient.addColorStop(1, "rgba(143,200,247,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function createMountain(scene) {
  const back = new THREE.Shape();
  back.moveTo(-8.8, -4.2);
  back.lineTo(-4.8, -0.4);
  back.lineTo(-2.6, -1.5);
  back.lineTo(0.2, 1.75);
  back.lineTo(2.2, 0.1);
  back.lineTo(7.8, -4.2);
  back.closePath();

  const front = new THREE.Shape();
  front.moveTo(-6.5, -4.2);
  front.lineTo(-2.2, -0.2);
  front.lineTo(0.8, 4.2);
  front.lineTo(2.2, 1.35);
  front.lineTo(6.7, -4.2);
  front.closePath();

  const snow = new THREE.Shape();
  snow.moveTo(0.18, 3.15);
  snow.lineTo(0.8, 4.2);
  snow.lineTo(1.38, 3.08);
  snow.lineTo(1.02, 3.35);
  snow.lineTo(0.73, 2.98);
  snow.closePath();

  const group = new THREE.Group();
  group.add(
    new THREE.Mesh(new THREE.ShapeGeometry(back), new THREE.MeshBasicMaterial({
      color: 0x0e2137, transparent: true, opacity: 0.75, depthWrite: false,
    })),
    new THREE.Mesh(new THREE.ShapeGeometry(front), new THREE.MeshBasicMaterial({
      color: 0x173a59, transparent: true, opacity: 0.82, depthWrite: false,
    })),
    new THREE.Mesh(new THREE.ShapeGeometry(snow), new THREE.MeshBasicMaterial({
      color: 0xdbeafa, transparent: true, opacity: 0.22, depthWrite: false,
    })),
  );
  group.position.set(1.1, 0, -0.8);
  scene.add(group);
  return group;
}

function createFlag(scene) {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, 0.75, 8),
    new THREE.MeshBasicMaterial({ color: 0xf3f7fb }),
  );
  pole.position.y = 0.35;

  const flagShape = new THREE.Shape();
  flagShape.moveTo(0, 0.7);
  flagShape.lineTo(0.48, 0.58);
  flagShape.lineTo(0, 0.4);
  flagShape.closePath();

  const flag = new THREE.Mesh(
    new THREE.ShapeGeometry(flagShape),
    new THREE.MeshBasicMaterial({ color: 0x65adff, side: THREE.DoubleSide }),
  );

  group.add(pole, flag);
  group.position.set(4.45, 3.7, 0.15);
  scene.add(group);
  return group;
}

function ParticleRoute({ scrollRoot }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const root = scrollRoot?.current;
    if (!mount || !root) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
    camera.position.set(0, 0, 17);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const cleanCurve = new THREE.CatmullRomCurve3(
      CLEAN_ROUTE.map((point) => point.clone()),
      false,
      "catmullrom",
      0.55,
    );
    const lostCurves = LOST_ROUTES.map(curveFrom);
    const texture = createParticleTexture();
    const mountain = createMountain(scene);
    const flag = createFlag(scene);

    const darkParticle = new THREE.Color(0x8fc8f7);
    const lightParticle = new THREE.Color(0x27755e);
    const darkRoute = new THREE.Color(0x8fc8f7);
    const lightRoute = new THREE.Color(0x27755e);

    const lostLines = lostCurves.map((curve) => new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(90)),
      new THREE.LineBasicMaterial({
        color: 0x8fa3b8,
        transparent: true,
        opacity: 0.16,
      }),
    ));
    lostLines.forEach((line) => scene.add(line));

    const cleanLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(cleanCurve.getPoints(260)),
      new THREE.LineBasicMaterial({
        color: 0x8fc8f7,
        transparent: true,
        opacity: 0.42,
      }),
    );
    scene.add(cleanLine);

    const summit = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 14, 14),
      new THREE.MeshBasicMaterial({ color: 0xf3f7fb, transparent: true, opacity: 0.95 }),
    );
    summit.position.copy(CLEAN_ROUTE[CLEAN_ROUTE.length - 1]);
    summit.position.z = 0.2;
    scene.add(summit);

    const walker = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xf3f7fb }),
    );
    scene.add(walker);

    const count = 1700;
    const positions = new Float32Array(count * 3);
    const progressSeed = new Float32Array(count);
    const drift = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      progressSeed[i] = Math.random();
      drift[i] = (Math.random() - 0.5) * 0.8;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: darkParticle,
      size: 0.055,
      map: texture,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const state = { progress: 0 };
    const target = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const walkerTarget = new THREE.Vector3();

    function updateParticles(time) {
      const position = geometry.attributes.position;
      const p = state.progress;

      for (let i = 0; i < count; i += 1) {
        const local = (progressSeed[i] + p * 0.72) % 1;
        const routeP = Math.min(0.997, local);
        cleanCurve.getPointAt(routeP, target);
        cleanCurve.getTangentAt(routeP, tangent);

        const side = (drift[i] * (0.25 + Math.sin(routeP * Math.PI) * 0.8));
        const idle = Math.sin(time * 0.45 + progressSeed[i] * 18) * 0.055;

        position.setXYZ(
          i,
          target.x - tangent.y * side + idle,
          target.y + tangent.x * side,
          -0.1 + Math.sin(time * 0.3 + progressSeed[i] * 15) * 0.25,
        );
      }
      position.needsUpdate = true;
    }

    function updateScene(time) {
      const p = state.progress;
      const achieved = p > 0.88;
      root.classList.toggle("is-achieved", achieved);

      const lostVisibility = THREE.MathUtils.clamp(1 - p * 2.8, 0, 1);
      lostLines.forEach((line) => {
        line.material.opacity = 0.16 * lostVisibility;
      });

      cleanLine.material.opacity = THREE.MathUtils.lerp(0.15, 0.62, p);
      cleanLine.material.color.copy(darkRoute).lerp(lightRoute, Math.max(0, (p - 0.72) / 0.28));

      const particleMix = Math.max(0, (p - 0.72) / 0.28);
      material.color.copy(darkParticle).lerp(lightParticle, particleMix);

      mountain.traverse((object) => {
        if (object.material?.color) {
          object.material.color.lerp(new THREE.Color(0xdce9df), particleMix * 0.35);
        }
      });

      camera.position.x = THREE.MathUtils.lerp(-0.45, 0.6, p);
      camera.position.y = THREE.MathUtils.lerp(0.15, -0.15, p);
      camera.position.z = THREE.MathUtils.lerp(17.2, 14.8, p);
      camera.lookAt(0.15, 0.15, 0);

      mountain.position.x = THREE.MathUtils.lerp(1.1, 0.15, p);
      mountain.position.y = THREE.MathUtils.lerp(0, 0.18, p);
      mountain.scale.setScalar(THREE.MathUtils.lerp(0.94, 1.1, p));

      flag.position.x = THREE.MathUtils.lerp(4.45, 3.8, p);
      flag.position.y = THREE.MathUtils.lerp(3.7, 3.45, p);
      flag.visible = p > 0.34;

      cleanLine.material.opacity = THREE.MathUtils.lerp(0.08, 0.7, p);
      walkerTarget.copy(cleanCurve.getPointAt(Math.min(p, 0.999)));
      walker.position.lerp(walkerTarget, 0.22);
      walker.scale.setScalar(p > 0.88 ? 1.45 : 1);
      summit.scale.setScalar(1 + Math.sin(time * 2) * 0.08 + p * 0.45);
      summit.material.opacity = 0.35 + p * 0.6;
    }

    function resize() {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener("resize", resize);

    const proxy = { value: 0 };
    const setProgress = gsap.quickTo(proxy, "value", { duration: 0.35, ease: "power2.out" });

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.25,
      onUpdate: (self) => setProgress(self.progress),
    });

    const clock = new THREE.Clock();
    let frameId;

    function render() {
      const time = clock.getElapsedTime();
      state.progress = proxy.value;
      material.opacity = THREE.MathUtils.lerp(0.74, 0.9, state.progress);
      updateParticles(time);
      updateScene(time);
      particles.rotation.z = Math.sin(time * 0.08) * 0.01;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    }

    render();
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(frameId);
      trigger.kill();
      window.removeEventListener("resize", resize);

      geometry.dispose();
      material.dispose();
      texture.dispose();

      [...lostLines, cleanLine].forEach((line) => {
        line.geometry.dispose();
        line.material.dispose();
      });

      [summit, walker].forEach((object) => {
        object.geometry.dispose();
        object.material.dispose();
      });

      flag.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });

      mountain.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });

      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [scrollRoot]);

  return <div ref={mountRef} className="landing-particle-route" aria-hidden="true" />;
}

export default ParticleRoute;
