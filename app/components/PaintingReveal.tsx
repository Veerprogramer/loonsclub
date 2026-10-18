"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type PaintingRevealProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Total reveal length in seconds */
  duration?: number;
  /** Where the paint starts spreading from, in image UV (0–1). Defaults to the face. */
  focus?: [number, number];
  /** Page colour the painting's edges melt into (hex) */
  paper?: string;
  onComplete?: () => void;
};

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// A monochrome wash appears first, then colour bleeds outward from the focus like wet
// watercolour, with pigment pooling at the edge. Hovering reveals a pencil underdrawing.
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uScale;
uniform vec2 uTexel;
uniform vec2 uFocus;
uniform float uAspect;
uniform float uMono;
uniform float uPaint;
uniform float uTime;
uniform vec3 uPaper;
uniform vec3 uPaperSrc; // the painting's own paper tone
uniform vec2 uMouse;
uniform float uLens;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
float L(vec2 uv) { return dot(texture2D(uTex, uv).rgb, vec3(0.299, 0.587, 0.114)); }

void main() {
  vec2 uv = (vUv - 0.5) / uScale + 0.5;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { gl_FragColor = vec4(uPaper, 1.0); return; }

  vec2 asp = vec2(uAspect, 1.0);
  float d = length((uv - uFocus) * asp) / 0.78;
  float n = fbm(uv * asp * 4.0);
  float n2 = fbm(uv * asp * 9.0 + 7.3);

  // Pencil underdrawing (hover lens only)
  vec2 t = uTexel;
  float tl = L(uv + t * vec2(-1.0, -1.0)), tc = L(uv + t * vec2(0.0, -1.0)), tr = L(uv + t * vec2(1.0, -1.0));
  float ml = L(uv + t * vec2(-1.0, 0.0)), mr = L(uv + t * vec2(1.0, 0.0));
  float bl = L(uv + t * vec2(-1.0, 1.0)), bc = L(uv + t * vec2(0.0, 1.0)), br = L(uv + t * vec2(1.0, 1.0));
  float gx = -tl - 2.0 * ml - bl + tr + 2.0 * mr + br;
  float gy = -tl - 2.0 * tc - tr + bl + 2.0 * bc + br;
  float edge = smoothstep(0.16, 0.7, length(vec2(gx, gy)));
  float shade = (1.0 - L(uv)) * 0.35 * (0.6 + 0.4 * n2);
  vec3 sketch = mix(uPaper, vec3(0.23, 0.22, 0.21), clamp(edge * 0.75 + shade * 0.8, 0.0, 0.85));
  // Monochrome wash
  vec3 mono = min(vec3(1.0), uPaper * L(uv) / dot(uPaper, vec3(0.299, 0.587, 0.114))); // warm-toned to match the paper
  float monoMask = smoothstep(0.0, 0.2, uMono * 1.35 - (d * 0.6 + n * 0.5));

  // Watercolour bleed
  float front = uPaint * 1.3 - (d * 0.7 + n * 0.45 + n2 * 0.1);
  float paint = smoothstep(0.0, 0.07, front);
  float rim = smoothstep(-0.015, 0.02, front) * (1.0 - smoothstep(0.02, 0.11, front));
  vec2 wob = (vec2(noise(uv * 30.0 + uTime * 0.6), noise(uv * 30.0 - uTime * 0.6 + 3.0)) - 0.5) * 0.012 * (1.0 - paint);
  vec3 col = min(vec3(1.0), texture2D(uTex, uv + wob).rgb * uPaper / uPaperSrc);
  vec3 pooled = col * mix(vec3(1.0), col, 0.5) * 0.9;

  vec3 c = mix(mix(uPaper, mono, monoMask), col, paint);
  c = mix(c, pooled, rim * 0.6);

  // Hover: peek at the underdrawing through a soft, ragged brush
  float md = length((uv - uMouse) * asp) + (n2 - 0.5) * 0.06;
  c = mix(c, sketch, (1.0 - smoothstep(0.07, 0.14, md)) * uLens);

  // Deckled edges that melt into the page
  float border = min(min(uv.x, 1.0 - uv.x) * uAspect, min(uv.y, 1.0 - uv.y));
  c = mix(uPaper, c, smoothstep(0.0, 0.07, border + (n - 0.5) * 0.05));

  gl_FragColor = vec4(c, 1.0);
}`;

// Paper tone sampled from the edges of stevejobs.jpg
const PAINTING_PAPER = "#f8f3ee";

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const hexToRgb = (hex: string) => {
  const v = parseInt(hex.replace("#", ""), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255] as const;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export default function PaintingReveal({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  duration = 5.5,
  focus = [0.5, 0.33],
  paper = "#f7f2ec",
  onComplete,
}: PaintingRevealProps) {
  const reduceMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  const [fx, fy] = focus;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let cancelled = false;
    const img = new window.Image();

    img.onload = () => {
      if (cancelled) return;
      const gl = canvas.getContext("webgl", { antialias: false });
      const vs = gl && compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAG);
      const program = gl?.createProgram();
      if (!gl || !vs || !fs || !program) {
        setFailed(true);
        onCompleteRef.current?.();
        return;
      }
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, "aPos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

      const u = (name: string) => gl.getUniformLocation(program, name);
      const imageAspect = img.naturalWidth / img.naturalHeight;
      gl.uniform1f(u("uAspect"), imageAspect);
      gl.uniform2f(u("uFocus"), fx, fy);
      gl.uniform3f(u("uPaper"), ...hexToRgb(paper));
      gl.uniform3f(u("uPaperSrc"), ...hexToRgb(PAINTING_PAPER));

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        // object-contain: fit the painting inside the canvas
        const canvasAspect = width / height;
        const scale = canvasAspect > imageAspect ? [imageAspect / canvasAspect, 1] : [1, canvasAspect / imageAspect];
        gl.uniform2f(u("uScale"), scale[0], scale[1]);
        // Sobel step ~1.5 on-screen pixels so pencil lines stay crisp at any size
        const drawnW = canvas.width * scale[0];
        const drawnH = canvas.height * scale[1];
        gl.uniform2f(u("uTexel"), Math.max(1.5 / drawnW, 1 / img.naturalWidth), Math.max(1.5 / drawnH, 1 / img.naturalHeight));
      };

      // Hover lens state (desktop only, after the reveal)
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, lens: 0, target: 0 };
      let revealDone = false;
      let t0 = 0;

      const draw = (now: number) => {
        if (!t0) t0 = now;
        const t = (now - t0) / 1000;
        gl.uniform1f(u("uTime"), t);
        gl.uniform1f(u("uMono"), easeOutCubic(clamp01(t / (duration * 0.45))));
        gl.uniform1f(u("uPaint"), easeInOutSine(clamp01((t - duration * 0.25) / (duration * 0.75))));
        mouse.x += (mouse.tx - mouse.x) * 0.15;
        mouse.y += (mouse.ty - mouse.y) * 0.15;
        mouse.lens += (mouse.target - mouse.lens) * 0.1;
        gl.uniform2f(u("uMouse"), mouse.x, mouse.y);
        gl.uniform1f(u("uLens"), mouse.lens);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        if (!revealDone && t >= duration) {
          revealDone = true;
          onCompleteRef.current?.();
        }
        const settling =
          Math.abs(mouse.target - mouse.lens) > 0.002 ||
          Math.abs(mouse.tx - mouse.x) > 0.0005 ||
          Math.abs(mouse.ty - mouse.y) > 0.0005;
        raf = !revealDone || settling ? requestAnimationFrame(draw) : 0;
      };
      const wake = () => {
        if (!raf) raf = requestAnimationFrame(draw);
      };

      const toImageUv = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        const canvasAspect = r.width / r.height;
        const [sx, sy] = canvasAspect > imageAspect ? [imageAspect / canvasAspect, 1] : [1, canvasAspect / imageAspect];
        mouse.tx = ((e.clientX - r.left) / r.width - 0.5) / sx + 0.5;
        mouse.ty = ((e.clientY - r.top) / r.height - 0.5) / sy + 0.5;
      };
      const onMove = (e: PointerEvent) => {
        if (!revealDone) return;
        toImageUv(e);
        if (mouse.target === 0) {
          // Jump the lens to the cursor instead of sliding in from its last spot
          mouse.x = mouse.tx;
          mouse.y = mouse.ty;
        }
        mouse.target = 1;
        wake();
      };
      const onLeave = () => {
        mouse.target = 0;
        wake();
      };

      const observer = new ResizeObserver(() => {
        resize();
        wake();
      });
      observer.observe(canvas);
      if (canHover) {
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerleave", onLeave);
      }
      resize();
      wake();

      cleanup = () => {
        observer.disconnect();
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerleave", onLeave);
        gl.deleteTexture(texture);
        gl.deleteProgram(program);
      };
    };

    let cleanup = () => {};
    img.src = src;

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [src, duration, fx, fy, paper, reduceMotion]);

  if (reduceMotion || failed) {
    return (
      <div className={`relative ${className}`}>
        <Image src={src} alt={alt} fill preload sizes={sizes} className="object-contain" />
      </div>
    );
  }

  return (
    <div className={className}>
      <canvas ref={canvasRef} role="img" aria-label={alt} className="block h-full w-full" style={{ background: paper }} />
    </div>
  );
}
