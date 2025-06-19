"use client";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function TechUIFloating({ url = "/figma-ui.glb" }) {
  const group = useRef<THREE.Group>(null);
  const { nodes } = useGLTF(url);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.7) * 0.7 + 0.5;
      group.current.rotation.y = Math.sin(t * 0.3) * 0.3;
      group.current.rotation.x = Math.cos(t * 0.2) * 0.1;
    }
  });

  // Replace 'FigmaWindow' with the actual node name if different
  return (
    <group ref={group} position={[0, 0.5, -2]} scale={[1.2, 1.2, 1.2]}>
      {nodes.FigmaWindow && <primitive object={nodes.FigmaWindow} />}
    </group>
  );
} 