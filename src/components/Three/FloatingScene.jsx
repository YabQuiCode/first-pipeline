import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function FloatingShape({ position, geometry = 'sphere', scale = 1, color = '#a5b4fc', speed = 1 }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1 * speed
      ref.current.rotation.y = state.clock.elapsedTime * 0.15 * speed
    }
  })

  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    side: THREE.DoubleSide,
  }), [color])

  const geo = useMemo(() => {
    switch (geometry) {
      case 'torus': return new THREE.TorusGeometry(1, 0.35, 12, 24)
      case 'cube': return new THREE.BoxGeometry(1, 1, 1)
      case 'octahedron': return new THREE.OctahedronGeometry(1)
      case 'dodecahedron': return new THREE.DodecahedronGeometry(1)
      default: return new THREE.IcosahedronGeometry(1, 0)
    }
  }, [geometry])

  return (
    <Float speed={1.2 * speed} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={ref} position={position} scale={scale} geometry={geo} material={mat} />
    </Float>
  )
}

export default function FloatingScene({ shapes = [], className = '' }) {
  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 5]} intensity={0.5} color="#e0e7ff" />
        {shapes.map((shape, i) => <FloatingShape key={i} {...shape} />)}
      </Canvas>
    </div>
  )
}
