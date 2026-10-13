// ============================================================================
// eye's Among Us VR menu - initial PCVR/SteamVR prototype
// Based on the hand-menu layout and controller click pattern from cdih.ts.
// Runtime: Frida + frida-il2cpp-bridge. This is a prototype for private/test use.
//
// Controls:
//   Left thumbstick click (L3) toggles menu (Settings can switch to left X/Y)
//   Point with the hand opposite the menu hand and press its trigger to click
//   Teleport Gun: select it, then hold right grip + press right trigger
//   Speed Boost / Fly affect local rig movement only; no other players are modified.
// ============================================================================

declare const Il2Cpp: any;
//declare const Interceptor: any;
declare const console: any;
declare function uint64(value: number | string): any;

type V3 = [number, number, number];
const vadd = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vsub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const vmul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const vdot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const vcross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vlen = (a: V3) => Math.sqrt(vdot(a, a));
const vnorm = (a: V3): V3 => { const n = vlen(a); return n < 1e-5 ? [0, 0, 1] : [a[0] / n, a[1] / n, a[2] / n]; };
const log = (s: string) => console.log("[eye-amongusvr] " + s);

const THEMES = [
  { name: "Dark",   bg: [0.02, 0.02, 0.025, 1], btn: [0.14, 0.14, 0.16, 1], on: [0.15, 0.55, 0.95, 1], hover: [0.28, 0.30, 0.35, 1], text: [1, 1, 1, 1] },
  { name: "Blood",  bg: [0.05, 0.005, 0.01, 1], btn: [0.25, 0.03, 0.05, 1], on: [0.9, 0.08, 0.12, 1], hover: [0.42, 0.08, 0.1, 1], text: [1, 0.91, 0.92, 1] },
  { name: "Ocean",  bg: [0.005, 0.03, 0.06, 1], btn: [0.035, 0.13, 0.22, 1], on: [0.05, 0.55, 0.9, 1], hover: [0.08, 0.26, 0.42, 1], text: [0.91, 0.98, 1, 1] },
  { name: "Toxic",  bg: [0.005, 0.035, 0.005, 1], btn: [0.03, 0.14, 0.025, 1], on: [0.15, 0.9, 0.15, 1], hover: [0.08, 0.32, 0.08, 1], text: [0.91, 1, 0.91, 1] },
  { name: "Violet", bg: [0.025, 0.005, 0.05, 1], btn: [0.13, 0.04, 0.22, 1], on: [0.64, 0.22, 0.95, 1], hover: [0.3, 0.1, 0.45, 1], text: [0.98, 0.92, 1, 1] },
  { name: "Sunset", bg: [0.06, 0.015, 0.005, 1], btn: [0.25, 0.06, 0.02, 1], on: [1, 0.3, 0.08, 1], hover: [0.44, 0.12, 0.035, 1], text: [1, 0.94, 0.87, 1] },
  { name: "Mint",   bg: [0.005, 0.045, 0.035, 1], btn: [0.025, 0.16, 0.13, 1], on: [0.1, 0.85, 0.62, 1], hover: [0.06, 0.32, 0.25, 1], text: [0.9, 1, 0.96, 1] },
];

Il2Cpp.perform(() => {
  try { main(); } catch (e: any) { log("init error: " + e + (e && e.stack ? "\n" + e.stack : "")); }
});

