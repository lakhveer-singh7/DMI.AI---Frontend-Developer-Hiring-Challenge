"use client";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Fresnel + scanline shader material
const HologramMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      attach="material"
      transparent
      uniforms={
        {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#e30613") },
        }
      }
      vertexShader={`
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `}
      fragmentShader={`
        uniform float uTime;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        float fresnel(vec3 normal, vec3 viewDir) {
          return pow(1.0 - dot(normal, viewDir), 2.5);
        }
        
        void main() {
          // Scan lines
          float scan = 0.5 + 0.5 * sin((vWorldPosition.y * 8.0) + uTime * 4.0);
          float grid = step(0.98, abs(sin(vWorldPosition.x * 8.0 + uTime * 2.0)));
          float alpha = 0.5 * scan * (1.0 - grid);
          
          // Fresnel edge
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float edge = fresnel(normalize(vNormal), viewDir);
          
          vec3 color = mix(uColor, vec3(1.0, 1.0, 1.0), edge * 0.7);
          gl_FragColor = vec4(color, alpha + edge * 0.5);
        }
      `}
    />
  );
};

interface HologramEffectProps {
  position?: [number, number, number];
  scale?: [number, number, number];
}

export function HologramEffect({ 
  position = [0, 0, 0], 
  scale = [1, 1, 1] 
}: HologramEffectProps) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 48, 48]} />
      <HologramMaterial />
    </mesh>
  );
} 