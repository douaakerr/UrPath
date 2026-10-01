import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ROUTE = [
  new THREE.Vector3(-7, -3.2, 0),
  new THREE.Vector3(-4.6, -1.8, 0.2),
  new THREE.Vector3(-2.7, -2.5, -0.3),
  new THREE.Vector3(-0.8, -0.3, 0.1),
  new THREE.Vector3(1.4, 1.2, -0.2),
  new THREE.Vector3(3.4, 0.6, 0.3),
  new THREE.Vector3(5.1, 2.5, 0),
  new THREE.Vector3(6.8, 3.1, -0.2),
];

function makeRouteCurve() {
  const points = ROUTE.map((point) => point.clone());
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.65);
}

function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(32, 32, 1, 32, 32, 30);
  gradient.addColorStop(0, "rgba(244, 240, 224, 1)");
  gradient.addColorStop(0.25, "rgba(244, 240, 224, .9)");
  gradient.addColorStop(1, "rgba(244, 240, 224, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function ParticleRoute({ scrollRoot }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const root = scrollRoot?.current;

    if (!mount || !root) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 17);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const curve = makeRouteCurve();
    const particleTexture = createParticleTexture();

    const count = 1500;
    const positions = new Float32Array(count * 3);
    const progress = new Float32Array(count);
    const drift = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      progress[index] = Math.random();
      drift[index] = (Math.random() - 0.5) * 0.34;
      sizes[index] = 0.7 + Math.random() * 1.7;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        pointTexture: { value: particleTexture },
        opacity: { value: 0.7 },
        time: { value: 0 },
      },
      vertexShader: `
        attribute float aSize;
        varying float vAlpha;
        uniform float time;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float pulse = 0.85 + 0.25 * sin(time * 1.8 + position.x * 1.7);
          gl_PointSize = aSize * pulse * (38.0 / -mvPosition.z);
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
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(180)),
      new THREE.LineBasicMaterial({
        color: 0xb8c8b0,
        transparent: true,
        opacity: 0.08,
      }),
    );
    scene.add(routeLine);

    const state = { progress: 0 };
    const target = new THREE.Vector3();

    function updateParticles() {
      const positionsAttribute = geometry.attributes.position;

      for (let index = 0; index < count; index += 1) {
        const base = (progress[index] + state.progress * 0.7 + 1) % 1;
        curve.getPointAt(base, target);

        const tangent = curve.getTangentAt(base);
        const sideX = -tangent.y;
        const sideY = tangent.x;
        const wave = Math.sin(base * 42 + drift[index] * 12 + material.uniforms.time.value) * 0.11;
        const spread = drift[index] * (0.65 + Math.sin(base * Math.PI) * 0.8);

        positionsAttribute.setXYZ(
          index,
          target.x + sideX * spread + wave,
          target.y + sideY * spread,
          target.z + Math.sin(base * 25 + drift[index] * 5) * 0.25,
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

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.4,
      onUpdate: (self) => {
        state.progress = self.progress;
        camera.position.x = THREE.MathUtils.lerp(-0.8, 0.8, self.progress);
        camera.position.y = THREE.MathUtils.lerp(0.2, -0.25, self.progress);
        camera.position.z = THREE.MathUtils.lerp(17, 14.5, self.progress);
        camera.lookAt(0, 0, 0);
      },
    });

    const ambient = gsap.to(material.uniforms.opacity, {
      value: 0.92,
      duration: 2.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    let frameId;
    const clock = new THREE.Clock();

    function render() {
      material.uniforms.time.value = clock.getElapsedTime();
      updateParticles();
      particles.rotation.z = Math.sin(material.uniforms.time.value * 0.08) * 0.012;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(frameId);
      trigger.kill();
      ambient.kill();
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      routeLine.geometry.dispose();
      routeLine.material.dispose();
      particleTexture.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [scrollRoot]);

  return <div ref={mountRef} className="landing-particle-route" aria-hidden="true" />;
}

export default ParticleRoute;
