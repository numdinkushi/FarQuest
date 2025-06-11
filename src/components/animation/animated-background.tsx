import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GameState } from '~/types';

interface ThreeJSBackgroundProps {
  gameState: GameState['state'];
}

export const ThreeJSBackground: React.FC<ThreeJSBackgroundProps> = ({ gameState }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(400, 300);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(renderer.domElement);

    // Create floating crystals
    const crystals: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.OctahedronGeometry(0.1);
      const material = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      const crystal = new THREE.Mesh(geometry, material);
      crystal.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      scene.add(crystal);
      crystals.push(crystal);
    }

    camera.position.z = 5;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      crystals.forEach((crystal, index) => {
        crystal.rotation.x += 0.01;
        crystal.rotation.y += 0.01;
        crystal.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();
    sceneRef.current = scene;
    rendererRef.current = renderer;

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [gameState]);

  return <div className="absolute inset-0 pointer-events-none" ref={mountRef} />;
};