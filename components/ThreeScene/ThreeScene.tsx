"use client";

// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect, useRef } from "react";
import * as three from "three";
import {
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/postprocessing/EffectComposer";

export const ThreeScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // scene setup
    const scene = new three.Scene();

    // camera setup
    const camera = new three.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3;

    // renderer setup
    const renderer = new three.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // particle syster
    const particleCount = 100000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 4;
    }

    const geometry = new three.BufferGeometry();
    geometry.setAttribute("position", new three.BufferAttribute(positions, 3));

    const material = new three.PointsMaterial({
      size: 0.01,
      color: 0xffffff,
    });

    const particles = new three.Points(geometry, material);
    scene.add(particles);

    // sphere to represent lights
    const lightSphereGeometry = new three.SphereGeometry(0.05, 16, 16);

    const createLight = (color: number) => {
      const light = new three.PointLight(color, 1, 5);
      const sphere = new three.Mesh(
        lightSphereGeometry,
        new three.MeshBasicMaterial({ color })
      );
      light.add(sphere);
      scene.add(light);
      return light;
    };

    const light1 = createLight(0xffaa00);
    const light2 = createLight(0x0040ff);
    const light3 = createLight(0x80ff80);

    // orbit control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // animate lights in 3d space

    const clock = new three.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const r = 1.5;

      light1.position.set(
        Math.sin(t * 0.7) * r,
        Math.cos(t * 0.5) * r,
        Math.cos(t * 0.3) * r
      );
      light2.position.set(
        Math.cos(t * 0.3) * r,
        Math.sin(t * 0.5) * r,
        Math.sin(t * 0.7) * r
      );
      light3.position.set(
        Math.sin(t * 0.7) * r,
        Math.cos(t * 0.3) * r,
        Math.sin(t * 0.5) * r
      );

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // handle resize
    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};
