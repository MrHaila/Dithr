# dithr

Small, fun dithering SPA. Pick shape/text/image, pick Bayer or blue noise, pick gradient direction, render solid or outline. Resizable canvas.

## Structure

- `src/App.vue` — root, holds all state.
- `src/components/DitherCanvas.vue` — canvas, render loop, alpha-mask + threshold + gradient ramp.
- `src/components/shapes.ts` — primitive draw fns (circle, yinyang, illuminati, pentagram).
- `src/components/ToggleSwitch.vue` — reusable pill switch (scoped slot for icons).
- `src/components/*Toggle.vue` — icon toggles built on ToggleSwitch (DitherMode, Gradient, RenderStyle, ContentType).
- `src/components/{ShapePicker,TextInput,ImagePicker}.vue` — content input panels below canvas.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.

<!--VITE PLUS END-->
