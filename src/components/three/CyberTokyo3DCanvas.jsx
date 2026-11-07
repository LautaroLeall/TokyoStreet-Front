import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  FogExp2,
  GridHelper,
  Group,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  WebGLRenderer,
} from "three";

/**
 * Escena WebGL 3D real en Three.js reactiva tanto al cursor como a la velocidad/avance del scroll:
 * - Piso de perspectiva infinita en cian/magenta que acelera al scrollear
 * - Núcleo giroscópico 3D (anillos Torus + octaedro wireframe) que rota, se desplaza y banca en 3D con el scroll
 * - Partículas ascendentes tipo linternas/sakura neón con paralaje de cámara
 */
export default function CyberTokyo3DCanvas({
  variant = "hero",
  className = "",
}) {
  const containerRef = useRef(null);
  const variantRef = useRef(variant);

  useEffect(() => {
    variantRef.current = variant;
  }, [variant]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return undefined;

    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return undefined;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const initialHero = variantRef.current === "hero";

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    scene.fog = new FogExp2(0x0c0030, 0.062);

    const camera = new PerspectiveCamera(55, width / height, 0.1, 60);
    camera.position.set(0, 1.15, initialHero ? 7.2 : 8.2);

    // 1. Piso de retícula 3D estilo avenida nocturna de Tokio
    const gridHelper = new GridHelper(36, 36, 0xf00078, 0x54d8fc);
    gridHelper.position.y = -2.35;
    const gridMats = Array.isArray(gridHelper.material)
      ? gridHelper.material
      : [gridHelper.material];
    gridMats.forEach((mat) => {
      mat.transparent = true;
      mat.opacity = initialHero ? 0.25 : 0.18;
    });
    scene.add(gridHelper);

    // 2. Núcleo 3D holográfico (anillos orbitales Torus + cristal wireframe)
    const coreGroup = new Group();
    coreGroup.position.set(initialHero ? 1.75 : 0, 0.55, -1.6);

    const ringPinkGeo = new TorusGeometry(2.15, 0.022, 12, 84);
    const ringPinkMat = new MeshBasicMaterial({
      color: 0xf00078,
      transparent: true,
      opacity: initialHero ? 0.52 : 0.32,
    });
    const ringPink = new Mesh(ringPinkGeo, ringPinkMat);
    ringPink.rotation.x = Math.PI * 0.36;
    coreGroup.add(ringPink);

    const ringCyanGeo = new TorusGeometry(1.62, 0.02, 12, 72);
    const ringCyanMat = new MeshBasicMaterial({
      color: 0x84f0fc,
      transparent: true,
      opacity: initialHero ? 0.56 : 0.34,
    });
    const ringCyan = new Mesh(ringCyanGeo, ringCyanMat);
    ringCyan.rotation.y = Math.PI * 0.28;
    coreGroup.add(ringCyan);

    const crystalGeo = new OctahedronGeometry(0.9, 0);
    const crystalMat = new MeshBasicMaterial({
      color: 0xff4fa3,
      wireframe: true,
      transparent: true,
      opacity: initialHero ? 0.38 : 0.24,
    });
    const crystal = new Mesh(crystalGeo, crystalMat);
    coreGroup.add(crystal);

    scene.add(coreGroup);

    // 3. Partículas neón flotantes en profundidad 3D
    const particleCount = 125;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    const palette = [
      new Color(0xf00078),
      new Color(0x84f0fc),
      new Color(0xb9a8e6),
    ];

    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      speeds[i] = 0.004 + Math.random() * 0.008;
    }

    const particlesGeo = new BufferGeometry();
    particlesGeo.setAttribute("position", new BufferAttribute(positions, 3));
    particlesGeo.setAttribute("color", new BufferAttribute(colors, 3));

    const particlesMat = new PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Paralaje suave con el puntero + propulsión 3D al hacer scroll
    let targetMouseX = 0;
    let targetMouseY = 0;
    let lastScrollY = window.scrollY || 0;
    let scrollVelocity = 0;
    let smoothScrollRatio = 0;

    const handlePointerMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.95;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 0.6;
    };

    const handleScroll = () => {
      const currentY = window.scrollY || 0;
      const delta = currentY - lastScrollY;
      scrollVelocity = Math.max(
        -2.4,
        Math.min(2.4, scrollVelocity + delta * 0.0045),
      );
      lastScrollY = currentY;
    };

    if (!reducedMotion) {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    let isInView = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    io.observe(container);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    let rafId = 0;
    const renderFrame = () => {
      rafId = window.requestAnimationFrame(renderFrame);
      if (document.hidden || !isInView) return;

      if (!reducedMotion) {
        const isHeroMode = variantRef.current === "hero";
        const baseCamZ = isHeroMode ? 7.2 : 8.2;
        const targetGridOpacity = isHeroMode ? 0.25 : 0.18;
        gridMats.forEach((mat) => {
          mat.opacity += (targetGridOpacity - mat.opacity) * 0.06;
        });
        ringPinkMat.opacity +=
          ((isHeroMode ? 0.52 : 0.32) - ringPinkMat.opacity) * 0.06;
        ringCyanMat.opacity +=
          ((isHeroMode ? 0.56 : 0.34) - ringCyanMat.opacity) * 0.06;
        crystalMat.opacity +=
          ((isHeroMode ? 0.38 : 0.24) - crystalMat.opacity) * 0.06;

        const docMax = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const targetRatio = (window.scrollY || 0) / docMax;
        smoothScrollRatio += (targetRatio - smoothScrollRatio) * 0.06;
        scrollVelocity *= 0.91;

        const warpBoost = Math.abs(scrollVelocity) * 0.14;

        // Avance infinito de la calle neón acelerado por el scroll
        gridHelper.position.z = (gridHelper.position.z + 0.018 + warpBoost) % 1;

        // Oscilación espacial 3D del núcleo holográfico a lo largo de la página
        const targetCoreX = isHeroMode
          ? Math.cos(smoothScrollRatio * Math.PI * 2.2) * 1.75
          : Math.sin(smoothScrollRatio * Math.PI * 2) * 1.3;
        coreGroup.position.x += (targetCoreX - coreGroup.position.x) * 0.05;
        coreGroup.position.z =
          -1.6 - Math.sin(smoothScrollRatio * Math.PI) * 1.1;

        // Giro 3D de anillos y cristal acelerado con la velocidad del scroll
        const spinBoost = scrollVelocity * 0.035;
        ringPink.rotation.z += 0.0045 + spinBoost;
        ringPink.rotation.y += 0.002 + spinBoost * 0.6;
        ringCyan.rotation.x -= 0.0038 + spinBoost;
        ringCyan.rotation.z += 0.003;
        crystal.rotation.y += 0.006 + spinBoost * 1.4;
        crystal.rotation.x += 0.0035 + spinBoost * 0.8;

        // Ascenso de partículas neón reactivas al scroll
        const posAttr = particlesGeo.attributes.position;
        for (let i = 0; i < particleCount; i += 1) {
          posAttr.array[i * 3 + 1] += speeds[i] + scrollVelocity * 0.018;
          if (posAttr.array[i * 3 + 1] > 4.6) {
            posAttr.array[i * 3 + 1] = -4.2;
          } else if (posAttr.array[i * 3 + 1] < -4.4) {
            posAttr.array[i * 3 + 1] = 4.5;
          }
        }
        posAttr.needsUpdate = true;

        // Cámara reactiva al cursor + leve inclinación lateral (bank) al scrollear
        camera.position.x += (targetMouseX - camera.position.x) * 0.045;
        camera.position.y += (1.15 + targetMouseY - camera.position.y) * 0.045;
        camera.position.z +=
          (baseCamZ -
            Math.min(Math.abs(scrollVelocity) * 0.45, 0.9) -
            camera.position.z) *
          0.06;
        camera.lookAt(0, 0.15, -2);
        camera.rotation.z = -scrollVelocity * 0.025 + targetMouseX * -0.03;
      }

      renderer.render(scene, camera);
    };

    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      rafId = window.requestAnimationFrame(renderFrame);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      io.disconnect();
      ro.disconnect();
      ringPinkGeo.dispose();
      ringPinkMat.dispose();
      ringCyanGeo.dispose();
      ringCyanMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    />
  );
}
