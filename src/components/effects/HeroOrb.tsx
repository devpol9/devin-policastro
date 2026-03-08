import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const OrbMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.24;
    meshRef.current.rotation.x = Math.sin(t * 0.45) * 0.22;
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.12;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.15, 4]} />
      <meshStandardMaterial
        color="hsl(38 90% 58%)"
        emissive="hsl(28 85% 50%)"
        emissiveIntensity={0.22}
        roughness={0.25}
        metalness={0.55}
        transparent
        opacity={0.22}
      />
    </mesh>
  );
};

const HeroOrb = () => {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none opacity-75">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[2, 3, 4]} intensity={0.85} color="hsl(38 90% 58%)" />
        <pointLight position={[-3, -2, 3]} intensity={0.5} color="hsl(28 85% 50%)" />
        <OrbMesh />
      </Canvas>
    </div>
  );
};

export default HeroOrb;
