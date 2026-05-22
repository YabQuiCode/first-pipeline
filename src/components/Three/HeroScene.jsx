import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'

function GlassShape({ position, scale = 1, speed = 1, geometry = 'icosahedron', color = '#a5b4fc' }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.15 * speed
      ref.current.rotation.y = state.clock.elapsedTime * 0.1 * speed
    }
  })

  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    side: THREE.DoubleSide,
  }), [color])

  const geo = useMemo(() => {
    switch (geometry) {
      case 'torus': return new THREE.TorusGeometry(1, 0.35, 16, 32)
      case 'cube': return new THREE.BoxGeometry(1, 1, 1)
      case 'octahedron': return new THREE.OctahedronGeometry(1)
      case 'dodecahedron': return new THREE.DodecahedronGeometry(1)
      default: return new THREE.IcosahedronGeometry(1, 0)
    }
  }, [geometry])

  return (
    <Float speed={1.2 * speed} rotationIntensity={0.25} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale} geometry={geo} material={mat} />
    </Float>
  )
}

function MouseLight() {
  const light = useRef()
  const { viewport } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    if (light.current) {
      light.current.position.x += (mouse.current.x * viewport.width * 0.4 - light.current.position.x) * 0.05
      light.current.position.y += (mouse.current.y * viewport.height * 0.4 - light.current.position.y) * 0.05
    }
  })

  return <pointLight ref={light} intensity={8} distance={15} color="#818cf8" />
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#e0e7ff" />
        <MouseLight />

        <GlassShape position={[-3.5, 1.5, -1]} scale={0.9} speed={0.8} geometry="icosahedron" color="#c4b5fd" />
        <GlassShape position={[3.8, -0.5, -2]} scale={0.75} speed={1.2} geometry="torus" color="#93c5fd" />
        <GlassShape position={[-2, -2, -1.5]} scale={0.6} speed={0.9} geometry="cube" color="#a5b4fc" />
        <GlassShape position={[2.5, 2.2, -3]} scale={0.5} speed={1.1} geometry="icosahedron" color="#c4b5fd" />
        <GlassShape position={[0.5, -2.5, -2]} scale={0.45} speed={0.7} geometry="torus" color="#6ee7b7" />
        <GlassShape position={[-4, 0, -3]} scale={0.4} speed={1.3} geometry="cube" color="#93c5fd" />
      </Canvas>
    </div>
  )
}
