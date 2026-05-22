import { useEffect, useRef } from "react";
import { Renderer, Program, Color, Mesh, Triangle, Vec2 } from "ogl";

const vertex = `attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}`;

const fragment = `precision highp float;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uParticleCount;
uniform float uBaseSize;
uniform float uSpeed;
uniform float uSpread;
uniform float uAlpha;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 uvAspect = vec2(uv.x * aspect, uv.y);
  
  float totalLight = 0.0;
  vec3 totalColor = vec3(0.0);
  
  for (float i = 0.0; i < 300.0; i++) {
    if (i >= uParticleCount) break;
    
    float id = i + 1.0;
    float speed = uSpeed * (0.3 + hash(vec2(id, 0.0)) * 0.7);
    
    vec2 pos = vec2(
      hash(vec2(id, 1.0)) + sin(uTime * speed * 0.3 + id) * 0.02 * uSpread,
      hash(vec2(id, 2.0)) + cos(uTime * speed * 0.4 + id * 1.3) * 0.02 * uSpread
    );
    pos = fract(pos);
    pos.x *= aspect;
    
    // Mouse interaction
    vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
    float mouseDist = distance(uvAspect, mouseAspect);
    if (uMouse.x > 0.0) {
      vec2 dir = uvAspect - mouseAspect;
      float push = smoothstep(0.3, 0.0, mouseDist) * 0.08;
      pos += normalize(pos - mouseAspect) * push;
    }
    
    float size = uBaseSize * (0.5 + hash(vec2(id, 3.0)) * 0.5) / uResolution.y;
    float dist = distance(uvAspect, pos);
    float light = size / (dist * dist + 0.0001);
    light *= uAlpha;
    
    // Color selection
    float colorSeed = hash(vec2(id, 4.0));
    vec3 color;
    if (colorSeed < 0.33) color = uColor1;
    else if (colorSeed < 0.66) color = uColor2;
    else color = uColor3;
    
    totalLight += light;
    totalColor += color * light;
  }
  
  totalLight = clamp(totalLight, 0.0, 1.0);
  totalColor = totalColor / max(totalLight, 0.001);
  
  gl_FragColor = vec4(totalColor, totalLight * 0.6);
}`;

function hexToVec3(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

export default function Particles({
  particleColors = ["#ffffff", "#ffffff", "#ffffff"],
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 100,
  moveParticlesOnHover = false,
  alphaParticles = false,
  className = "",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });

    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";

    const geometry = new Triangle(gl);

    const c1 = hexToVec3(particleColors[0] || "#ffffff");
    const c2 = hexToVec3(particleColors[1] || particleColors[0] || "#ffffff");
    const c3 = hexToVec3(particleColors[2] || particleColors[0] || "#ffffff");

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new Color(...c1) },
        uColor2: { value: new Color(...c2) },
        uColor3: { value: new Color(...c3) },
        uResolution: { value: new Vec2(gl.canvas.width, gl.canvas.height) },
        uMouse: { value: new Vec2(-1, -1) },
        uParticleCount: { value: Math.min(particleCount, 300) },
        uBaseSize: { value: particleBaseSize },
        uSpeed: { value: speed },
        uSpread: { value: particleSpread },
        uAlpha: { value: alphaParticles ? 0.5 : 1.0 },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value.set(w, h);
    };

    const onMouseMove = (e) => {
      if (!moveParticlesOnHover) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      program.uniforms.uMouse.value.set(x, y);
    };

    const onMouseLeave = () => {
      program.uniforms.uMouse.value.set(-1, -1);
    };

    resize();
    window.addEventListener("resize", resize);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    let raf;
    const update = (t) => {
      raf = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [particleColors, particleCount, particleSpread, speed, particleBaseSize, moveParticlesOnHover, alphaParticles]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
}
