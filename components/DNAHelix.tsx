"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

export function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const playIconsRef = useRef<THREE.Group[]>([]);

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }

    playIconsRef.current.forEach((icon, i) => {
      if (icon) {
        icon.rotation.z = state.clock.elapsedTime * 2 + i * 0.5;
        icon.position.y = Math.sin(state.clock.elapsedTime + i * 0.5) * 0.1;
      }
    });
  });

  const helixPoints: [number, number, number][] = [];
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 4;
    const x = Math.cos(angle) * 2;
    const z = Math.sin(angle) * 2;
    const y = (i - 10) * 0.3;
    helixPoints.push([x, y, z]);
  }

  return (
    <group ref={groupRef}>
      {helixPoints.map((point, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh
            position={point}
            ref={(el: THREE.Mesh | null) => {
              if (el) playIconsRef.current[i] = el.parent as THREE.Group;
            }}
          >
            <coneGeometry args={[0.1, 0.2, 3]} />
            <meshStandardMaterial
              color="#FF0000"
              emissive="#FF0000"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}

      {/* Connecting lines */}
      <mesh>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3(
              helixPoints.map((p) => new THREE.Vector3(...p))
            ),
            64,
            0.02,
            8,
            false,
          ]}
        />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
