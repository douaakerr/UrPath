import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ROUTE = [
  new THREE.Vector3(-8.2, -3.35, 0.35),
  new THREE.Vector3(-6.5, -2.7, 0.15),
  new THREE.Vector3(-4.8, -2.15, -0.05),
  new THREE.Vector3(-3.15, -1.15, 0.1),
  new THREE.Vector3(-1.55, -0.2, -0.15),
  new THREE.Vector3(0.15, 0.7, 0.05),
  new THREE.Vector3(1.8, 0.15, -0.1),
  new THREE.Vector3(3.15, 1.25, 0.05),
  new THREE.Vector3(4.25, 2.35, 0.1),
  new THREE.Vector3(4.85, 3.55, 0),
];

function createRouteCurve() {
  return new THREE.CatmullRomCurve3(
    ROUTE.map((point) => point.clone()),
    false,
    "catmullrom",
    0.55,
  );
}

function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(32, 32, 1, 32, 32, 31);
  gradient.addColorStop(0, "rgba(243,247,251,1)");
  gradient.addColorStop(0.22, "rgba(143,200,247,.95)");
  gradient.addColorStop(1, "rgba(143,200,247,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function createMountain(scene) {
  const backShape = new THREE.Shape();
  backShape.moveTo(-8.8, -4.1);
  backShape.lineTo(-3.8, 0.35);
  backShape.lineTo(-1.9, -1.25);
  backShape.lineTo(1.15, 2.15);
  backShape.lineTo(3.15, 0.55);
  backShape.lineTo(7.9, -4.1);
  backShape.closePath();

  const frontShape = new THREE.Shape();
  frontShape.moveTo(-6.2, -4.1);
  frontShape.lineTo(-1.55, 0.25);
  frontShape.lineTo(0.75, 4.15);
  frontShape.lineTo(2.2, 1.55);
  frontShape.lineTo(6.35, -4.1);
  frontShape.closePath();

  const back = new THREE.Mesh(
    new THREE.ShapeGeometry(backShape),
    new THREE.MeshBasicMaterial({
      color: 0x0e2137,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    }),
  );

  const front = new THREE.Mesh(
    new THREE.ShapeGeometry(frontShape),
    new THREE.MeshBasicMaterial({
      color: 0x173a59,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    }),
  );

  const snowShape = new THREE.Shape();
  snowShape.moveTo(-0.15, 2.95);
  snowShape.lineTo(0.75, 4.15);
  snowShape.lineTo(1.28, 3.18);
  snowShape.lineTo(0.95, 3.48);
  snowShape.lineTo(0.55, 3.05);
  snowShape.closePath();

  const snow = new THREE.Mesh(
    new THREE.ShapeGeometry(snowShape),
    new THREE.MeshBasicMaterial({
      color: 0x8fc8f7,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    }),
  );

  const group = new THREE.Group();
  group.add(back, front, snow);
  group.position.set(1.0, -0.15, -0.55);
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const curve = createRouteCurve();
    const particleTexture = createParticleTexture();
    const mountain = createMountain(scene);

    const count = 1900;
    const positions = new Float32Array(count * 3);
    const baseProgress = new Float32Array(count);
    const spread = new Float32Array(count);
    const size = new Float32Array(count);
    const seed = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      baseProgress[index] = Math.random();
      spread[index] = (Math.random() - 0.5) * 0.55;
      size[index] = 0.7 + Math.random() * 1.8;
      seed[index] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        pointTexture: { value: particleTexture },
        opacity: { value: 0.82 },
        time: { value: 0 },
      },
      vertexShader: `
        attribute float aSize;
        uniform float time;
        varying float vAlpha;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float pulse = 0.86 + 0.22 * sin(time * 1.6 + position.x * 1.9);
          gl_PointSize = aSize * pulse * (42.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = pulse;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        uniform float opacity;
        varying float vAlpha;

        void main() {
          vec4 tex = texture2D(pointTexture, gl_PointCoord);
          gl_FragColor = vec4(tex.rgb, tex.a * opacity * vAlpha);
        }
      `,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const routeLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(240)),
      new THREE.LineBasicMaterial({
        color: 0x8fc8f7,
        transparent: true,
        opacity: 0.12,
      }),
    );
    scene.add(routeLine);

    const summitGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 12, 12),
      new THREE.MeshBasicMaterial({
        color: 0xf3f7fb,
        transparent: true,
        opacity: 0.9,
      }),
    );
    summitGlow.position.copy(ROUTE[ROUTE.length - 1]);
    summitGlow.position.z += 0.15;
    scene.add(summitGlow);

    const state = { progress: 0 };
    const target = new THREE.Vector3();
    const tangent = new THREE.Vector3();

    function updateParticles() {
      const positionsAttribute = geometry.attributes.position;
      const scroll = state.progress;

      for (let index = 0; index < count; index += 1) {
        const particleStart = baseProgress[index] * 0.62;
        const routeProgress = Math.min(
          0.995,
          particleStart + scroll * 0.52 + Math.sin(seed[index]) * 0.012,
        );

        curve.getPointAt(routeProgress, target);
        curve.getTangentAt(routeProgress, tangent);

        const sideX = -tangent.y;
        const sideY = tangent.x;
        const localWave = Math.sin(
          seed[index] + material.uniforms.time.value * 0.7 + routeProgress * 34,
        ) * 0.075;

        const routeSpread =
          spread[index] *
          (0.35 + Math.sin(routeProgress * Math.PI) * 0.95);

        positionsAttribute.setXYZ(
          index,
          target.x + sideX * routeSpread + localWave,
          target.y + sideY * routeSpread,
          target.z + Math.sin(seed[index] + routeProgress * 18) * 0.18,
        );
      }

      positionsAttribute.needsUpdate = true;
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

    const progressProxy = { value: 0 };
    const setScrollProgress = gsap.quickTo(progressProxy, "value", {
      duration: 0.35,
      ease: "power2.out",
    });

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    const syncScroll = () => {
      state.progress = progressProxy.value;

      camera.position.x = THREE.MathUtils.lerp(-0.8, 0.8, state.progress);
      camera.position.y = THREE.MathUtils.lerp(0.2, -0.15, state.progress);
      camera.position.z = THREE.MathUtils.lerp(17, 14.8, state.progress);
      camera.lookAt(0.3, 0.1, 0);

      mountain.position.x = THREE.MathUtils.lerp(1, 0.15, state.progress);
      mountain.position.y = THREE.MathUtils.lerp(-0.15, 0.15, state.progress);
      mountain.scale.setScalar(THREE.MathUtils.lerp(1, 1.08, state.progress));
    };

    const ambient = gsap.to(material.uniforms.opacity, {
      value: 0.98,
      duration: 2.1,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    const summitPulse = gsap.to(summitGlow.scale, {
      x: 1.8,
      y: 1.8,
      z: 1.8,
      duration: 1.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    const clock = new THREE.Clock();
    let frameId;

    function render() {
      material.uniforms.time.value = clock.getElapsedTime();
      state.progress = progressProxy.value;
      updateParticles();
      syncScroll();

      particles.rotation.z = Math.sin(material.uniforms.time.value * 0.08) * 0.008;
      summitGlow.material.opacity = 0.55 + state.progress * 0.35;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    }

    render();
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(frameId);
      trigger.kill();
      ambient.kill();
      summitPulse.kill();
      window.removeEventListener("resize", resize);

      geometry.dispose();
      material.dispose();
      routeLine.geometry.dispose();
      routeLine.material.dispose();
      summitGlow.geometry.dispose();
      summitGlow.material.dispose();

      mountain.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });

      particleTexture.dispose();
      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [scrollRoot]);

  return <div ref={mountRef} className="landing-particle-route" aria-hidden="true" />;
}

export default ParticleRoute;
