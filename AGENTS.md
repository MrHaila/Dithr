# dithr

Small, fun dithering SPA. Pick shape/text/image (or drag-and-drop an image), pick Bayer or blue noise, pick gradient direction, render solid or outline. Resizable canvas. Export to PNG.

## Structure

- `src/App.vue` — root, holds all state; whole-page image drag-and-drop (drag state → canvas overlay) and object-URL lifecycle.
- `src/components/DitherCanvas.vue` — canvas + render loop (alpha-mask + threshold + gradient ramp), drag/keyboard resize. Exposes its `<canvas>` as `el`; shows DropOverlay when `overlay` is set.
- `src/components/DropOverlay.vue` — dashed drop-zone over the canvas: resting hint in image mode + valid/invalid drag feedback.
- `src/components/shapes.ts` — primitive draw fns (circle, yinyang, illuminati, pentagram).
- `src/components/ToggleSwitch.vue` — reusable pill switch (scoped slot for icons); `size="sm"` shrinks it for the export dialog.
- `src/components/*Toggle.vue` — icon toggles built on ToggleSwitch (DitherMode, Gradient, RenderStyle, ContentType).
- `src/components/BevelButton.vue` — reusable 3D-beveled pill button (`variant` default/primary); used by the export trigger and the modal actions.
- `src/components/{ShapePicker,TextInput,ImagePicker}.vue` — content input panels below canvas; ImagePicker shows the chosen file name and emits the `File`.
- `src/components/MuseumLabel.vue` — gallery "tombstone" label (title/medium/dims; editable artist).
- `src/components/museumTitle.ts` — shared `artworkTitle()` + `snakeCase()`; drives both the museum card title and the export filename so they never drift.
- `src/components/ExportModal.vue` — `<dialog>` export modal: composites DitherCanvas' live bitmap to a PNG (`dithr_<snake(title)>.png`) with bg/frame/color/resolution options. Opened by the Export button in App.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.

<!--VITE PLUS END-->
