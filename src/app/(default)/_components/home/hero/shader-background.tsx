'use client';

import { useEffect, useRef } from 'react';

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentShaderSource = `
precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
void main() {
  vec2 uv = v_texCoord;
  float noise = sin(uv.x * 3.0 + u_time * 0.5) * cos(uv.y * 3.0 + u_time * 0.5);
  noise += 0.5 * sin(uv.x * 6.0 - u_time * 0.8) * cos(uv.y * 4.0 + u_time * 0.4);
  vec3 brandBlue = vec3(0.066, 0.384, 0.658);
  vec3 surface = vec3(0.95, 0.95, 0.98);
  vec3 lavender = vec3(0.87, 0.84, 0.92);
  vec3 color = mix(surface, brandBlue, noise * 0.5 + 0.5);
  color = mix(color, lavender, sin(u_time * 0.2) * 0.2);
  gl_FragColor = vec4(color, 1.0);
}`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);

    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const timeUniform = gl.getUniformLocation(program, 'u_time');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrame = 0;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
      const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    const render = (timestamp: number) => {
      resize();
      gl.uniform1f(timeUniform, timestamp * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reducedMotion) animationFrame = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    render(0);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="tw:pointer-events-none tw:absolute tw:inset-0 tw:size-full tw:opacity-45 tw:dark:opacity-20"
    />
  );
}
