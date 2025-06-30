"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export const ThreeScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // === INITIAL SETUP ===
    const scene = new THREE.Scene();
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const BLOOM_LAYER = 1;

    // === PARTICLE SYSTEM ===
    const particleCount = 100000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleUniforms = {
      uLight1: { value: new THREE.Vector3() },
      uLight2: { value: new THREE.Vector3() },
      uLight3: { value: new THREE.Vector3() },
      uLight4: { value: new THREE.Vector3() },
      uColor1: { value: new THREE.Color(0xffaa00) },
      uColor2: { value: new THREE.Color(0x0040ff) },
      uColor3: { value: new THREE.Color(0x80ff80) },
      uColor4: { value: new THREE.Color(0xffffff) },
    };

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: particleUniforms,
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_PointSize = 1.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vPos;

        uniform vec3 uLight1;
        uniform vec3 uLight2;
        uniform vec3 uLight3;
        uniform vec3 uLight4;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;

        float computeLight(vec3 lightPos) {
          float d = distance(vPos, lightPos);
          return 1.0 / (d * d + 0.1);
        }

        void main() {
          float b1 = computeLight(uLight1);
          float b2 = computeLight(uLight2);
          float b3 = computeLight(uLight3);
          float b4 = computeLight(uLight4);

          vec3 color = uColor1 * b1 + uColor2 * b2 + uColor3 * b3 + uColor4 * b4;
          color = clamp(color, 0.0, 1.0);

          float alpha = max(max(max(b1, b2), b3), b4);
          alpha = smoothstep(0.0, 0.5, alpha);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      depthWrite: false,
      transparent: true,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    particles.layers.set(0); // not on bloom layer
    rootGroup.add(particles);

    // === LIGHTS + BLOOM LAYER ===
    const lightSphereGeometry = new THREE.SphereGeometry(0.05, 16, 16);

    const createLight = (color: number) => {
      const light = new THREE.PointLight(color, 1, 5);
      const sphere = new THREE.Mesh(
        lightSphereGeometry,
        new THREE.MeshBasicMaterial({ color })
      );
      sphere.layers.enable(0); // show in scene
      sphere.layers.enable(BLOOM_LAYER); // glow in bloom pass
      light.add(sphere);
      light.layers.set(BLOOM_LAYER); // only needed for bloom
      rootGroup.add(light);
      return light;
    };

    const light1 = createLight(0xff0000); // red
    particleUniforms.uColor1.value.set(0xff0000); // red

    const light2 = createLight(0xff0000); // red
    particleUniforms.uColor2.value.set(0xff0000); // red

    const light3 = createLight(0xffffff); // white
    particleUniforms.uColor3.value.set(0xffffff); // white

    const light4 = createLight(0xffffff); // white
    particleUniforms.uColor4 = { value: new THREE.Color(0xffffff) };

    rootGroup.add(light1);
    rootGroup.add(light2);
    rootGroup.add(light3);
    rootGroup.add(light4);

    // === POSTPROCESSING SETUP ===
    const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    const materials: { [uuid: string]: THREE.Material } = {};

    const darkenNonBloomed = (obj: THREE.Object3D) => {
      if (obj instanceof THREE.Mesh && !obj.layers.isEnabled(BLOOM_LAYER)) {
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;
      }
    };

    const restoreMaterial = (obj: THREE.Object3D) => {
      if (materials[obj.uuid]) {
        (obj as THREE.Mesh).material = materials[obj.uuid];
        delete materials[obj.uuid];
      }
    };

    const composer = new EffectComposer(renderer);
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // === ORBIT CONTROLS ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // === ANIMATION LOOP ===
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const r = 1.5;

      // Animate lights
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
      light4.position.set(
        Math.cos(t * 0.4) * r,
        Math.sin(t * 0.4) * r,
        Math.cos(t * 0.8) * r
      );

      // rotate root group
      rootGroup.rotation.y += 0.002;
      rootGroup.rotation.x += 0.002;
      // Update uniforms
      particleUniforms.uLight1.value.copy(light1.position);
      particleUniforms.uLight2.value.copy(light2.position);
      particleUniforms.uLight3.value.copy(light3.position);
      particleUniforms.uLight4.value.copy(light4.position);

      // Update controls
      controls.update();

      // Bloom render pass
      scene.traverse(darkenNonBloomed);
      camera.layers.set(BLOOM_LAYER);
      composer.render();

      // Regular scene pass
      scene.traverse(restoreMaterial);
      camera.layers.set(0);
      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    };

    animate();

    // === RESIZE HANDLING ===
    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
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
