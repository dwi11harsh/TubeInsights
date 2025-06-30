"use client";

import { useRef, useEffect } from "react";
import * as three from "three";

const vertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

void main() {
  vec2 uv = vUv;
  vec2 centeredUv = uv - 0.5;
  vec3 normal = normalize(vec3(centeredUv, 1.0));

  // Light 1 (rotating)
  vec3 lightPos1 = vec3(sin(uTime) * 0.5, cos(uTime) * 0.5, 1.0);
  vec3 lightDir1 = normalize(lightPos1 - vec3(centeredUv, 0.0));
  float diff1 = max(dot(normal, lightDir1), 0.0);

  // Light 2 (mouse-controlled)
  vec3 lightPos2 = vec3(uMouse.x, uMouse.y, 1.0);
  vec3 lightDir2 = normalize(lightPos2 - vec3(centeredUv, 0.0));
  float diff2 = max(dot(normal, lightDir2), 0.0);

  // Light 3 (static ambient)
  vec3 lightPos3 = vec3(-0.6, -0.4, 1.0);
  vec3 lightDir3 = normalize(lightPos3 - vec3(centeredUv, 0.0));
  float diff3 = max(dot(normal, lightDir3), 0.0);

  // Specular
  vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
  vec3 reflectDir = reflect(-lightDir1, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
  spec *= 0.3;

  // Animate base color like time-of-day
  float dayCycle = sin(uTime * 0.1);
  vec3 warm = vec3(0.9, 0.5, 0.3);
  vec3 cool = vec3(0.2, 0.6, 1.0);
  vec3 baseColor = mix(warm, cool, dayCycle * 0.5 + 0.5);

  // Light colors
  vec3 lightColor1 = vec3(1.0, 0.4, 0.4);
  vec3 lightColor2 = vec3(0.4, 0.8, 1.0);
  vec3 lightColor3 = vec3(0.2, 0.3, 0.6);

  // Combine lights
  vec3 lighting = baseColor * (
    lightColor1 * diff1 +
    lightColor2 * diff2 +
    lightColor3 * diff3
  ) + vec3(spec);

  // Gamma correction
  vec3 finalColor = pow(lighting, vec3(1.0 / 2.2));
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const ThreeShaderBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Init scene, camera, renderer
    const scene = new three.Scene();
    const camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new three.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // Fullscreen quad
    const geometry = new three.PlaneGeometry(2, 2);
    const uniforms = {
      uTime: { value: 0.0 },
      uResolution: {
        value: new three.Vector2(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        ),
      },
      uMouse: { value: new three.Vector2(0.0, 0.0) },
    };

    const material = new three.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const mesh = new three.Mesh(geometry, material);
    scene.add(mesh);

    // Animate
    const clock = new three.Clock();

    let lastTime = 0;
    const targetFPS = 60;

    const animate = (time: number) => {
      requestAnimationFrame(animate);

      const delta = time - lastTime;
      if (delta < 1000 / targetFPS) return;

      lastTime = time;

      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      uniforms.uMouse.value.set(x, y);
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      const width = containerRef.current!.clientWidth;
      const height = containerRef.current!.clientHeight;

      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // run once initially

    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
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
        overflow: "hidden",
        zIndex: -1,
      }}
    />
  );
};
