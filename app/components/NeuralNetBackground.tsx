"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Points, PointMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { TechUIFloating } from "./TechUIFloating";

// Generate random nodes
const NODES = 20;
type Vec3 = [number, number, number];
interface Node {
  position: Vec3;
  velocity: Vec3;
}
function generateNodes(): Node[] {
  return Array(NODES)
    .fill(0)
    .map(() => ({
      position: [
        Math.random() * 10 - 5,
        Math.random() * 5 - 2.5,
        Math.random() * 10 - 5,
      ] as Vec3,
      velocity: [
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
      ] as Vec3,
    }));
}

function AnimatedNeuralNet() {
  const nodes = useRef<Node[]>(generateNodes());

  // Animate node positions
  useFrame(() => {
    nodes.current.forEach((node) => {
      for (let i = 0; i < 3; i++) {
        node.position[i] += node.velocity[i];
        // Bounce within bounds
        if (node.position[i] > 5 || node.position[i] < -5) {
          node.velocity[i] *= -1;
        }
      }
    });
  });

  return (
    <>
      {nodes.current.map((node, i) => (
        <Line
          key={i}
          points={[
            node.position as Vec3,
            nodes.current[(i + 1) % nodes.current.length].position as Vec3,
          ]}
          color="#e30613"
          lineWidth={0.5}
          transparent
          opacity={0.5}
        />
      ))}
      {nodes.current.map((node, i) => (
        <mesh key={`node-${i}`} position={node.position as Vec3}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#fff" emissive="#e30613" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </>
  );
}

function ParticleField() {
  const particles = useMemo(() => {
    const count = 1000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = Math.random() * 10 - 5;
    }
    return arr;
  }, []);

  return (
    <Points positions={particles}>
      <PointMaterial
        color="#e30613"
        size={0.02}
        sizeAttenuation
        transparent
      />
    </Points>
  );
}

function FloatingBlobs() {
  // Three floating blobs with different colors and movement
  const blob1 = useRef<THREE.Mesh>(null);
  const blob2 = useRef<THREE.Mesh>(null);
  const blob3 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (blob1.current) {
      blob1.current.position.x = Math.sin(t * 0.5) * 2.5 - 2;
      blob1.current.position.y = Math.cos(t * 0.7) * 1.2 + 1.5;
      blob1.current.position.z = Math.sin(t * 0.3) * 1.5;
      blob1.current.scale.set(1.2 + Math.sin(t * 0.8) * 0.15, 1.1 + Math.cos(t * 0.6) * 0.1, 1.2 + Math.sin(t * 0.5) * 0.1);
      blob1.current.rotation.y = t * 0.2;
    }
    if (blob2.current) {
      blob2.current.position.x = Math.cos(t * 0.4) * 2.8 + 2.5;
      blob2.current.position.y = Math.sin(t * 0.6) * 1.3 - 1.2;
      blob2.current.position.z = Math.cos(t * 0.5) * 1.2;
      blob2.current.scale.set(1.1 + Math.sin(t * 0.7) * 0.12, 1.2 + Math.cos(t * 0.5) * 0.1, 1.1 + Math.sin(t * 0.6) * 0.1);
      blob2.current.rotation.x = t * 0.18;
    }
    if (blob3.current) {
      blob3.current.position.x = Math.sin(t * 0.3) * 2.2;
      blob3.current.position.y = Math.cos(t * 0.5) * 1.5;
      blob3.current.position.z = Math.sin(t * 0.7) * 1.8 - 2;
      blob3.current.scale.set(0.9 + Math.sin(t * 0.9) * 0.1, 1.0 + Math.cos(t * 0.4) * 0.1, 1.0 + Math.sin(t * 0.7) * 0.1);
      blob3.current.rotation.z = t * 0.15;
    }
  });

  return (
    <>
      <mesh ref={blob1} position={[-2, 1.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#fca5a5"
          roughness={0.3}
          transmission={0.7}
          thickness={1.2}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
          ior={1.2}
          reflectivity={0.15}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh ref={blob2} position={[2.5, -1.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshPhysicalMaterial
          color="#f8d7da"
          roughness={0.25}
          transmission={0.8}
          thickness={1.1}
          clearcoat={0.4}
          clearcoatRoughness={0.18}
          ior={1.15}
          reflectivity={0.12}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh ref={blob3} position={[0, 0, -2]} castShadow receiveShadow>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshPhysicalMaterial
          color="#dc2626"
          roughness={0.2}
          transmission={0.85}
          thickness={1.0}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
          ior={1.18}
          reflectivity={0.18}
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  );
}

const LOGO_URLS = [
  "/logos/openai.png",
  "/logos/figma.png",
  "/logos/nextjs.png",
  "/logos/react.png",
  "/logos/aws.png",
  "/logos/azure.png",
  "/logos/googlecloud.png",
  // Add more logo image paths as needed
];

function FloatingLogos({ count = 8 }) {
  // Load all logo textures
  const textures = useTexture(LOGO_URLS) as THREE.Texture[];
  // Each logo gets its own animation state
  const logos = useRef(
    Array.from({ length: count }, (_, i) => ({
      t: Math.random() * 100,
      x: Math.random() * 10 - 5,
      y: Math.random() * 6 - 3,
      z: Math.random() * -6 - 2,
      scale: 0.7 + Math.random() * 0.7,
      speed: 0.12 + Math.random() * 0.08,
      textureIdx: Math.floor(Math.random() * LOGO_URLS.length),
      opacity: 0,
    }))
  );

  useFrame((state, delta) => {
    logos.current.forEach((logo) => {
      logo.t += delta * logo.speed;
      logo.y += Math.sin(logo.t) * 0.01;
      logo.x += Math.cos(logo.t * 0.5) * 0.01;
      logo.z += 0.01 * logo.speed;
      logo.opacity = Math.max(0, 1 - (logo.z + 8) / 8);
      // If out of view, respawn
      if (logo.z > 2) {
        logo.t = Math.random() * 100;
        logo.x = Math.random() * 10 - 5;
        logo.y = Math.random() * 6 - 3;
        logo.z = Math.random() * -6 - 10;
        logo.scale = 0.7 + Math.random() * 0.7;
        logo.speed = 0.12 + Math.random() * 0.08;
        logo.textureIdx = Math.floor(Math.random() * LOGO_URLS.length);
        logo.opacity = 0;
      }
    });
  });

  return (
    <>
      {logos.current.map((logo) => {
        const texture = textures[logo.textureIdx];
        return (
          <mesh
            key={`logo-${logo.t}-${logo.x}-${logo.y}`}
            position={[logo.x, logo.y, logo.z]}
            scale={[logo.scale, logo.scale, 1]}
            rotation={[0, 0, Math.sin(logo.t) * 0.2]}
          >
            <planeGeometry args={[1.2, 1.2]} />
            <meshBasicMaterial
              map={texture}
              transparent
              opacity={logo.opacity}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </>
  );
}

export function NeuralNetBackground() {
  // Memoize camera position for performance
  const cameraPosition = useMemo(() => [0, 0, 12] as [number, number, number], []);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        gl={{ alpha: true }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <ambientLight intensity={0.5} />
        <FloatingBlobs />
        <FloatingLogos count={10} />
        <TechUIFloating />
        <AnimatedNeuralNet />
        <ParticleField />
      </Canvas>
    </div>
  );
} 