function main() {
  const cache = new Map<string, any>();
  const assemblies: any[] = (Il2Cpp.domain.assemblies as any[]).slice().sort((a: any, b: any) =>
    (a.name === "Assembly-CSharp" ? -1 : 0) - (b.name === "Assembly-CSharp" ? -1 : 0));

  function K(name: string): any {
    if (cache.has(name)) return cache.get(name);
    let result: any = null;
    for (const a of assemblies) {
      try {
        const c = a.image.tryClass ? a.image.tryClass(name) : a.image.class(name);
        if (c) { result = c; break; }
      } catch (_) { }
    }
    if (!result) log("class not found: " + name);
    cache.set(name, result);
    return result;
  }
  function safeMethod(klass: any, name: string, count?: number): any {
    if (!klass) return null;
    try {
      for (const m of klass.methods) if (m.name === name && (count === undefined || m.parameterCount === count)) return m;
    } catch (_) { }
    return null;
  }
  function alive(o: any): boolean {
    if (!o) return false;
    try { const op = safeMethod(K("UnityEngine.Object"), "op_Implicit", 1); if (op) return !!op.invoke(o); } catch (_) { }
    try { o.handle; return true; } catch (_) { return false; }
  }

  const ObjectK = K("UnityEngine.Object");
  const GameObjectK = K("UnityEngine.GameObject");
  const TransformK = K("UnityEngine.Transform");
  const Vector3K = K("UnityEngine.Vector3");
  const QuaternionK = K("UnityEngine.Quaternion");
  const ResourcesK = K("UnityEngine.Resources");
  const RendererK = K("UnityEngine.Renderer");
  const ShaderK = K("UnityEngine.Shader");
  const ColliderK = K("UnityEngine.Collider");
  const CanvasK = K("UnityEngine.Canvas");
  const CanvasScalerK = K("UnityEngine.UI.CanvasScaler");
  const TextK = K("UnityEngine.UI.Text");
  const FontK = K("UnityEngine.Font");
  const RectTransformK = K("UnityEngine.RectTransform");
  const LineRendererK = K("UnityEngine.LineRenderer");
  const CameraK = K("UnityEngine.Camera");
  const PhysicsK = K("UnityEngine.Physics");
  const InputDevicesK = K("UnityEngine.XR.InputDevices");
  const zeroQ = (() => { try { return QuaternionK.field("identityQuaternion").value; } catch (_) { return null; } })();
  const boxShader = (() => { try { return ShaderK.method("Find", 1).invoke(Il2Cpp.string("Universal Render Pipeline/Lit")); } catch (_) { try { return ShaderK.method("Find", 1).invoke(Il2Cpp.string("Standard")); } catch (_) { return null; } } })();
  const textShader = (() => { try { return ShaderK.method("Find", 1).invoke(Il2Cpp.string("GUI/Text Shader")); } catch (_) { return boxShader; } })();
  const arial = (() => { try { return ResourcesK.method("GetBuiltinResource", 1).inflate(FontK).invoke(Il2Cpp.string("Arial.ttf")); } catch (_) { return null; } })();

  function destroy(o: any) { try { if (alive(o)) ObjectK.method("Destroy", 1).invoke(o); } catch (_) { } }
  function tr(o: any) { return o.method("get_transform").invoke(); }
  function getComp(o: any, type: any) { return o.method("GetComponent", 1).inflate(type).invoke(); }
  function addComp(o: any, type: any) { return o.method("AddComponent", 1).inflate(type).invoke(); }
  function readV3(p: any): V3 {
    try { return [Number(p.field("x").value), Number(p.field("y").value), Number(p.field("z").value)]; }
    catch (_) { return [Number(p.x), Number(p.y), Number(p.z)]; }
  }
  function tPos(t: any): V3 { return readV3(t.method("get_position").invoke()); }
  function setPos(t: any, p: V3) { t.method("set_position").invoke(p); }
  function tFwd(t: any): V3 { return vnorm(readV3(t.method("get_forward").invoke())); }
  function tRight(t: any): V3 { return vnorm(readV3(t.method("get_right").invoke())); }
  function tUp(t: any): V3 { return vnorm(readV3(t.method("get_up").invoke())); }
  function nameOfTransform(t: any): string {
    try { return t.method("get_name").invoke().toString(); } catch (_) { }
    try { return t.method("get_gameObject").invoke().method("get_name").invoke().toString(); } catch (_) { }
    return "";
  }
  function arrayAt(a: any, i: number): any {
    try { if (typeof a.length === "number") return a.get(i); } catch (_) { }
    try { return a.method("Get", 1).invoke(i); } catch (_) { }
    return null;
  }
  function arrayLen(a: any): number {
    try { if (typeof a.length === "number") return Number(a.length); } catch (_) { }
    try { return Number(a.method("get_Length").invoke()); } catch (_) { }
    return 0;
  }
  function getAll(type: any): any {
    try { return ResourcesK.method("FindObjectsOfTypeAll", 0).inflate(type).invoke(); } catch (_) { return null; }
  }

  // --------- XR controller features (same approach as CDIH) ---------
  const input: any = { leftId: -1, rightId: -1, lastScan: -10, lp: false, ls: false, lt: false, lg: false, lClick: false,
    rp: false, rs: false, rt: false, rg: false, lAxis: [0, 0], rAxis: [0, 0], previous: {} as any };
  let tryBool: any = null, tryVec2: any = null, isDeviceValid: any = null, getDeviceCharacteristics: any = null;
  const boolBuf = Il2Cpp.alloc(8), vecBuf = Il2Cpp.alloc(16);
  tryBool = safeMethod(InputDevicesK, "TryGetFeatureValue_bool", 3);
  tryVec2 = safeMethod(InputDevicesK, "TryGetFeatureValue_Vector2f", 3);
  isDeviceValid = safeMethod(InputDevicesK, "IsDeviceValid", 1);
  getDeviceCharacteristics = safeMethod(InputDevicesK, "GetDeviceCharacteristics", 1);
  function scanDevices(now: number) {
    let l = -1, r = -1;
    for (let id = 0; id < 32; id++) {
      try {
        if (!isDeviceValid || !isDeviceValid.invoke(uint64(id))) continue;
        const c = Number(getDeviceCharacteristics.invoke(uint64(id)));
        if ((c & 64) === 0) continue;
        if ((c & 256) !== 0) l = id;
        if ((c & 512) !== 0) r = id;
      } catch (_) { }
    }
    input.leftId = l >= 0 ? l : 1;
    input.rightId = r >= 0 ? r : 2;
    input.lastScan = now;
  }
  function readBool(id: number, usage: string): boolean {
    try { boolBuf.writeU64(0); return !!tryBool.invoke(uint64(id), Il2Cpp.string(usage), boolBuf) && boolBuf.readU8() !== 0; }
    catch (_) { return false; }
  }
  function readAxis(id: number): number[] {
    try { vecBuf.writeU64(0); if (tryVec2.invoke(uint64(id), Il2Cpp.string("Primary2DAxis"), vecBuf)) return [vecBuf.readFloat(), vecBuf.add(4).readFloat()]; }
    catch (_) { }
    return [0, 0];
  }
  function updateInput(now: number) {
    if (input.leftId < 0 || now - input.lastScan > 3) scanDevices(now);
    const prev = { lp: input.lp, ls: input.ls, lt: input.lt, lg: input.lg, lClick: input.lClick, rp: input.rp, rs: input.rs, rt: input.rt, rg: input.rg };
    input.previous = prev;
    input.lp = readBool(input.leftId, "PrimaryButton"); input.ls = readBool(input.leftId, "SecondaryButton");
    input.lt = readBool(input.leftId, "TriggerButton"); input.lg = readBool(input.leftId, "GripButton");
    input.lClick = readBool(input.leftId, "Primary2DAxisClick");
    input.rp = readBool(input.rightId, "PrimaryButton"); input.rs = readBool(input.rightId, "SecondaryButton");
    input.rt = readBool(input.rightId, "TriggerButton"); input.rg = readBool(input.rightId, "GripButton");
    input.lAxis = readAxis(input.leftId); input.rAxis = readAxis(input.rightId);
  }

  // --------- Find camera/hand transforms without assuming game class names ---------
  let cameraTransform: any = null, leftHandTransform: any = null, rightHandTransform: any = null, rigTransform: any = null;
  let transformScanAt = 0, cameraScanAt = 0;
  function refreshTransforms(now: number) {
    if (now < transformScanAt) return;
    transformScanAt = now + 2.5;
    try {
      const cam = CameraK.method("get_main", 0).invoke();
      if (alive(cam)) cameraTransform = tr(cam);
    } catch (_) { }
    if (!alive(cameraTransform) || now >= cameraScanAt) {
      cameraScanAt = now + 5;
      try {
        const cams = getAll(CameraK);
        for (let i = 0; i < arrayLen(cams); i++) {
          const cam = arrayAt(cams, i);
          if (!alive(cam)) continue;
          try { if (cam.method("get_enabled").invoke() && cam.method("get_gameObject").invoke().method("get_activeInHierarchy").invoke()) { cameraTransform = tr(cam); break; } } catch (_) { }
        }
      } catch (_) { }
    }
    let left: any = null, right: any = null, leftScore = -1, rightScore = -1;
    try {
      const all = getAll(TransformK);
      for (let i = 0; i < arrayLen(all); i++) {
        const t = arrayAt(all, i); if (!alive(t)) continue;
        const n = nameOfTransform(t).toLowerCase();
        let ls = -1, rs = -1;
        if (/(left|\bl\b).*(hand|controller|wrist|anchor|tracked)|((hand|controller).*(left|\bl\b))/.test(n)) ls = n.includes("controller") ? 8 : n.includes("hand") ? 10 : 5;
        if (/(right|\br\b).*(hand|controller|wrist|anchor|tracked)|((hand|controller).*(right|\br\b))/.test(n)) rs = n.includes("controller") ? 8 : n.includes("hand") ? 10 : 5;
        if (ls > leftScore) { leftScore = ls; left = t; }
        if (rs > rightScore) { rightScore = rs; right = t; }
      }
    } catch (_) { }
    if (alive(left)) leftHandTransform = left;
    if (alive(right)) rightHandTransform = right;
    rigTransform = findRigTransform();
  }
  function findRigTransform(): any {
    if (!alive(cameraTransform)) return null;
    const candidates: any[] = [];
    let p = cameraTransform;
    for (let i = 0; i < 8 && alive(p); i++) {
      candidates.push(p);
      try { p = p.method("get_parent").invoke(); } catch (_) { p = null; }
    }
    let best: any = null, score = -999;
    for (let i = 1; i < candidates.length; i++) {
      const n = nameOfTransform(candidates[i]).toLowerCase();
      let s = 0;
      if (n.includes("xr origin") || n.includes("xrorigin")) s += 12;
      if (n.includes("player rig") || n.includes("playerrig")) s += 11;
      if (n.includes("locomotion")) s += 8;
      if (n.includes("player")) s += 5;
      if (n.includes("origin") || n.includes("rig")) s += 3;
      if (n.includes("camera") || n.includes("head")) s -= 8;
      if (s > score) { best = candidates[i]; score = s; }
    }
    if (best && score > 0) return best;
    return candidates.length > 2 ? candidates[2] : candidates[candidates.length - 1];
  }
  function anchorTransform(right: boolean): any {
    const h = right ? rightHandTransform : leftHandTransform;
    return alive(h) ? h : cameraTransform;
  }

  // --------- UI primitives copied in style from the CDIH hand-menu ---------
  const state: any = {
    open: false, openButton: "L3", menuHandRight: false, theme: 0, page: 0, category: -1,
    guideMode: 0, guideLineSize: 1, guidePointerSize: 1, gunLineSize: 1, gunPointerSize: 1,
    speedBoost: false, fly: false, gunMode: "", dirty: true, hover: -1,
    lastClick: 0, lastToastUntil: 0, toast: "Ready", lastFrame: -1, lastNow: 0,
    menuRoot: null, canvasTransform: null, tooltip: null, menuItems: [] as any[], menuPos: [0, 0, 0] as V3,
    basis: { r: [1, 0, 0] as V3, u: [0, 1, 0] as V3, f: [0, 0, 1] as V3 },
    pointer: null, line: null, gunWasFiring: false, startPos: null as (V3 | null),
  };
  const SIZE_PRESETS = [0.35, 0.6, 0.8, 1, 1.25, 1.6, 2, 2.6, 3.4];
  const SIZE_NAMES = ["Tiny", "Smaller", "Small", "Normal", "Medium", "Big", "Bigger", "Huge", "Massive"];
  const categories: any[] = [];
  const menuScaleNames = ["Small", "Normal", "Large", "Huge"];
  const menuScaleValues = [0.82, 1, 1.2, 1.42];
  let menuScaleIndex = 1;
  function toast(s: string) { state.toast = s; state.lastToastUntil = state.lastNow + 2.0; log(s); if (alive(state.menuRoot)) state.dirty = true; }
  function menuScale(): number { return 1; }
  function createPrimitive(parent: any, pos: V3, scale: V3, color: number[] | null, prim = 3): any {
    const o = GameObjectK.method("CreatePrimitive", 1).invoke(prim);
    if (!alive(o)) throw new Error("CreatePrimitive failed");
    try { const c = getComp(o, ColliderK); if (alive(c)) destroy(c); } catch (_) { }
    const r = getComp(o, RendererK);
    if (alive(r)) {
      if (color === null) r.method("set_enabled").invoke(false);
      else {
        const m = r.method("get_material").invoke();
        if (boxShader) m.method("set_shader").invoke(boxShader);
        m.method("set_color").invoke(color);
      }
    }
    const t = tr(o);
    if (parent) t.method("SetParent", 2).invoke(parent, false);
    t.method("set_localPosition").invoke(pos);
    if (zeroQ) t.method("set_localRotation").invoke(zeroQ);
    t.method("set_localScale").invoke(scale);
    return o;
  }
  function makeText(canvasTr: any, text: string, color: number[], cx: number, cy: number, w: number, h: number, size: number) {
    const o = createPrimitive(canvasTr, [0, 0, 0], [1, 1, 1], null, 3);
    const txt = addComp(o, TextK);
    txt.method("set_text").invoke(Il2Cpp.string(text));
    if (arial) txt.method("set_font").invoke(arial);
    txt.method("set_fontSize").invoke(size);
    txt.method("set_color").invoke(color);
    try { txt.method("set_alignment").invoke(4); } catch (_) { }
    try { txt.method("set_horizontalOverflow").invoke(1); } catch (_) { }
    try { txt.method("set_verticalOverflow").invoke(1); } catch (_) { }
    try { txt.method("set_raycastTarget").invoke(false); } catch (_) { }
    const rt = getComp(o, RectTransformK);
    if (alive(rt)) {
      rt.method("set_sizeDelta").invoke([w * 1000, h * 1000]);
      rt.method("set_localPosition").invoke([cx * 1000, cy * 1000, -8]);
      if (zeroQ) rt.method("set_localRotation").invoke(zeroQ);
      rt.method("set_localScale").invoke([1, 1, 1]);
    }
    return o;
  }
  function destroyMenu() {
    destroy(state.menuRoot); state.menuRoot = null; state.canvasTransform = null; state.tooltip = null; state.menuItems = []; state.hover = -1;
  }
  function colorOf(o: any, color: number[]) {
    try { getComp(o, RendererK).method("get_material").invoke().method("set_color").invoke(color); } catch (_) { }
  }
  function refreshColors() {
    const th = THEMES[state.theme];
    state.menuItems.forEach((m: any, i: number) => {
      const on = m.toggle ? !!state[m.toggle] : m.radio ? state.gunMode === m.radio : false;
      colorOf(m.box, i === state.hover ? th.hover : (on ? th.on : th.btn));
    });
  }
  function tooltip(s: string) {
    if (!alive(state.tooltip)) return;
    try { getComp(state.tooltip, TextK).method("set_text").invoke(Il2Cpp.string(s.slice(0, 150))); } catch (_) { }
  }

  function mod(label: string, action: () => void, extra: any = {}) { return Object.assign({ label, action, tip: "Run " + label + "." }, extra); }
  categories.push({ name: "Movement", mods: [
    mod("Speed Boost", () => { state.speedBoost = !state.speedBoost; toast("Speed Boost " + (state.speedBoost ? "ON" : "OFF")); }, { toggle: "speedBoost", tip: "Adds local rig movement while using the left thumbstick. Test in a private lobby." }),
    mod("Fly / Hover", () => { state.fly = !state.fly; toast("Fly / Hover " + (state.fly ? "ON" : "OFF")); }, { toggle: "fly", tip: "Local rig movement: left stick moves, right stick Y rises/descends. Private/test use." }),
    mod("Teleport Forward 3m", () => { warpForward(3); }, { tip: "Moves your local rig three metres forward from head direction." }),
    mod("Teleport Forward 10m", () => { warpForward(10); }, { tip: "Moves your local rig ten metres forward from head direction." }),
    mod("Save Start Position", () => { const r = rigTransform; if (!alive(r)) return toast("Player rig not found yet"); state.startPos = tPos(r); toast("Start position saved"); }),
    mod("Reset Start Position", () => { if (!state.startPos || !alive(rigTransform)) return toast("Save a start position first"); setPos(rigTransform, state.startPos); toast("Returned to saved position"); }),
  ]});
  categories.push({ name: "Guns", mods: [
    mod("Teleport Gun", () => { state.gunMode = state.gunMode === "Teleport Gun" ? "" : "Teleport Gun"; toast(state.gunMode ? "Teleport Gun selected: hold right grip + trigger" : "Gun disabled"); }, { radio: "Teleport Gun", tip: "SELF-TELEPORT: aim at a surface and hold right grip + trigger. Does not teleport other players." }),
    mod("Test Gun (visual only)", () => { state.gunMode = state.gunMode === "Test Gun" ? "" : "Test Gun"; toast(state.gunMode ? "Test Gun selected (no action)" : "Gun disabled"); }, { radio: "Test Gun", tip: "Harmless ray preview to test line and pointer appearance. No world action." }),
    mod("Gun Guide: Both / Pointer / Line / Off", () => { state.guideMode = (state.guideMode + 1) % 4; toast("Gun Guide: " + ["Both", "Pointer only", "Line only", "Off"][state.guideMode]); state.dirty = true; }),
    mod("Gun Line Size: " + SIZE_NAMES[state.gunLineSize], () => { state.gunLineSize = (state.gunLineSize + 1) % SIZE_NAMES.length; categories[1].mods[3].label = "Gun Line Size: " + SIZE_NAMES[state.gunLineSize]; toast("Gun line size " + SIZE_NAMES[state.gunLineSize]); state.dirty = true; }),
    mod("Gun Pointer Size: " + SIZE_NAMES[state.gunPointerSize], () => { state.gunPointerSize = (state.gunPointerSize + 1) % SIZE_NAMES.length; categories[1].mods[4].label = "Gun Pointer Size: " + SIZE_NAMES[state.gunPointerSize]; toast("Gun pointer size " + SIZE_NAMES[state.gunPointerSize]); state.dirty = true; }),
  ]});
  categories.push({ name: "Visuals", mods: [
    mod("Menu Guide: Both / Pointer / Line / Off", () => { state.guideMode = (state.guideMode + 1) % 4; toast("Guide: " + ["Both", "Pointer only", "Line only", "Off"][state.guideMode]); state.dirty = true; }),
    mod("Guide Line Size: " + SIZE_NAMES[state.guideLineSize], () => { state.guideLineSize = (state.guideLineSize + 1) % SIZE_NAMES.length; categories[2].mods[1].label = "Guide Line Size: " + SIZE_NAMES[state.guideLineSize]; toast("Guide line size " + SIZE_NAMES[state.guideLineSize]); state.dirty = true; }),
    mod("Guide Pointer Size: " + SIZE_NAMES[state.guidePointerSize], () => { state.guidePointerSize = (state.guidePointerSize + 1) % SIZE_NAMES.length; categories[2].mods[2].label = "Guide Pointer Size: " + SIZE_NAMES[state.guidePointerSize]; toast("Guide pointer size " + SIZE_NAMES[state.guidePointerSize]); state.dirty = true; }),
    mod("Refresh Hand Detection", () => { leftHandTransform = null; rightHandTransform = null; transformScanAt = 0; toast("Controller transform rescan scheduled"); }),
  ]});
  categories.push({ name: "Settings", mods: [
    mod("Theme: " + THEMES[state.theme].name, () => { state.theme = (state.theme + 1) % THEMES.length; categories[3].mods[0].label = "Theme: " + THEMES[state.theme].name; toast("Theme: " + THEMES[state.theme].name); state.dirty = true; }),
    mod("Menu Hand: Left / Right", () => { state.menuHandRight = !state.menuHandRight; toast("Menu hand: " + (state.menuHandRight ? "Right" : "Left")); state.dirty = true; }),
    mod("Open Button: " + state.openButton, () => { const opts = ["L3", "Left X", "Left Y"]; state.openButton = opts[(opts.indexOf(state.openButton) + 1) % opts.length]; categories[3].mods[2].label = "Open Button: " + state.openButton; toast("Open button: " + state.openButton); state.dirty = true; }),
    mod("Menu Scale: " + menuScaleNames[menuScaleIndex], () => { menuScaleIndex = (menuScaleIndex + 1) % menuScaleValues.length; categories[3].mods[3].label = "Menu Scale: " + menuScaleNames[menuScaleIndex]; toast("Menu scale " + menuScaleNames[menuScaleIndex]); state.dirty = true; }),
  ]});
  categories.push({ name: "Credits", mods: [
    mod("Among Us VR prototype", () => toast("Menu prototype by eye + ChatGPT"), { tip: "Early port using the CDIH-style hand menu. Controller detection is runtime-discovered." }),
    mod("Private / test lobbies", () => toast("Use movement mods only where permitted"), { tip: "Teleport and speed features modify local movement; test privately first." }),
  ]});
  // ------------ menu geometry and rendering ------------
  function buildMenu() {
    destroyMenu();
    const th = THEMES[state.theme];
    const W = 0.36, H = 0.52;
    state.menuRoot = createPrimitive(null, [0, 0, 0], [1, 1, 1], null);
    state.menuRoot.method("set_name").invoke(Il2Cpp.string("eyeAmongUsVRMenu"));
    const root = tr(state.menuRoot);
    root.method("set_localScale").invoke([menuScaleValues[menuScaleIndex], menuScaleValues[menuScaleIndex], menuScaleValues[menuScaleIndex]]);
    createPrimitive(root, [0, 0, 0.004], [W, H, 0.004], th.bg);
    const canvasGO = createPrimitive(root, [0, 0, 0], [1, 1, 1], null);
    const canvas = addComp(canvasGO, CanvasK);
    canvas.method("set_renderMode").invoke(2);
    try { const scaler = addComp(canvasGO, CanvasScalerK); scaler.method("set_dynamicPixelsPerUnit").invoke(8); } catch (_) { }
    const ct = tr(canvasGO), rt = getComp(canvasGO, RectTransformK);
    rt.method("set_sizeDelta").invoke([W * 1000, H * 1000]);
    ct.method("set_localScale").invoke([0.001, 0.001, 0.001]);
    ct.method("set_localPosition").invoke([0, 0, 0]);
    state.canvasTransform = ct;
    const cat = state.category >= 0 ? categories[state.category] : null;
    const list = cat ? cat.mods : categories.map((c: any, i: number) => mod(c.name, () => { state.category = i; state.page = 0; state.dirty = true; }));
    const pages = Math.max(1, Math.ceil(list.length / 6));
    state.page = Math.min(state.page, pages - 1);
    makeText(ct, "eye's Among Us VR" + (cat ? " | " + cat.name : "") + (pages > 1 ? " [" + (state.page + 1) + "/" + pages + "]" : ""), th.text, 0, H / 2 - 0.035, W - 0.02, 0.05, 19);
    const rowH = 0.043, gap = 0.048, top = 0.165;
    list.slice(state.page * 6, state.page * 6 + 6).forEach((m: any, i: number) => {
      const y = top - i * gap;
      const label = m.label;
      const on = m.toggle ? !!state[m.toggle] : m.radio ? state.gunMode === m.radio : false;
      const box = createPrimitive(root, [0, y, -0.003], [W - 0.04, rowH, 0.006], on ? th.on : th.btn);
      makeText(ct, label, th.text, 0, y, W - 0.05, rowH, 17);
      state.menuItems.push({ mod: m, x: 0, y, w: W - 0.04, h: rowH, box, kind: "mod" });
    });
    const ny = -H / 2 + 0.065;
    for (const n of [{ label: "<", x: -0.115, w: 0.095, kind: "prev" }, { label: "Home", x: 0, w: 0.115, kind: "home" }, { label: ">", x: 0.115, w: 0.095, kind: "next" }]) {
      const box = createPrimitive(root, [n.x, ny, -0.003], [n.w, rowH, 0.006], th.btn);
      makeText(ct, n.label, th.text, n.x, ny, n.w, rowH, 18);
      state.menuItems.push({ mod: null, x: n.x, y: ny, w: n.w, h: rowH, box, kind: n.kind });
    }
    state.tooltip = makeText(ct, state.lastNow < state.lastToastUntil ? state.toast : "Aim at a row; press trigger", th.text, 0, -H / 2 + 0.022, W - 0.02, 0.03, 12);
    state.dirty = false;
    state.hover = -1;
  }
  function placeMenu() {
    if (!alive(state.menuRoot) || !alive(cameraTransform)) return;
    const anchor = anchorTransform(state.menuHandRight);
    if (!alive(anchor)) return;
    const ap = tPos(anchor), camP = tPos(cameraTransform);
    const right = tRight(anchor), up: V3 = [0, 1, 0];
    const p = vadd(vadd(vadd(ap, vmul(up, 0.22)), vmul(right, 0.11)), vmul(vnorm(vsub(camP, ap)), 0.08));
    const forward = vnorm(vsub(p, camP));
    const flat = vnorm([forward[0], 0, forward[2]]);
    const f = vnorm([flat[0] * 0.94 + forward[0] * 0.06, forward[1] * 0.25, flat[2] * 0.94 + forward[2] * 0.06]);
    const r = vnorm(vcross([0, 1, 0], f));
    const u = vcross(f, r);
    state.menuPos = p; state.basis = { r, u, f };
    const rt = tr(state.menuRoot);
    rt.method("set_position").invoke(p);
    rt.method("set_rotation").invoke(QuaternionK.method("LookRotation", 2).invoke(f, u));
  }
  function rayFrom(t: any): { o: V3; d: V3 } {
    if (alive(t)) return { o: tPos(t), d: tFwd(t) };
    if (alive(cameraTransform)) return { o: tPos(cameraTransform), d: tFwd(cameraTransform) };
    return { o: [0, 0, 0], d: [0, 0, 1] };
  }
  function rayPlanePoint(ray: { o: V3; d: V3 }): V3 {
    const denom = vdot(ray.d, state.basis.f);
    if (Math.abs(denom) < 0.0001) return vadd(ray.o, vmul(ray.d, 2));
    const dist = vdot(vsub(state.menuPos, ray.o), state.basis.f) / denom;
    return dist >= 0 && dist < 20 ? vadd(ray.o, vmul(ray.d, dist)) : vadd(ray.o, vmul(ray.d, 2));
  }
  function buttonAtPoint(point: V3): number {
    const rel = vsub(point, state.menuPos);
    const lx = vdot(rel, state.basis.r) / menuScaleValues[menuScaleIndex];
    const ly = vdot(rel, state.basis.u) / menuScaleValues[menuScaleIndex];
    const lz = vdot(rel, state.basis.f) / menuScaleValues[menuScaleIndex];
    if (lz < -0.06 || lz > 0.08) return -1;
    for (let i = 0; i < state.menuItems.length; i++) {
      const m = state.menuItems[i];
      if (Math.abs(lx - m.x) <= m.w / 2 && Math.abs(ly - m.y) <= m.h / 2) return i;
    }
    return -1;
  }
  function clickMenu() {
    const pointerRight = !state.menuHandRight;
    const pointerHand = anchorTransform(pointerRight);
    const ray = rayFrom(pointerHand);
    const hit = buttonAtPoint(rayPlanePoint(ray));
    if (hit !== state.hover) {
      state.hover = hit;
      const th = THEMES[state.theme];
      state.menuItems.forEach((m: any, i: number) => colorOf(m.box, i === hit ? th.hover : (m.mod && m.mod.toggle && state[m.mod.toggle] || m.mod && m.mod.radio && state.gunMode === m.mod.radio ? th.on : th.btn)));
      tooltip(hit >= 0 ? (state.menuItems[hit].mod?.tip || "Select option") : "Aim at a row; press trigger");
    }
    const click = pointerRight ? input.rt : input.lt;
    const prevClick = pointerRight ? input.previous.rt : input.previous.lt;
    if (click && !prevClick && hit >= 0 && state.lastNow - state.lastClick > 0.25) {
      state.lastClick = state.lastNow;
      const item = state.menuItems[hit];
      if (item.kind === "home") { state.category = -1; state.page = 0; state.dirty = true; }
      else if (item.kind === "prev") { state.page = Math.max(0, state.page - 1); state.dirty = true; }
      else if (item.kind === "next") { state.page = state.page + 1; state.dirty = true; }
      else if (item.mod) {
        try { item.mod.action(); refreshColors(); if (state.dirty) buildMenu(); } catch (e: any) { toast("Action error: " + e); }
      }
    }
  }

  // --------- Ray visuals + self teleport target ---------
  function ensureGunVisuals() {
    if (!alive(state.pointer)) {
      state.pointer = GameObjectK.method("CreatePrimitive", 1).invoke(0); // Sphere
      try { destroy(getComp(state.pointer, ColliderK)); } catch (_) { }
      try { const m = getComp(state.pointer, RendererK).method("get_material").invoke(); if (boxShader) m.method("set_shader").invoke(boxShader); } catch (_) { }
    }
    if (!alive(state.line)) {
      const go = GameObjectK.method("CreatePrimitive", 1).invoke(3); // Cube
      try { destroy(getComp(go, ColliderK)); } catch (_) { }
      const lr = addComp(go, LineRendererK);
      state.line = lr;
      try { lr.method("set_useWorldSpace").invoke(true); lr.method("set_positionCount").invoke(2); } catch (_) { }
      try { const m = lr.method("get_material").invoke(); if (boxShader) m.method("set_shader").invoke(boxShader); } catch (_) { }
    }
  }
  function drawRay(a: V3, b: V3, guide: boolean) {
    const mode = guide ? state.guideMode : state.guideMode;
    const lineOn = mode === 0 || mode === 2;
    const pointerOn = mode === 0 || mode === 1;
    if (!lineOn && !pointerOn) { hideRay(); return; }
    ensureGunVisuals();
    const th = THEMES[state.theme];
    try {
      state.pointer.method("SetActive").invoke(pointerOn);
      if (pointerOn) {
        setPos(tr(state.pointer), b);
        const ix = guide ? state.guidePointerSize : state.gunPointerSize;
        const size = 0.035 * SIZE_PRESETS[ix];
        tr(state.pointer).method("set_localScale").invoke([size, size, size]);
        getComp(state.pointer, RendererK).method("get_material").invoke().method("set_color").invoke(th.btn);
      }
    } catch (_) { }
    try {
      const go = state.line.method("get_gameObject").invoke(); go.method("SetActive").invoke(lineOn);
      if (lineOn) {
        state.line.method("SetPosition", 2).invoke(0, a); state.line.method("SetPosition", 2).invoke(1, b);
        const ix = guide ? state.guideLineSize : state.gunLineSize;
        const width = (guide ? 0.006 : 0.006) * SIZE_PRESETS[ix];
        state.line.method("set_startWidth").invoke(width); state.line.method("set_endWidth").invoke(width);
        state.line.method("get_material").invoke().method("set_color").invoke(th.bg);
      }
    } catch (_) { }
  }
  function hideRay() {
    try { if (alive(state.pointer)) state.pointer.method("SetActive").invoke(false); } catch (_) { }
    try { if (alive(state.line)) state.line.method("get_gameObject").invoke().method("SetActive").invoke(false); } catch (_) { }
  }
  function raycast(ray: { o: V3; d: V3 }): V3 | null {
    try {
      const methods = PhysicsK.methods.filter((m: any) => m.name === "Raycast");
      const method = methods.find((m: any) => m.parameterCount === 4 && String(m.parameters[0].type.name).includes("Vector3") && String(m.parameters[1].type.name).includes("Vector3") && String(m.parameters[2].type.name).includes("RaycastHit") && String(m.parameters[3].type.name).includes("Single"));
      if (!method) return null;
      const hit = Il2Cpp.alloc(0x30);
      for (let off = 0; off < 0x30; off += 8) hit.add(off).writeU64(0);
      const ok = method.invoke(ray.o, ray.d, hit, 35.0);
      if (!ok) return null;
      const point: V3 = [hit.readFloat(), hit.add(4).readFloat(), hit.add(8).readFloat()];
      if (point.some((n: number) => !isFinite(n))) return null;
      return point;
    } catch (_) { return null; }
  }
  function teleportRigTo(point: V3) {
    if (!alive(rigTransform)) { toast("Local rig not found; teleport skipped"); return; }
    try { setPos(rigTransform, point); toast("Teleported local rig to aim point"); } catch (e: any) { toast("Teleport failed: " + e); }
  }
  function warpForward(distance: number) {
    if (!alive(rigTransform) || !alive(cameraTransform)) return toast("Player rig/camera not found");
    const f = tFwd(cameraTransform), flat = vnorm([f[0], 0, f[2]]);
    setPos(rigTransform, vadd(tPos(rigTransform), vmul(flat, distance)));
    toast("Warped forward " + distance + "m");
  }

  // --------- main per-frame update ---------
  let lastFrame = -1;
  function tick() {
    let frame = -1, now = Date.now() / 1000, dt = 0.016;
    try { frame = Number(K("UnityEngine.Time").method("get_frameCount", 0).invoke()); now = Number(K("UnityEngine.Time").method("get_realtimeSinceStartup", 0).invoke()); dt = Number(K("UnityEngine.Time").method("get_deltaTime", 0).invoke()); } catch (_) { }
    if (frame >= 0 && frame === lastFrame) return;
    lastFrame = frame;
    state.lastNow = now;
    updateInput(now);
    refreshTransforms(now);
    if (!alive(cameraTransform)) return;

    const open = state.openButton === "L3" ? input.lClick : state.openButton === "Left X" ? input.ls : input.lp;
    const wasOpen = state.openButton === "L3" ? input.previous.lClick : state.openButton === "Left X" ? input.previous.ls : input.previous.lp;
    if (open && !wasOpen) {
      state.open = !state.open;
      if (!state.open) { destroyMenu(); toast("Menu closed"); }
      else { state.dirty = true; toast("Menu opened"); }
    }

    // Additive local movement only; no RPC or other-player writes.
    if ((state.speedBoost || state.fly) && alive(rigTransform)) {
      const x = Number(input.lAxis[0] || 0), z = Number(input.lAxis[1] || 0);
      const fwd = tFwd(cameraTransform), right = tRight(cameraTransform);
      const flatF = vnorm([fwd[0], 0, fwd[2]]), flatR = vnorm([right[0], 0, right[2]]);
      let delta = vadd(vmul(flatR, x), vmul(flatF, z));
      const mag = vlen(delta);
      if (mag > 1) delta = vmul(delta, 1 / mag);
      const speed = state.fly ? 2.4 : 1.8;
      delta = vmul(delta, speed * Math.min(0.05, Math.max(0, dt)));
      if (state.fly) delta[1] += Number(input.rAxis[1] || 0) * 1.8 * Math.min(0.05, Math.max(0, dt));
      if (Math.abs(x) > 0.08 || Math.abs(z) > 0.08 || (state.fly && Math.abs(Number(input.rAxis[1] || 0)) > 0.08)) setPos(rigTransform, vadd(tPos(rigTransform), delta));
    }

    if (state.open) {
      if (!alive(state.menuRoot) || state.dirty) buildMenu();
      placeMenu();
      clickMenu();
      if (state.guideMode !== 3) {
        const pointerHand = anchorTransform(!state.menuHandRight), ray = rayFrom(pointerHand);
        drawRay(ray.o, rayPlanePoint(ray), true);
      } else hideRay();
    } else if (state.gunMode) {
      const ray = rayFrom(anchorTransform(true));
      const hit = raycast(ray);
      drawRay(ray.o, hit || vadd(ray.o, vmul(ray.d, 12)), false);
      const firing = state.gunMode === "Teleport Gun" && input.rg && input.rt;
      if (firing && !state.gunWasFiring && hit) teleportRigTo(hit);
      state.gunWasFiring = firing;
    } else {
      state.gunWasFiring = false;
      hideRay();
    }
  }

  // --------- locate a likely per-frame game update hook automatically ---------
  const gameImage = (() => { try { return Il2Cpp.domain.assembly("Assembly-CSharp").image; } catch (_) { return null; } })();
  if (!gameImage) { log("Assembly-CSharp unavailable; cannot install frame hook"); return; }
  const updateCandidates: Array<{ klass: any; method: any; score: number }> = [];
  try {
    for (const c of gameImage.classes) {
      const cn = String(c.name || "");
      const m = safeMethod(c, "Update", 0);
      if (!m || m.isStatic) continue;
      const n = cn.toLowerCase();
      let score = 0;
      if (n.includes("vrplayer")) score += 20;
      if (n.includes("playercontroller")) score += 18;
      if (n.includes("playerlocomotion") || n.includes("playermovement")) score += 17;
      if (n.includes("player")) score += 9;
      if (n.includes("locomotion") || n.includes("movement")) score += 6;
      if (n.includes("xr") || n.includes("rig")) score += 5;
      if (n.includes("game manager") || n.includes("gamemanager")) score += 4;
      if (/network|remote|ghost|replay|spectator|tutorial/.test(n)) score -= 3;
      if (score > 0) updateCandidates.push({ klass: c, method: m, score });
    }
  } catch (e: any) { log("Update class scan failed: " + e); }
  updateCandidates.sort((a, b) => b.score - a.score);
  let hooked = false;
  for (const candidate of updateCandidates.slice(0, 5)) {
    try {
      const className = String(candidate.klass.name);
      candidate.method.implementation = function () {
        try { tick(); } catch (e: any) { log("tick error: " + e); }
        return this.method("Update").invoke();
      };
      log("frame hook installed: " + className + ".Update");
      hooked = true;
      break;
    } catch (e: any) { log("hook failed for " + candidate.klass.name + ": " + e); }
  }
  if (!hooked) {
    log("No likely player Update method found. Candidate Update classes: " + updateCandidates.slice(0, 12).map(x => String(x.klass.name)).join(", "));
    log("Menu not initialized; check dump for the correct per-frame class before testing.");
    return;
  }
  log("Loaded. L3 toggles the menu; trigger selects; Teleport Gun only moves your local rig. Private/test use recommended.");
}
