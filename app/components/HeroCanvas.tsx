"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#0a0a0a", 8, 20);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 200, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.85,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    const dirWarm = new THREE.DirectionalLight(0xff3b00, 1.5);
    dirWarm.position.set(3, 2, 2);
    const dirCool = new THREE.DirectionalLight(0xffffff, 0.8);
    dirCool.position.set(-3, -1, 2);
    const point = new THREE.PointLight(0xff3b00, 2.0, 8);
    point.position.set(0, 0, 4);

    scene.add(ambient, dirWarm, dirCool, point);

    let targetX = 0;
    let targetY = 0;

    const onMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = -y * 0.8;
    };

    window.addEventListener("mousemove", onMove);

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const canObserveResize = typeof ResizeObserver !== "undefined";
    const resizeObserver = canObserveResize
      ? new ResizeObserver(handleResize)
      : null;

    if (resizeObserver) {
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", handleResize);
    }

    const clock = new THREE.Clock();
    let frameId = 0;

    const renderScene = () => {
      const time = clock.getElapsedTime();
      if (!prefersReduced) {
        mesh.rotation.x = Math.sin(time * 0.4) * 0.3;
        mesh.rotation.y = time * 0.25;
        mesh.rotation.z = Math.cos(time * 0.3) * 0.15;
      }

      mesh.position.x += (targetX - mesh.position.x) * 0.05;
      mesh.position.y += (targetY - mesh.position.y) * 0.05;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(renderScene);
    };

    renderScene();

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }
      cancelAnimationFrame(frameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0"
    />
  );
}
