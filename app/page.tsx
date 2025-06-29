"use client";

import { useEffect, useRef } from "react";
import * as three from "three";

export default function Home() {
  return (
    <>
      <ThreeScene />
    </>
  );
}

const ThreeScene = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize scene camera and renderer
    const scene = new three.Scene();
    const camera = new three.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );

    camera.position.z = 5;

    const renderer = new three.WebGLRenderer();

    renderer.setSize(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );

    canvasRef.current.appendChild(renderer.domElement);

    // add a simple cube
    const geometry = new three.BoxGeometry();
    const material = new three.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new three.Mesh(geometry, material);
    scene.add(cube);

    // add lighting
    const light = new three.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    // animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.1;
      cube.rotation.y += 0.1;
      renderer.render(scene, camera);
    };

    animate();

    // cleanup on mount
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  }, []);

  return <div ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};
