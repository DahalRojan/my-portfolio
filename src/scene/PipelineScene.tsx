import { Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ACCENT = new THREE.Color("#ffb547");      // saffron — emissive on slabs + Bedrock orb
const ACCENT_COOL = new THREE.Color("#7df9ff"); // cyan — the document particle
const BG = new THREE.Color("#0a0908");

// -------- Custom slab shader: subtle Fresnel rim + grid lines --------
const SlabMaterial = shaderMaterial(
  {
    uTime: 0,
    uPulse: 0,
    uAccent: ACCENT,
    uGridScale: 6.0,
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec2 vUv;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    precision highp float;
    uniform float uTime;
    uniform float uPulse;
    uniform vec3 uAccent;
    uniform float uGridScale;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec2 vUv;

    // Fresnel
    float fresnel(vec3 n, vec3 v, float p) {
      return pow(1.0 - max(dot(n, v), 0.0), p);
    }

    // Grid line
    float grid(vec2 uv, float scale) {
      vec2 g = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
      float line = min(g.x, g.y);
      return 1.0 - min(line, 1.0);
    }

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      float f = fresnel(vNormal, viewDir, 2.6);

      // grid only on the faces facing forward (z)
      float g = grid(vUv, uGridScale);

      // base color: near-black with rim glow
      vec3 base = vec3(0.06, 0.07, 0.08);
      vec3 color = mix(base, uAccent, f * 0.65);

      // grid contribution
      color += uAccent * g * 0.10;

      // pulse on activation
      color += uAccent * uPulse * (0.25 + 0.15 * sin(uTime * 4.0));

      // soft alpha so layered slabs read as glass
      float alpha = 0.18 + f * 0.55 + uPulse * 0.25;

      gl_FragColor = vec4(color, alpha);
    }
  `,
);
extend({ SlabMaterial });

declare module "@react-three/fiber" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  interface ThreeElements {
    slabMaterial: any;
  }
}

// -------- Layer slab --------
type SlabProps = {
  position: [number, number, number];
  size: [number, number, number];
  pulseRef: React.MutableRefObject<number>;
};

function Slab({ position, size, pulseRef }: SlabProps) {
  const matRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (!matRef.current) return;
    matRef.current.uTime = state.clock.elapsedTime;
    // ease the pulse value toward target
    const current = matRef.current.uPulse as number;
    matRef.current.uPulse = THREE.MathUtils.lerp(current, pulseRef.current, Math.min(1, delta * 3));
  });

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      {/* @ts-expect-error custom shader material */}
      <slabMaterial ref={matRef} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// -------- Document particle (the visitor) --------
function DocumentParticle({
  pulses,
}: {
  pulses: React.MutableRefObject<number>[];
}) {
  const ref = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const trailGeoRef = useRef<THREE.BufferGeometry>(null);

  // Pre-allocate trail positions
  const trailCount = 80;
  const trailPositions = useMemo(() => new Float32Array(trailCount * 3), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;

    // Path: a loop. Start far-left, travel through z=-6..+6 along the gates.
    // Cycle every ~12s.
    const cycle = 12;
    const phase = (t % cycle) / cycle; // 0..1
    const ease = easeInOutCubic(phase);
    const z = THREE.MathUtils.lerp(-7, 7, ease);

    ref.current.position.set(0, 0.05 * Math.sin(t * 1.4), z);

    // Subtle rotation
    ref.current.rotation.y = t * 0.4;

    // Trigger pulses on each gate when document is near
    const gateZ = [-3, -1, 1, 3];
    gateZ.forEach((gz, i) => {
      const dist = Math.abs(z - gz);
      const pulse = Math.max(0, 1 - dist * 1.4);
      if (pulses[i]) pulses[i].current = pulse;
    });

    // Update trail
    if (trailGeoRef.current) {
      // shift positions back by one
      for (let i = trailCount - 1; i > 0; i--) {
        trailPositions[i * 3 + 0] = trailPositions[(i - 1) * 3 + 0];
        trailPositions[i * 3 + 1] = trailPositions[(i - 1) * 3 + 1];
        trailPositions[i * 3 + 2] = trailPositions[(i - 1) * 3 + 2];
      }
      trailPositions[0] = ref.current.position.x;
      trailPositions[1] = ref.current.position.y;
      trailPositions[2] = ref.current.position.z;
      trailGeoRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <mesh ref={ref}>
        <boxGeometry args={[0.20, 0.26, 0.04]} />
        <meshBasicMaterial color={ACCENT_COOL} toneMapped={false} />
      </mesh>
      <points ref={trailRef}>
        <bufferGeometry ref={trailGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPositions, 3]}
            count={trailCount}
          />
        </bufferGeometry>
        <pointsMaterial
          color={ACCENT_COOL}
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </points>
    </>
  );
}

// -------- Bedrock orb (output) --------
function BedrockOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.2;
    const scale = 1 + Math.sin(t * 1.2) * 0.04;
    ref.current.scale.setScalar(scale);
  });
  return (
    <mesh ref={ref} position={[0, 0, 6]}>
      <icosahedronGeometry args={[0.7, 1]} />
      <meshStandardMaterial
        color={0x101216}
        emissive={ACCENT}
        emissiveIntensity={0.45}
        roughness={0.3}
        metalness={0.7}
        wireframe={false}
      />
    </mesh>
  );
}

// -------- Dust motes --------
function Dust({ count = 320 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3 + 0] = (Math.random() - 0.5) * 28;
      p[i * 3 + 1] = (Math.random() - 0.5) * 14;
      p[i * 3 + 2] = (Math.random() - 0.5) * 28;
    }
    return p;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        color={0xa0aab4}
        size={0.012}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

// -------- Scene + camera choreography --------
function SceneContents() {
  // four pulse refs — one per gate
  const pulses = useRef<React.MutableRefObject<number>[]>([
    { current: 0 },
    { current: 0 },
    { current: 0 },
    { current: 0 },
  ]).current;

  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Camera scroll choreography — set up GSAP ScrollTrigger
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(8, 2.5, -10);
    cam.lookAt(0, 0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Stage targets — one per section the user scrolls past
    const stages = [
      { x: 8, y: 2.5, z: -10, lx: 0, ly: 0, lz: 0 },   // 00 hero (orbital-ish)
      { x: 6, y: 1.4, z: -8, lx: -1, ly: 0, lz: -3 },   // 01 rules — frame L1
      { x: 0, y: 6.5, z: -6, lx: 0, ly: 0, lz: 0 },     // 02 signals — top-down
      { x: 5, y: 1.2, z: 0, lx: 0, ly: 0, lz: 2 },      // 03 inference — frame L3/L4
      { x: 4, y: 1.0, z: 4, lx: 0, ly: 0, lz: 6 },      // 04 decision — frame Bedrock
      { x: 1.5, y: 0.8, z: 8, lx: 0, ly: 0, lz: 6 },    // 05 output — pull in close
    ];

    const proxy = { stage: 0 };
    const tween = gsap.to(proxy, {
      stage: stages.length - 1,
      ease: "none",
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.0,
      },
      onUpdate: () => {
        const s = proxy.stage;
        const i = Math.floor(s);
        const f = s - i;
        const a = stages[i];
        const b = stages[Math.min(i + 1, stages.length - 1)];
        cam.position.x = THREE.MathUtils.lerp(a.x, b.x, f);
        cam.position.y = THREE.MathUtils.lerp(a.y, b.y, f);
        cam.position.z = THREE.MathUtils.lerp(a.z, b.z, f);
        const lx = THREE.MathUtils.lerp(a.lx, b.lx, f);
        const ly = THREE.MathUtils.lerp(a.ly, b.ly, f);
        const lz = THREE.MathUtils.lerp(a.lz, b.lz, f);
        cam.lookAt(lx, ly, lz);
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [camera]);

  // Cursor parallax
  const targetParallax = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetParallax.current = { x: nx * 0.6, y: ny * 0.3 };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetParallax.current.x * 0.05,
      delta * 2,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -targetParallax.current.y * 0.05,
      delta * 2,
    );
  });

  return (
    <>
      <fog attach="fog" args={[BG, 8, 26]} />
      <color attach="background" args={[BG]} />
      <ambientLight intensity={0.18} />
      <directionalLight position={[5, 5, -5]} intensity={0.55} color={ACCENT} />
      <directionalLight position={[-5, -3, 5]} intensity={0.35} color={ACCENT_COOL} />

      <group ref={groupRef}>
        {/* 4 layered slabs along z, increasing size */}
        <Slab position={[0, 0, -3]} size={[5.0, 3.0, 0.08]} pulseRef={pulses[0]} />
        <Slab position={[0, 0, -1]} size={[5.2, 3.0, 0.08]} pulseRef={pulses[1]} />
        <Slab position={[0, 0, 1]}  size={[5.4, 3.0, 0.08]} pulseRef={pulses[2]} />
        <Slab position={[0, 0, 3]}  size={[5.6, 3.0, 0.08]} pulseRef={pulses[3]} />

        <DocumentParticle pulses={pulses} />
        <BedrockOrb />
        <Dust />
      </group>
    </>
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function PipelineScene() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [8, 2.5, -10], fov: 38, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
      </Canvas>
    </div>
  );
}
