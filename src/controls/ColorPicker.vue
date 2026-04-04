<template>
    <div class="w-fit p-2">
        <div class="flex gap-3">
            <div class="relative">
                <canvas
                    ref="slCanvas"
                    class="rounded-sm cursor-crosshair"
                    width="200"
                    height="200"
                    @mousedown="startSLDrag"/>
                <div
                    class="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
                    :style="slIndicatorStyle"/>
            </div>
            <div class="relative">
                <canvas
                    ref="hueCanvas"
                    class="rounded-sm cursor-pointer"
                    width="20"
                    height="200"
                    @mousedown="startHueDrag"/>
                <div class="absolute w-7 h-2 -left-1 rounded-full border-2 border-white shadow-md pointer-events-none"
                     :style="hueIndicatorStyle"/>
            </div>
        </div>

        <!-- Selected color display -->
        <div class="mt-4 rounded-sm h-10 w-full" :style="`background-color:${selectedColor}`">
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";

const props = defineProps<{
    initialColor: string;
}>();

const emit = defineEmits<{
    "update:color": [color: string];
}>();

const {h: initialColorHue, s: initialColorSaturation, l: initialColorLight} = hexToHSL(props.initialColor);
const slCanvas = ref<HTMLCanvasElement | null>(null);
const hueCanvas = ref<HTMLCanvasElement | null>(null);

// HSL state
const hue = ref(initialColorHue); // 0 - 360
const saturation = ref(initialColorSaturation); // 0 - 1
const lightness = ref(initialColorLight); // 0 - 1

const selectedColor = ref(`hsl(${hue.value}, ${saturation.value * 100}, ${lightness.value * 100})`);

let slDragging = false;
let hueDragging = false;

// Draw hue slider
function drawHueCanvas(): void {
    if (!hueCanvas.value) {
        return;
    }

    const ctx: CanvasRenderingContext2D | null = hueCanvas.value.getContext("2d");
    if (!ctx) {
        return;
    }

    const gradient: CanvasGradient = ctx.createLinearGradient(0, 0, 0, hueCanvas.value.height);
    for (let i: number = 0; i <= 360; i += 1) {
        gradient.addColorStop(i / 360, `hsl(${i},100%,50%)`);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, hueCanvas.value.width, hueCanvas.value.height);
}

// Draw SL square
function drawSaturationLightness(): void {
    if (!slCanvas.value) {
        return;
    }

    const ctx: CanvasRenderingContext2D | null = slCanvas.value.getContext("2d");
    if (!ctx) {
        return;
    }

    const width: number = slCanvas.value.width;
    const height: number = slCanvas.value.height;

    // Base hue color
    ctx.fillStyle = `hsl(${hue.value},100%,50%)`;
    ctx.fillRect(0, 0, width, height);

    // Saturation overlay
    const satGrad: CanvasGradient = ctx.createLinearGradient(0, 0, width, 0);
    satGrad.addColorStop(0, "white");
    satGrad.addColorStop(1, "transparent");
    ctx.fillStyle = satGrad;
    ctx.fillRect(0, 0, width, height);

    // Lightness overlay
    const lightGrad: CanvasGradient = ctx.createLinearGradient(0, 0, 0, height);
    lightGrad.addColorStop(0, "transparent");
    lightGrad.addColorStop(1, "black");
    ctx.fillStyle = lightGrad;
    ctx.fillRect(0, 0, width, height);
}

// Update selected color string
function updateSelectedColor(): void {
    const s: string = (saturation.value * 100).toFixed(1);
    const l: string = (lightness.value * 100).toFixed(1);
    selectedColor.value = `hsl(${hue.value.toFixed(0)},${s}%,${l}%)`;
}

// Drag handlers
function startSLDrag(e: MouseEvent): void {
    slDragging = true;
    handleSLDrag(e);
    window.addEventListener("mousemove", handleSLDrag);
    window.addEventListener("mouseup", stopSLDrag);
}

function handleSLDrag(e: MouseEvent): void {
    if (!slDragging || !slCanvas.value) {
        return;
    }
    const rect: DOMRect = slCanvas.value.getBoundingClientRect();
    const x: number = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const y: number = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    saturation.value = x / rect.width;
    lightness.value = 1 - y / rect.height;

    updateSelectedColor();
}

function stopSLDrag(): void {
    slDragging = false;
    window.removeEventListener("mousemove", handleSLDrag);
    window.removeEventListener("mouseup", stopSLDrag);
}

function startHueDrag(e: MouseEvent): void {
    hueDragging = true;
    handleHueDrag(e);

    window.addEventListener("mousemove", handleHueDrag);
    window.addEventListener("mouseup", stopHueDrag);
}

function handleHueDrag(e: MouseEvent): void {
    if (!hueDragging || !hueCanvas.value) {
        return;
    }
    const rect: DOMRect = hueCanvas.value.getBoundingClientRect();
    const y: number = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    hue.value = (y / rect.height) * 360;

    drawSaturationLightness();
    updateSelectedColor();
}

function stopHueDrag(): void {
    hueDragging = false;

    window.removeEventListener('mousemove', handleHueDrag);
    window.removeEventListener('mouseup', stopHueDrag);
}

// Convert a 6-digit hex color string (#RRGGBB) to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } {
    hex = hex.replace(/^#/, "");
    if (hex.length != 6) {
        throw "Invalid hex color";
    }

    const r: number = parseInt(hex.slice(0, 2), 16) / 255;
    const g: number = parseInt(hex.slice(2, 4), 16) / 255;
    const b: number = parseInt(hex.slice(4, 6), 16) / 255;

    const max: number = Math.max(r, g, b);
    const min: number = Math.min(r, g, b);
    let h: number = 0;
    let s: number = 0;
    let l: number = (max + min) / 2;

    if (max != min) {
        const d: number = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (r >= g && r >= b) {
            h = (g - b) / d + (g < b ? 6 : 0);
        } else if (g >= r && g >= b) {
            h = (b - r) / d + 2;
        } else {
            h = (r - g) / d + 4;
        }
        h *= 60;
    }

    return {h, s, l}
}

// Convert HSL to a 6-digit hex color string (#RRGGBB)
function hslToHex(h: number, s: number, l: number): string {
    h = h % 360;
    s = Math.min(Math.max(s, 0), 1);
    l = Math.min(Math.max(l, 0), 1);

    const c: number = (1 - Math.abs(2 * l - 1)) * s;
    const x: number = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m: number = l - c / 2;

    let r: number = 0;
    let g: number = 0;
    let b: number = 0;

    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    const toHex = (v: number): string => Math.round((v + m) * 255).toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Indicator positions
const slIndicatorStyle = computed(() => ({
    left: `${saturation.value * 200 - 8}px`,
    top: `${(1 - lightness.value) * 200 - 8}px`,
    backgroundColor: selectedColor.value
}));

const hueIndicatorStyle = computed(() => ({
    top: `${(hue.value / 360) * 200 - 4}px`,
    backgroundColor: `hsl(${hue.value}, 100%, 50%)`
}));

let watchThrottle: NodeJS.Timeout | null = null;
watch(selectedColor, () => {
    if (watchThrottle) {
        return;
    }

    watchThrottle = setTimeout(() => {
        watchThrottle = null;
        emit("update:color", hslToHex(hue.value, saturation.value, lightness.value));
    }, 500);
});

onMounted(() => {
    drawHueCanvas();
    drawSaturationLightness();
    updateSelectedColor();
});
</script>

<style scoped>
canvas {
    image-rendering: pixelated;
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
}
</style>