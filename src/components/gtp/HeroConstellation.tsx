import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const NEON = 0x22e3ff;
const TEAL = 0x0a8aa9;

// ---------- Texture builders (built once, cached in module scope) ----------

let _glow: THREE.CanvasTexture | null = null;
function getGlowTex() {
  if (_glow) return _glow;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(125,249,255,1)");
  g.addColorStop(0.25, "rgba(34,227,255,0.85)");
  g.addColorStop(1, "rgba(34,227,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  _glow = new THREE.CanvasTexture(c);
  return _glow;
}

function roundRect(
  x: CanvasRenderingContext2D,
  a: number,
  b: number,
  w: number,
  h: number,
  r: number,
) {
  x.beginPath();
  x.moveTo(a + r, b);
  x.arcTo(a + w, b, a + w, b + h, r);
  x.arcTo(a + w, b + h, a, b + h, r);
  x.arcTo(a, b + h, a, b, r);
  x.arcTo(a, b, a + w, b, r);
  x.closePath();
}

let _card: THREE.CanvasTexture | null = null;
function getCardTex() {
  if (_card) return _card;
  const W = 1024,
    H = 648,
    pad = 90;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d")!;
  const cx = pad,
    cy = pad,
    cw = W - pad * 2,
    ch = H - pad * 2,
    r = 48;
  // shadow base
  x.save();
  x.shadowColor = "rgba(34,227,255,0.7)";
  x.shadowBlur = 70;
  roundRect(x, cx, cy, cw, ch, r);
  x.fillStyle = "#072a3a";
  x.fill();
  x.restore();
  // gradient fill
  roundRect(x, cx, cy, cw, ch, r);
  x.save();
  x.clip();
  const g = x.createLinearGradient(cx, cy, cx + cw, cy + ch);
  g.addColorStop(0, "#0A8AA9");
  g.addColorStop(0.55, "#0b3346");
  g.addColorStop(1, "#04202e");
  x.fillStyle = g;
  x.fillRect(cx, cy, cw, ch);
  const sh = x.createLinearGradient(cx, cy, cx + cw, cy);
  sh.addColorStop(0, "rgba(255,255,255,0)");
  sh.addColorStop(0.5, "rgba(125,249,255,0.10)");
  sh.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = sh;
  x.fillRect(cx, cy, cw, ch);
  x.restore();
  // neon stroke
  roundRect(x, cx, cy, cw, ch, r);
  x.lineWidth = 5;
  x.strokeStyle = "rgba(34,227,255,0.85)";
  x.stroke();
  // chip
  x.fillStyle = "rgba(34,227,255,0.85)";
  roundRect(x, cx + 50, cy + 120, 110, 84, 16);
  x.fill();
  // brand
  x.fillStyle = "#EAF6FA";
  x.font = '700 46px Inter, sans-serif';
  x.textAlign = "right";
  x.fillText("Gate to Pay", cx + cw - 50, cy + 80);
  x.textAlign = "left";
  // number
  x.fillStyle = "rgba(234,246,250,0.92)";
  x.font = '600 50px monospace';
  x.fillText("5241  ••••  ••••  4242", cx + 50, cy + ch - 140);
  // cardholder
  x.fillStyle = "rgba(143,178,194,0.9)";
  x.font = '600 30px Inter, sans-serif';
  x.fillText("CARDHOLDER", cx + 50, cy + ch - 70);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  _card = t;
  return t;
}

type IconDraw = (x: CanvasRenderingContext2D) => void;
const icons: Record<string, IconDraw> = {
  wallet: (x) => {
    roundRect(x, -90, -60, 180, 120, 24);
    x.stroke();
    x.beginPath();
    x.moveTo(-90, -20);
    x.lineTo(90, -20);
    x.stroke();
    x.beginPath();
    x.arc(55, 10, 12, 0, 7);
    x.fill();
  },
  pos: (x) => {
    roundRect(x, -70, -80, 140, 160, 18);
    x.stroke();
    roundRect(x, -46, -58, 92, 60, 8);
    x.stroke();
    x.beginPath();
    x.moveTo(-40, 40);
    x.lineTo(40, 40);
    x.stroke();
  },
  bolt: (x) => {
    x.beginPath();
    x.moveTo(20, -80);
    x.lineTo(-40, 10);
    x.lineTo(4, 10);
    x.lineTo(-20, 80);
    x.lineTo(50, -15);
    x.lineTo(4, -15);
    x.closePath();
    x.stroke();
  },
  split: (x) => {
    x.beginPath();
    x.arc(-60, 0, 16, 0, 7);
    x.fill();
    x.beginPath();
    x.moveTo(-44, 0);
    x.lineTo(30, -55);
    x.moveTo(-44, 0);
    x.lineTo(40, 0);
    x.moveTo(-44, 0);
    x.lineTo(30, 55);
    x.stroke();
    [-55, 0, 55].forEach((y) => {
      x.beginPath();
      x.arc(46, y, 13, 0, 7);
      x.fill();
    });
  },
};

const _nodeTexCache = new Map<string, THREE.CanvasTexture>();
function getNodeTex(label: string, draw: IconDraw) {
  const cached = _nodeTexCache.get(label);
  if (cached) return cached;
  const S = 512;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const x = c.getContext("2d")!;
  const p = 56,
    w = S - p * 2,
    h = S - p * 2;
  x.save();
  x.shadowColor = "rgba(34,227,255,0.45)";
  x.shadowBlur = 40;
  roundRect(x, p, p, w, h, 44);
  x.fillStyle = "rgba(8,38,56,0.92)";
  x.fill();
  x.restore();
  roundRect(x, p, p, w, h, 44);
  x.lineWidth = 4;
  x.strokeStyle = "rgba(34,227,255,0.55)";
  x.stroke();
  x.save();
  x.translate(S / 2, S / 2 - 24);
  x.strokeStyle = "#7DF9FF";
  x.fillStyle = "#7DF9FF";
  x.lineWidth = 16;
  x.lineCap = "round";
  x.lineJoin = "round";
  draw(x);
  x.restore();
  x.fillStyle = "#EAF6FA";
  x.font = '700 44px Inter, sans-serif';
  x.textAlign = "center";
  x.fillText(label, S / 2, S - 96);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  _nodeTexCache.set(label, t);
  return t;
}

// ---------- Node definitions ----------

interface NodeDef {
  label: string;
  icon: IconDraw;
  base: [number, number, number];
  amp: number;
  speed: number;
}

const ALL_NODES: NodeDef[] = [
  { label: "Wallets", icon: icons.wallet, base: [4.45, 1.25, -0.7], amp: 0.18, speed: 0.6 },
  { label: "Acceptance", icon: icons.pos, base: [4.7, -1.1, -0.6], amp: 0.2, speed: 0.5 },
  { label: "Payouts", icon: icons.bolt, base: [1.15, 1.95, -1.0], amp: 0.22, speed: 0.7 },
  { label: "Collections", icon: icons.split, base: [1.35, -1.9, -0.9], amp: 0.2, speed: 0.55 },
];


// ---------- Scene ----------

interface SceneProps {
  reduced: boolean;
  variant: "mobile" | "desktop";
}

function Scene({ reduced, variant }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pulseRefs = useRef<THREE.Sprite[]>([]);
  const pointsRef = useRef<THREE.Points>(null);
  const parallax = useRef({ mx: 0, my: 0, tx: 0, ty: 0 });
  const { invalidate, gl, size } = useThree();

  const nodes = variant === "mobile" ? [ALL_NODES[0], ALL_NODES[2]] : ALL_NODES;
  const particleCount = variant === "mobile" ? 60 : 170;

  const corePos = useMemo(() => new THREE.Vector3(2.4, 0, -0.4), []);
  const cardPos = useMemo(() => new THREE.Vector3(0.75, 0.1, 0.9), []);


  // Rail curves: core -> card + each node
  const rails = useMemo(() => {
    const targets: THREE.Vector3[] = [cardPos, ...nodes.map((n) => new THREE.Vector3(...n.base))];
    return targets.map((end, i) => {
      const mid = corePos.clone().lerp(end, 0.5);
      mid.z += 0.9;
      mid.y += i % 2 ? 0.5 : -0.5;
      const curve = new THREE.CatmullRomCurve3([corePos.clone(), mid, end.clone()]);
      const points = curve.getPoints(44);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      return { curve, geo, phase: Math.random(), speed: 0.18 + Math.random() * 0.12 };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length]);

  // Particle positions
  const particlePositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.2) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
    }
    return arr;
  }, [particleCount]);

  // Pointer parallax
  useEffect(() => {
    if (reduced) return;
    const dom = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect();
      parallax.current.tx = (e.clientX - rect.left) / rect.width - 0.5;
      parallax.current.ty = (e.clientY - rect.top) / rect.height - 0.5;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, gl]);

  // Static frame paint when reduced
  useEffect(() => {
    if (reduced) invalidate();
  }, [reduced, invalidate]);

  // Responsive reframe: scale down on narrow desktops so nothing clips
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    if (size.width < 1100) {
      g.scale.setScalar(0.82);
      g.position.x = -0.4;
    } else {
      g.scale.setScalar(1);
      g.position.x = 0;
    }
    invalidate();
  }, [size.width, invalidate]);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.getElapsedTime();
    const p = parallax.current;
    p.mx += (p.tx - p.mx) * 0.05;
    p.my += (p.ty - p.my) * 0.05;
    if (groupRef.current) {
      groupRef.current.rotation.y = p.mx * 0.45;
      groupRef.current.rotation.x = p.my * 0.3;
    }
    if (coreRef.current) {
      const s = 1 + Math.sin(t * 1.6) * 0.06;
      coreRef.current.scale.setScalar(s);
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.3;
      wireRef.current.rotation.x = t * 0.15;
    }
    if (cardRef.current) {
      cardRef.current.position.y = 0.15 + Math.sin(t * 0.6) * 0.12;
      cardRef.current.rotation.z = 0.1 + Math.sin(t * 0.4) * 0.02;
    }
    nodes.forEach((n, i) => {
      const m = nodeRefs.current[i];
      if (m) m.position.y = n.base[1] + Math.sin(t * n.speed + i) * n.amp;
    });
    rails.forEach((r, i) => {
      const sprite = pulseRefs.current[i];
      if (!sprite) return;
      const tt = (t * r.speed + r.phase) % 1;
      const point = r.curve.getPointAt(tt);
      sprite.position.copy(point);
      (sprite.material as THREE.SpriteMaterial).opacity =
        0.4 + 0.5 * Math.sin(tt * Math.PI);
    });
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.02 + p.mx * 0.15;
    }
  });

  const glowTex = getGlowTex();
  const cardTex = getCardTex();

  return (
    <>
      <group ref={groupRef}>
        {/* Core */}
        <group ref={coreRef} position={corePos.toArray()}>
          <sprite scale={[4.2, 4.2, 1]}>
            <spriteMaterial
              map={glowTex}
              transparent
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              opacity={0.9}
            />
          </sprite>
          <mesh>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshBasicMaterial color={TEAL} transparent opacity={0.9} />
          </mesh>
          <mesh ref={wireRef}>
            <sphereGeometry args={[0.78, 20, 20]} />
            <meshBasicMaterial color={NEON} wireframe transparent opacity={0.35} />
          </mesh>
        </group>

        {/* Card */}
        <mesh
          ref={cardRef}
          position={cardPos.toArray()}
          rotation={[-0.12, -0.42, 0.1]}
        >
          <planeGeometry args={[2.98, 1.88]} />
          <meshBasicMaterial map={cardTex} transparent />
        </mesh>

        {/* Nodes */}
        {nodes.map((n, i) => (
          <mesh
            key={n.label}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            position={n.base}
          >
            <planeGeometry args={[1.5, 1.5]} />
            <meshBasicMaterial map={getNodeTex(n.label, n.icon)} transparent />
          </mesh>
        ))}

        {/* Rails */}
        {rails.map((r, i) => (
          <primitive
            key={`rail-${i}`}
            object={
              new THREE.Line(
                r.geo,
                new THREE.LineBasicMaterial({
                  color: NEON,
                  transparent: true,
                  opacity: 0.28,
                }),
              )
            }
          />
        ))}

        {/* Rail pulses */}
        {rails.map((_, i) => (
          <sprite
            key={`pulse-${i}`}
            ref={(el) => {
              if (el) pulseRefs.current[i] = el;
            }}
            scale={[0.5, 0.5, 1]}
          >
            <spriteMaterial
              map={glowTex}
              transparent
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              opacity={0.95}
            />
          </sprite>
        ))}
      </group>

      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial color={NEON} size={0.05} transparent opacity={0.5} />
      </points>
    </>
  );
}

interface HeroConstellationProps {
  active: boolean;
  reduced: boolean;
  variant: "mobile" | "desktop";
}

export default function HeroConstellation({
  active,
  reduced,
  variant,
}: HeroConstellationProps) {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 44, position: [0, 0, 10], near: 0.1, far: 100 }}
      frameloop={active && !reduced ? "always" : "demand"}
    >
      <Scene reduced={reduced} variant={variant} />
    </Canvas>
  );
}
