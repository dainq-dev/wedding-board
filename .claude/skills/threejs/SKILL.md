---
name: threejs
description: Three.js 3D/WebGL development - scenes, cameras, renderer, geometry, materials, textures, lighting, shadows, GLTF/HDR loading, animation, raycasting and controls, GLSL shaders, post-processing (bloom, DOF). Use whenever the user builds or debugs anything with three.js, WebGL, React Three Fiber, 3D scenes, 3D models, or visual effects in the browser.
---

# Three.js

Router skill. Read only the reference file(s) matching the task — each has a Quick Start, API patterns and performance tips.

| Task | Read |
|------|------|
| Scene, camera, renderer, Object3D hierarchy, transforms, resize loop | [references/fundamentals.md](references/fundamentals.md) |
| Built-in shapes, BufferGeometry, custom vertices, InstancedMesh | [references/geometry.md](references/geometry.md) |
| Material types, PBR, material properties | [references/materials.md](references/materials.md) |
| Texture settings, UVs, cubemaps, env maps | [references/textures.md](references/textures.md) |
| Light types, shadows, IBL | [references/lighting.md](references/lighting.md) |
| GLTF/Draco, textures, HDR, loading progress | [references/loaders.md](references/loaders.md) |
| AnimationMixer, skeletal, morph targets, procedural motion | [references/animation.md](references/animation.md) |
| Raycasting, OrbitControls etc., mouse/touch, selection | [references/interaction.md](references/interaction.md) |
| GLSL, ShaderMaterial, uniforms, onBeforeCompile | [references/shaders.md](references/shaders.md) |
| EffectComposer, bloom, DOF, custom passes | [references/postprocessing.md](references/postprocessing.md) |

## Always

- Import addons from `three/addons/...` (not the old `three/examples/jsm/...`).
- Set `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` and handle resize (camera.aspect + `updateProjectionMatrix()`).
- Use `renderer.setAnimationLoop` instead of manual `requestAnimationFrame`.
- Dispose geometries, materials, textures and render targets when removing objects — especially in React/Next.js unmount effects.
- In Next.js, three.js touches `window`: render it in a `'use client'` component (or `dynamic(..., { ssr: false })`).
