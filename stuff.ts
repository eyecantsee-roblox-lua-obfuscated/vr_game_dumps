// Frida IL2CPP mod menu for Stuff: Horror VR

declare const Il2Cpp: any;
declare const XRNode: any;

const version = "1.0.0";
let boardMaterial = null;
let buttonClickDelay = 0.0;
let menu: any = null;
let reference: any = null;
let referenceCollider: any = null;

let leftPrimary = false;
let leftSecondary = false;

let rightPrimary = false;
let rightSecondary = false;

let leftGrab = false;
let rightGrab = false;

let leftTrigger = false;
let rightTrigger = false;

let deltaTime = 0.0;
let time = 0.0;
let frameCount = 0;
let gunLockEnabled = false;

let buttonSound = 8;
let LerpMenu = false;
let menuscale = 0.75;

let previousGhostKey = false;
let perviousTeleportKey = false;

let walkPos = null;
let walkNormal = null;

let closePosition = null;
let tagGunDelay = 0.0;
let idGunDelay = 0.0;
let splashDelay = 0.0;

let lastTime = 0.0;

let leftPlatform: any = null;
let rightPlatform: any = null;

let checkpoint: any = null;
let positions = [];

let lineRenderHolder = null;
let isLineRenderQueued = false;
let linePool = [];

let buttonNotifications: boolean = true;
let enabledRecent: boolean = false;

let espCollide = false;

let bgColor: [number, number, number, number] = [0.1, 0.5, 0.9, 1.0];
let textColor: [number, number, number, number] = [1.0, 1.0, 1.0, 1.0];
let buttonColor: [number, number, number, number] = [0.06, 0.3, 0.54, 1.0];
let buttonPressedColor: [number, number, number, number] = [0.03, 0.15, 0.27, 1.0];

let menuName: string = "Eye's <b>Stuff: Horror</b> Menu";
let themeIndex = 0;
let buttonIndex = 0;
let favoriteColor = 2;

let currentNotification: string = "";
let notifactionResetTime: number = 0;

let currentCategory = 0;
let currentPage = 0;

let righthand = false;

let spawnItems: string[] = [];
let spawnIndex = 0;

const nameList = [
    "Modder", "Stuff Menu", "xX_G0D_Xx", "ImWatchingYou", "Error404",
    "NPC", "TheHacker", "Ghost", "Invisible", "Admin",
    "YourDad", "CoolGuy69", "Toilet", "BanMe", "NotACheater",
    "Sussy", "BigBoss", "NoName", "???", "AAAAAAAA",
    "RIP", "Hacked", "SendHelp", "ByeBye", "Fart Lord"
];
let nameIndex = 0;

Il2Cpp.perform(() => {
    // XR Input Handler
    const XRInputDevices = Il2Cpp.domain.assembly("UnityEngine.XRModule").image.class("UnityEngine.XR.InputDevices");
    const tryGetFeatureValueBool = XRInputDevices.method("TryGetFeatureValue_bool", 3);
    const xrButtonStates = new Map<string, boolean>();

    function xrUpdate() {
        const features = ["PrimaryButton", "SecondaryButton", "GripButton", "TriggerButton"];
        for (const cid of [1, 2]) {
            for (const f of features) {
                const key = `${cid}_${f}`;
                try {
                    const valuePtr = Il2Cpp.alloc(1);
                    // @ts-ignore
                    const success = tryGetFeatureValueBool.invoke(uint64(cid), Il2Cpp.string(f), valuePtr);
                    xrButtonStates.set(key, success ? valuePtr.readU8() !== 0 : false);
                } catch (_) {
                    xrButtonStates.set(key, false);
                }
            }
        }
    }

    function xrButton(controllerId: number, feature: string): boolean {
        return xrButtonStates.get(`${controllerId}_${feature}`) || false;
    }
    const images = {
        "Assembly-CSharp": Il2Cpp.domain.assembly("Assembly-CSharp").image,
        "UnityEngine.CoreModule": Il2Cpp.domain.assembly("UnityEngine.CoreModule").image,
        "UnityEngine.PhysicsModule": Il2Cpp.domain.assembly("UnityEngine.PhysicsModule").image,
        "UnityEngine.UIModule": Il2Cpp.domain.assembly("UnityEngine.UIModule").image,
        "UnityEngine.UI": Il2Cpp.domain.assembly("UnityEngine.UI").image,
        "UnityEngine.TextRenderingModule": Il2Cpp.domain.assembly("UnityEngine.TextRenderingModule").image,
        "PhotonUnityNetworking": Il2Cpp.domain.assembly("PhotonUnityNetworking").image,
        "Unity.TextMeshPro": Il2Cpp.domain.assembly("Unity.TextMeshPro").image,
        "Oculus.VR": Il2Cpp.domain.assembly("Oculus.VR").image,
    };

    const AssemblyCSharp = images["Assembly-CSharp"];
    const UnityEngineCore = images["UnityEngine.CoreModule"];
    const UnityEnginePhysics = images["UnityEngine.PhysicsModule"];
    const UnityEngineUI = images["UnityEngine.UI"];
    const UnityEngineUIModule = images["UnityEngine.UIModule"];
    const UnityEngineTextRendering = images["UnityEngine.TextRenderingModule"];
    const PhotonUnityNetworking = images["PhotonUnityNetworking"];
    const UnityTextMeshPro = images["Unity.TextMeshPro"];

    // Game classes
    const PlayerVrClass = AssemblyCSharp.class("GorillaLocomotion.PlayerVr");
    let ClientGameManagerClass: any = null;
    let ClientPlayerClass: any = null;
    let DethPlayerManagerClass: any = null;
    let LocalGameManagerClass: any = null;
    let BannerLink: any = null;

    try {
        ClientGameManagerClass = AssemblyCSharp.class("ClientGameManager");
        ClientPlayerClass = AssemblyCSharp.class("ClientPlayer");
        DethPlayerManagerClass = AssemblyCSharp.class("DethPlayerManager");
        LocalGameManagerClass = AssemblyCSharp.class("LocalGameManager");
        BannerLink = AssemblyCSharp.class("BannerLink");
    } catch(e: any) {
        console.log("[!] Some game classes not found: " + e.message);
    }

    const PhotonNetwork = PhotonUnityNetworking.class("Photon.Pun.PhotonNetwork");
    const OVRInputClass = images["Oculus.VR"].class("OVRInput");

    // Unity classes
    const GameObject = UnityEngineCore.class("UnityEngine.GameObject");
    const Object = UnityEngineCore.class("UnityEngine.Object");
    const SystemObject = Il2Cpp.corlib.class("System.Object");
    const Vector3 = UnityEngineCore.class("UnityEngine.Vector3");
    const Quaternion = UnityEngineCore.class("UnityEngine.Quaternion");
    const Time = UnityEngineCore.class("UnityEngine.Time");
    const Resources = UnityEngineCore.class("UnityEngine.Resources");
    const Material = UnityEngineCore.class("UnityEngine.Material");
    const Renderer = UnityEngineCore.class("UnityEngine.Renderer");
    const Shader = UnityEngineCore.class("UnityEngine.Shader");
    const Color = UnityEngineCore.class("UnityEngine.Color");
    const RectTransform = UnityEngineCore.class("UnityEngine.RectTransform");
    const LineRenderer = UnityEngineCore.class("UnityEngine.LineRenderer");
    const PlayerPrefs = UnityEngineCore.class("UnityEngine.PlayerPrefs");
    const InputDeviceClass = Il2Cpp.domain.assembly("UnityEngine.XRModule")?.image?.class("UnityEngine.XR.InputDevice") ??
                             Il2Cpp.domain.assembly("Unity.XR.Management")?.image?.class("UnityEngine.XR.InputDevice") ??
                             null;

    const MeshCollider = UnityEnginePhysics.class("UnityEngine.MeshCollider");
    const BoxCollider = UnityEnginePhysics.class("UnityEngine.BoxCollider");
    const SphereCollider = UnityEnginePhysics.class("UnityEngine.SphereCollider");
    const CapsuleCollider = UnityEnginePhysics.class("UnityEngine.CapsuleCollider");
    const Collider = UnityEnginePhysics.class("UnityEngine.Collider");
    const Rigidbody = UnityEnginePhysics.class("UnityEngine.Rigidbody");
    const Physics = UnityEnginePhysics.class("UnityEngine.Physics");
    const RaycastHit = UnityEnginePhysics.class("UnityEngine.RaycastHit");

    const Canvas = UnityEngineUIModule.class("UnityEngine.Canvas");
    const CanvasScaler = UnityEngineUI.class("UnityEngine.UI.CanvasScaler");
    const GraphicRaycaster = UnityEngineUI.class("UnityEngine.UI.GraphicRaycaster");
    const Text = UnityEngineUI.class("UnityEngine.UI.Text");
    const Font = UnityEngineTextRendering.class("UnityEngine.Font");

    const TextMeshPro = UnityTextMeshPro.class("TMPro.TextMeshPro");

    // Singletons and instances
    const PlayerVr = PlayerVrClass.method("get_Instance").invoke();
    console.log("[Init] PlayerVr: " + (PlayerVr ? "found" : "null"));
    
    const playerRB = PlayerVr.field("playerRigidBody").value;
    const headCollider = PlayerVr.field("headCollider").value;
    const bodyCollider = PlayerVr.field("bodyCollider").value;

    // Use XRBaseController transforms (actual VR controllers) instead of in-game hand transforms
    let leftXRController = PlayerVr.field("leftController").value;
    let rightXRController = PlayerVr.field("rightController").value;
    let leftHandTransform = getTransform(leftXRController);
    let rightHandTransform = getTransform(rightXRController);

    // Keep the game hand transforms for mods that need them
    let leftGameHand = PlayerVr.field("leftHandTransform").value;
    let rightGameHand = PlayerVr.field("rightHandTransform").value;

    function refreshTransforms() {
        try {
            leftXRController = PlayerVr.field("leftController").value;
            rightXRController = PlayerVr.field("rightController").value;
            leftHandTransform = getTransform(leftXRController);
            rightHandTransform = getTransform(rightXRController);
            leftGameHand = PlayerVr.field("leftHandTransform").value;
            rightGameHand = PlayerVr.field("rightHandTransform").value;
        } catch(_) {}
    }

    console.log("[Init] leftXRController: " + (leftXRController ? "found" : "null"));
    console.log("[Init] rightXRController: " + (rightXRController ? "found" : "null"));

    // Spawn items scanned lazily in update loop
    let spawnItemsScanned = false;
    const ItemManagerClass = AssemblyCSharp.class("ItemManager");
    const ShamcerManagerClass = AssemblyCSharp.class("ShamcerManager");
    const RocketLauncherManagerClass = AssemblyCSharp.class("RocketLauncherManager");
    const GloveGunManagerClass = AssemblyCSharp.class("GloveGunManager");

    let cachedGuns: any = null;
    let cachedRockets: any = null;
    let cachedGloves: any = null;
    let weaponCacheFrame = -999;

    function refreshWeaponCache() {
        if (frameCount - weaponCacheFrame < 30) return;
        weaponCacheFrame = frameCount;
        try { cachedGuns = Object.method("FindObjectsOfType", 0).inflate(ShamcerManagerClass).invoke(); } catch(_) { cachedGuns = null; }
        try { cachedRockets = Object.method("FindObjectsOfType", 0).inflate(RocketLauncherManagerClass).invoke(); } catch(_) { cachedRockets = null; }
        try { cachedGloves = Object.method("FindObjectsOfType", 0).inflate(GloveGunManagerClass).invoke(); } catch(_) { cachedGloves = null; }
    }

    function getAllGuns() { refreshWeaponCache(); return cachedGuns; }
    function getAllRockets() { refreshWeaponCache(); return cachedRockets; }
    function getAllGloveGuns() { refreshWeaponCache(); return cachedGloves; }

    function scanSpawnItems() {
        if (spawnItemsScanned) return;
        console.log("[Spawn] Scanning...");

        // Method 1: Read Photon DefaultPool.ResourceCache keys — these are the exact names for PhotonNetwork.Instantiate
        try {
            const PunAssembly = Il2Cpp.domain.assembly("PhotonUnityNetworking").image;
            const DefaultPoolClass = PunAssembly.class("Photon.Pun.DefaultPool");
            const PhotonNetworkClass = PunAssembly.class("Photon.Pun.PhotonNetwork");
            const pool = PhotonNetworkClass.field("prefabPool").value;
            console.log("[Spawn] prefabPool field: " + (pool && !pool.isNull() ? "found" : "null"));
            if (pool && !pool.isNull()) {
                const cache = pool.field("ResourceCache").value;
                console.log("[Spawn] ResourceCache: " + (cache && !cache.isNull() ? "found" : "null"));
                if (cache && !cache.isNull()) {
                    const count = cache.method("get_Count").invoke();
                    console.log("[Spawn] ResourceCache count: " + count);
                    const keys = cache.method("get_Keys").invoke();
                    const enumerator = keys.method("GetEnumerator").invoke();
                    while (enumerator.method("MoveNext").invoke()) {
                        const key = enumerator.method("get_Current").invoke();
                        const name = key.content || key.toString();
                        if (name && name.length > 0 && !spawnItems.includes(name) && !name.toLowerCase().includes("player")) {
                            spawnItems.push(name);
                            console.log("[Spawn] Pool key: " + name);
                        }
                    }
                }
            }
        } catch(e: any) { console.log("[Spawn] Pool scan failed: " + e.message); }

        // Method 2: Resources.LoadAll to find all GameObjects, register them into the pool
        try {
            const Resources = Il2Cpp.domain.assembly("UnityEngine.CoreModule").image.class("UnityEngine.Resources");
            const allRes = Resources.method("LoadAll", 1).invoke(Il2Cpp.string(""));
            if (allRes && !allRes.isNull()) {
                console.log("[Spawn] Resources.LoadAll count: " + allRes.length);
                const PunAssembly = Il2Cpp.domain.assembly("PhotonUnityNetworking").image;
                const PhotonNetworkClass = PunAssembly.class("Photon.Pun.PhotonNetwork");
                const pool = PhotonNetworkClass.field("prefabPool").value;
                const cache = pool ? pool.field("ResourceCache").value : null;
                for (let i = 0; i < allRes.length; i++) {
                    try {
                        const res = allRes.get(i);
                        if (!res || res.isNull()) continue;
                        const nameObj = res.method("get_name").invoke();
                        const name = nameObj ? (nameObj.content || nameObj.toString()) : "";
                        if (!name || name.length === 0 || name.toLowerCase().includes("player")) continue;
                        // Check if it's a GameObject
                        const go = res.method("get_gameObject")?.invoke();
                        if (!go || go.isNull()) continue;
                        if (!spawnItems.includes(name)) {
                            // Register it in the pool cache so PhotonNetwork.Instantiate can find it
                            if (cache && !cache.isNull()) {
                                try { cache.method("set_Item").invoke(Il2Cpp.string(name), go); } catch(_) {}
                            }
                            spawnItems.push(name);
                            console.log("[Spawn] Resource: " + name);
                        }
                    } catch(_) {}
                }
            }
        } catch(e: any) { console.log("[Spawn] Resources scan failed: " + e.message); }

        // Method 3: Try known effect/extra prefabs and register into pool
        try {
            const Resources = Il2Cpp.domain.assembly("UnityEngine.CoreModule").image.class("UnityEngine.Resources");
            const PunAssembly = Il2Cpp.domain.assembly("PhotonUnityNetworking").image;
            const pool = PunAssembly.class("Photon.Pun.PhotonNetwork").field("prefabPool").value;
            const cache = pool ? pool.field("ResourceCache").value : null;
            const extraPrefabs = [
                "PoopExplosionEffect", "Items/PoopExplosionEffect",
                "ExplosionEffect", "Items/ExplosionEffect",
                "SmogEffect", "Items/SmogEffect",
                "FlashEffect", "Items/FlashEffect",
                "FireEffect", "Items/FireEffect",
                "LightningEffect", "Items/LightningEffect",
                "BulletEffect", "Items/BulletEffect",
                "Items/Tommy gun", "Items/Sniper rifle", "Items/Speed Shotgun",
                "Items/Machine gun", "Items/GloveGun", "Items/Grenade",
                "Items/RocketLauncher", "Items/DaBabyCar",
                "Items/Mine", "Items/SmogGrenade",
                "Entityes/Seraphim", "Entityes/Homer",
                "Entityes/BloodMonster", "Entityes/CreatureMob",
            ];
            for (const name of extraPrefabs) {
                if (spawnItems.includes(name)) continue;
                try {
                    const loaded = Resources.method("Load", 1).invoke(Il2Cpp.string(name));
                    if (loaded && !loaded.isNull()) {
                        if (cache && !cache.isNull()) {
                            try { cache.method("set_Item").invoke(Il2Cpp.string(name), loaded); } catch(_) {}
                        }
                        spawnItems.push(name);
                        console.log("[Spawn] Extra prefab found: " + name);
                    }
                } catch(_) {}
            }
        } catch(e: any) { console.log("[Spawn] Extra prefab scan failed: " + e.message); }

        console.log("[Spawn] Total found: " + spawnItems.length);
        if (spawnItems.length > 0) {
            spawnItemsScanned = true;
            console.log("[Spawn] Items: " + spawnItems.join(", "));
        }
    }

    // Gun hand = opposite of menu hand
    function gunHandTransform() { return righthand ? leftHandTransform : rightHandTransform; }
    function gunGrab() { return righthand ? leftGrab : rightGrab; }
    function gunTrigger() { return righthand ? leftTrigger : rightTrigger; }

    // ClientGameManager — accessed via ClientPlayer
    let clientGameManager: any = null;
    let localGameManager: any = null;
    let deathManager: any = null;

    function getClientGameManager() {
        if (!ClientGameManagerClass || !LocalGameManagerClass) return null;
        if (clientGameManager && !(clientGameManager.isNull?.() ?? true)) return clientGameManager;
        try {
            const lgm = getLocalGameManager();
            if (lgm) {
                clientGameManager = lgm.method("get_clientGameManager").invoke();
                return clientGameManager;
            }
        } catch(_) {}
        return null;
    }

    function getLocalGameManager() {
        if (!LocalGameManagerClass) return null;
        if (localGameManager && !(localGameManager.isNull?.() ?? true)) return localGameManager;
        try {
            const obj = GameObject.method("Find", 1).invoke(Il2Cpp.string("LocalGameManager"));
            if (obj && !obj.isNull()) {
                localGameManager = getComponent(obj, LocalGameManagerClass);
                return localGameManager;
            }
        } catch(_) {}
        return null;
    }

    function getDeathManager() {
        if (!ClientGameManagerClass) return null;
        if (deathManager && !(deathManager.isNull?.() ?? true)) return deathManager;
        try {
            const cgm = getClientGameManager();
            if (cgm) {
                deathManager = cgm.field("death").value;
                return deathManager;
            }
        } catch(_) {}
        return null;
    }

    const TextShader = Shader.method("Find").invoke(Il2Cpp.string("GUI/Text Shader"));
    const UberShader = Shader.method("Find").invoke(Il2Cpp.string("Standard")) ?? TextShader;

    const zeroVector = Vector3.field("zeroVector").value;
    const oneVector = Vector3.field("oneVector").value;
    const identityQuaternion = Quaternion.field("identityQuaternion").value;

    const arial = Resources
        .method("GetBuiltinResource", 1)
        .inflate(Font)
        .invoke(Il2Cpp.string("Arial.ttf"));

    // XR Input reading
    function readXRButton(device: any, usage: string): boolean {
        try {
            const buf = Il2Cpp.alloc(4);
            const result = device.method("TryGetFeatureValue").overload(
                "UnityEngine.XR.InputFeatureUsage`1<System.Boolean>",
                "System.Boolean&"
            ).invoke(Il2Cpp.string(usage), buf);
            if (result) return buf.readU8() !== 0;
        } catch(_) {}
        return false;
    }

    function readXRFloat(device: any, usage: string): number {
        try {
            const buf = Il2Cpp.alloc(4);
            const result = device.method("TryGetFeatureValue").overload(
                "UnityEngine.XR.InputFeatureUsage`1<System.Single>",
                "System.Single&"
            ).invoke(Il2Cpp.string(usage), buf);
            if (result) return buf.readFloat();
        } catch(_) {}
        return 0.0;
    }

    // Fallback input reading using common usage names
    function readXRButtonFallback(device: any): { primary: boolean, secondary: boolean } {
        const result = { primary: false, secondary: false };
        if (!device) return result;
        
        const commonNames = [
            { name: "primaryButton", field: "primary" },
            { name: "secondaryButton", field: "secondary" },
            { name: "PrimaryButton", field: "primary" },
            { name: "SecondaryButton", field: "secondary" },
            { name: "primary2DAxisClick", field: "primary" },
            { name: "secondary2DAxisClick", field: "secondary" },
        ];
        
        for (const usage of commonNames) {
            try {
                const val = readXRButton(device, usage.name);
                if (val) result[usage.field as keyof typeof result] = true;
            } catch(_) {}
        }
        
        return result;
    }

    function readXRFloatFallback(device: any): { grip: number, trigger: number } {
        const result = { grip: 0.0, trigger: 0.0 };
        if (!device) return result;
        
        const commonNames = [
            { name: "grip", field: "grip" },
            { name: "trigger", field: "trigger" },
            { name: "Grip", field: "grip" },
            { name: "Trigger", field: "trigger" },
            { name: "squeeze", field: "grip" },
            { name: "indexTrigger", field: "trigger" },
        ];
        
        for (const usage of commonNames) {
            try {
                const val = readXRFloat(device, usage.name);
                if (val > result[usage.field as keyof typeof result]) result[usage.field as keyof typeof result] = val;
            } catch(_) {}
        }
        
        return result;
    }

    // Utility functions
    function Destroy(object: any) {
        Object.method("Destroy", 1).invoke(object);
    }

    function getComponent(obj: any, type: any) {
        return obj.method("GetComponent", 1).inflate(type).invoke();
    }

    function getComponentInParent(obj: any, type: any) {
        return obj.method("GetComponentInParent", 0).inflate(type).invoke();
    }

    function addComponent(obj: any, type: any) {
        return obj.method("AddComponent", 1).inflate(type).invoke();
    }

    function getOrAddComponent(obj: any, type: any) {
        let returnType = getComponent(obj, type);
        if (returnType != null && returnType != undefined) {
            return returnType;
        }
        return addComponent(obj, type);
    }

    function getObject(obj: any) {
        return GameObject.method("Find", 1).invoke(Il2Cpp.string(obj));
    }

    function getTransform(obj: any) {
        return obj.method("get_transform").invoke();
    }

    function readVec3Components(vec: any): [number, number, number] {
        return [
            (vec.field("x").value as number) || 0,
            (vec.field("y").value as number) || 0,
            (vec.field("z").value as number) || 0
        ];
    }

    function teleportPlayer(position: any) {
        getTransform(PlayerVr).method("set_position").invoke(position);
        playerRB.method("set_velocity").invoke(zeroVector);
    }

    function sendAllOutgoing() {
        try {
            PhotonNetwork.method("SendAllOutgoingCommands").invoke();
        } catch(_) {}
    }

    function serialize() {
        try {
            PhotonNetwork.method("RunViewUpdate").invoke();
        } catch(_) {}
    }

    function getClientPlayers(): any[] {
        if (!LocalGameManagerClass) return [];
        const players: any[] = [];
        try {
            const lgm = getLocalGameManager();
            if (!lgm) return players;
            const list = lgm.field("clientPlayers").value;
            if (!list || list.isNull()) return players;
            const count = list.method("get_Count").invoke();
            for (let i = 0; i < count; i++) {
                const p = list.method("get_Item").invoke(i);
                if (p && !p.isNull()) players.push(p);
            }
        } catch(_) {}
        return players;
    }

    function isLocalPlayer(clientPlayer: any): boolean {
        if (!ClientPlayerClass) return false;
        try {
            const pv = clientPlayer.field("pv").value;
            if (pv && !pv.isNull()) return pv.method("get_IsMine").invoke();
        } catch(_) {}
        return false;
    }

    // Menu rendering
    function renderMenuText(
        canvasObject: any,
        text: string = "",
        color: [number, number, number, number] = [1, 1, 1, 1],
        pos = zeroVector,
        size = oneVector
    ) {
        const title = addComponent(createObject(zeroVector, identityQuaternion, oneVector, 3, [0, 0, 0, 0], getTransform(canvasObject)), Text);
        title.method("set_text").invoke(Il2Cpp.string(text));
        title.method("set_font").invoke(arial);
        title.method("set_fontSize").invoke(1);
        title.method("set_color").invoke(color);
        title.method("set_fontStyle").invoke(2);
        title.method("set_alignment").invoke(4);
        title.method("set_resizeTextForBestFit").invoke(true);
        title.method("set_resizeTextMinSize").invoke(0);

        const rectTransform = getComponent(title, RectTransform);
        rectTransform.method("set_sizeDelta").invoke(size);
        rectTransform.method("set_position").invoke(pos);
        rectTransform.method("set_rotation").invoke(Quaternion.method("Euler").invoke(180.0, 90.0, 90.0));
    }

    function createObject(
        pos = zeroVector,
        rot = identityQuaternion,
        scale = oneVector,
        primitiveType: number = 3,
        colorArr: [number, number, number, number] = [1, 1, 1, 1],
        parent = null,
        enableCollider: boolean = false
    ) {
        const obj = GameObject.method("CreatePrimitive").invoke(primitiveType);

        const renderer = getComponent(obj, Renderer);

        if (colorArr[3] == 0) {
            renderer.method("set_enabled").invoke(false);
        } else {
            const material = renderer.method("get_material").invoke();
            material.method("set_shader").invoke(UberShader);
            material.method("set_color").invoke(colorArr);
        }

        const col = getComponent(obj, Collider);
        if (col && !col.isNull()) {
            if (enableCollider) {
                col.method("set_enabled").invoke(true);
                col.method("set_isTrigger").invoke(true);
            } else {
                col.method("set_isTrigger").invoke(true);
            }
        }

        const transform = getTransform(obj);
        if (parent != null) {
            transform.method("SetParent", 2).invoke(parent, false);
        }

        transform.method("set_position").invoke(pos);
        transform.method("set_rotation").invoke(rot);
        transform.method("set_localScale").invoke(scale);

        return obj;
    }

    function sendNotification(NotificationText: string = "", requiresReload: boolean = true, clearTime: number = 5) {
        const isOld = (currentNotification == NotificationText);
        notifactionResetTime = time + clearTime;
        currentNotification = NotificationText;
        if (requiresReload && !isOld)
            reloadMenu();
    }

    function updateButtonColor(obj: any, buttonData: any) {
        const renderer = getComponent(obj, Renderer);
        const material = renderer.method("get_material").invoke();
        material.method("set_shader").invoke(TextShader);
        if (buttonData.enabled) {
            material.method("set_color").invoke(buttonPressedColor);
        } else {
            material.method("set_color").invoke(buttonColor);
        }
    }

    function playButtonSound() {
        try {
            // Haptic feedback via controller if available
        } catch(_) {}
    }

    class ButtonInfo {
        buttonText: string;
        method: (() => void) | null;
        disableMethod: (() => void) | null;
        enableMethod: (() => void) | null;
        isTogglable: boolean;
        enabled: boolean;
        toolTip: string;

        constructor(data: any) {
            this.buttonText = data.buttonText || "";
            this.method = data.method || null;
            this.disableMethod = data.disableMethod || null;
            this.enableMethod = data.enableMethod || null;
            this.isTogglable = data.isTogglable !== undefined ? data.isTogglable : true;
            this.enabled = data.enabled || false;
            this.toolTip = data.toolTip || "";
        }
    }

    const buttons: ButtonInfo[][] = [
        [ // Main Menu [0]
            new ButtonInfo({
                buttonText: "Movement Mods",
                method: () => { currentCategory = 1; currentPage = 0; reloadMenu(); },
                isTogglable: false,
                toolTip: "Opens the movement mods category."
            }),
            new ButtonInfo({
                buttonText: "Combat Mods",
                method: () => { currentCategory = 2; currentPage = 0; reloadMenu(); },
                isTogglable: false,
                toolTip: "Opens the combat mods category."
            }),
            new ButtonInfo({
                buttonText: "Player Mods",
                method: () => { currentCategory = 3; currentPage = 0; reloadMenu(); },
                isTogglable: false,
                toolTip: "Opens the player mods category."
            }),
            new ButtonInfo({
                buttonText: "Fun Mods",
                method: () => { currentCategory = 4; currentPage = 0; reloadMenu(); },
                isTogglable: false,
                toolTip: "Opens the fun mods category."
            }),
            new ButtonInfo({
                buttonText: "Settings",
                method: () => { currentCategory = 5; currentPage = 0; reloadMenu(); },
                isTogglable: false,
                toolTip: "Opens the settings category."
            }),
            new ButtonInfo({
                buttonText: "Favorite Mods",
                method: () => { currentCategory = 6; currentPage = 0; reloadMenu(); },
                isTogglable: false,
                toolTip: "Opens favorites."
            }),
            new ButtonInfo({
                buttonText: "Enabled Mods",
                method: () => { enabledRecent = false; currentCategory = 7; currentPage = 0; reloadMenu(); },
                isTogglable: false,
                toolTip: "Opens enabled mods."
            }),
        ],

        [ // Movement Mods [1]
            new ButtonInfo({
                buttonText: "Exit Movement Mods",
                method: () => { currentCategory = 0; currentPage = 0; },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
            new ButtonInfo({
                buttonText: "Medium Speed Boost",
                method: () => {
                    PlayerVr.field("MaxSpeed").value = 13.0;
                    PlayerVr.field("jumpMultiplier").value = 2.2;
                },
                disableMethod: () => {
                    PlayerVr.field("MaxSpeed").value = 6.5;
                    PlayerVr.field("jumpMultiplier").value = 1.1;
                },
                isTogglable: true,
                toolTip: "Increases your movement speed and jump power."
            }),
            new ButtonInfo({
                buttonText: "Fast Speed Boost",
                method: () => {
                    PlayerVr.field("MaxSpeed").value = 20.0;
                    PlayerVr.field("jumpMultiplier").value = 3.0;
                },
                disableMethod: () => {
                    PlayerVr.field("MaxSpeed").value = 6.5;
                    PlayerVr.field("jumpMultiplier").value = 1.1;
                },
                isTogglable: true,
                toolTip: "Increases your movement speed and jump power."
            }),
            new ButtonInfo({
                buttonText: "Super Fast Speed Boost",
                method: () => {
                    PlayerVr.field("MaxSpeed").value = 40.0;
                    PlayerVr.field("jumpMultiplier").value = 6.0;
                },
                disableMethod: () => {
                    PlayerVr.field("MaxSpeed").value = 6.5;
                    PlayerVr.field("jumpMultiplier").value = 1.1;
                },
                isTogglable: true,
                toolTip: "Increases your movement speed and jump power."
            }),
            new ButtonInfo({
                buttonText: "No Clip",
                method: () => {
                    if (rightTrigger) {
                        const headTransform = getTransform(headCollider);
                        const forward = headTransform.method("get_forward").invoke();
                        const speed = Vector3.method("op_Multiply", 2).invoke(forward, deltaTime * 8.0);
                        const pos = getTransform(PlayerVr).method("get_position").invoke();
                        const newPos = Vector3.method("op_Addition", 2).invoke(pos, speed);
                        teleportPlayer(newPos);
                    }
                },
                isTogglable: true,
                toolTip: "Fly through walls while holding trigger."
            }),
            new ButtonInfo({
                buttonText: "Fly",
                method: () => {
                    if (rightTrigger) {
                        const headTransform = getTransform(headCollider);
                        const forward = headTransform.method("get_forward").invoke();
                        const vel = Vector3.method("op_Multiply", 2).invoke(forward, 10.0);
                        playerRB.method("set_velocity").invoke(vel);
                    }
                    if (leftTrigger) {
                        playerRB.method("set_velocity").invoke(zeroVector);
                    }
                },
                isTogglable: true,
                toolTip: "Right trigger to fly forward, left trigger to stop."
            }),
            new ButtonInfo({
                buttonText: "Low Gravity",
                method: () => {
                    playerRB.method("set_useGravity").invoke(false);
                    const vel = playerRB.method("get_velocity").invoke();
                    const dampened = Vector3.method("op_Multiply", 2).invoke(vel, 0.98);
                    playerRB.method("set_velocity").invoke(dampened);
                },
                disableMethod: () => {
                    playerRB.method("set_useGravity").invoke(true);
                },
                isTogglable: true,
                toolTip: "Makes gravity very low."
            }),
            new ButtonInfo({
                buttonText: "Freeze",
                method: () => {
                    playerRB.method("set_velocity").invoke(zeroVector);
                    playerRB.method("set_isKinematic").invoke(true);
                },
                disableMethod: () => {
                    playerRB.method("set_isKinematic").invoke(false);
                },
                isTogglable: true,
                toolTip: "Freezes you in place."
            }),
            new ButtonInfo({
                buttonText: "Teleport Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const gunPointer = gunData.gunPointer;

                        if (gunTrigger() && !perviousTeleportKey) {
                            teleportPlayer(getTransform(gunPointer).method("get_position").invoke());
                        }

                        perviousTeleportKey = gunTrigger();
                    }
                },
                isTogglable: true,
                toolTip: "Grip to aim, trigger to teleport."
            }),
            new ButtonInfo({
                buttonText: "Platforms",
                method: () => {
                    if (leftGrab) {
                        if (leftPlatform == null) {
                            const position = leftHandTransform.method("get_position").invoke();
                            leftPlatform = createObject(position, identityQuaternion, [0.35, 0.35, 0.01], 3, bgColor);
                        }
                    } else {
                        if (leftPlatform != null) {
                            Destroy(leftPlatform);
                            leftPlatform = null;
                        }
                    }
                    if (rightGrab) {
                        if (rightPlatform == null) {
                            const position = rightHandTransform.method("get_position").invoke();
                            rightPlatform = createObject(position, identityQuaternion, [0.35, 0.35, 0.01], 3, bgColor);
                        }
                    } else {
                        if (rightPlatform != null) {
                            Destroy(rightPlatform);
                            rightPlatform = null;
                        }
                    }
                },
                disableMethod: () => {
                    if (leftPlatform != null) { Destroy(leftPlatform); leftPlatform = null; }
                    if (rightPlatform != null) { Destroy(rightPlatform); rightPlatform = null; }
                },
                isTogglable: true,
                toolTip: "Spawns platforms when pressing grip."
            }),
            new ButtonInfo({
                buttonText: "Checkpoint",
                method: () => {
                    if (rightGrab && !rightPrimary) {
                        if (checkpoint == null) {
                            checkpoint = createObject(zeroVector, identityQuaternion, [0.1, 0.1, 0.1], 0, bgColor);
                        }
                        getTransform(checkpoint).method("set_position").invoke(rightHandTransform.method("get_position").invoke());
                    }
                    if (rightPrimary && checkpoint != null) {
                        teleportPlayer(getTransform(checkpoint).method("get_position").invoke());
                    }
                },
                disableMethod: () => {
                    if (checkpoint != null) { Destroy(checkpoint); checkpoint = null; }
                },
                isTogglable: true,
                toolTip: "Place a checkpoint with grip and teleport to it with A."
            }),
            new ButtonInfo({
                buttonText: "Disable Movement",
                method: () => {
                    PlayerVr.field("disableMovement").value = true;
                },
                disableMethod: () => {
                    PlayerVr.field("disableMovement").value = false;
                },
                isTogglable: true,
                toolTip: "Disables gorilla locomotion movement."
            }),
        ],

        [ // Combat Mods [2]
            new ButtonInfo({
                buttonText: "Exit Combat Mods",
                method: () => { currentCategory = 0; currentPage = 0; },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
            new ButtonInfo({
                buttonText: "God Mode",
                method: () => {
                    const dm = getDeathManager();
                    if (dm) {
                        const max = dm.field("maxHealth").value;
                        dm.method("set_HealthPlayer").invoke(max);
                        dm.field("healthPlayer").value = max;
                        dm.field("isDye").value = false;
                        dm.field("OnEnabledSafeZone").value = true;
                    }
                },
                disableMethod: () => {
                    const dm = getDeathManager();
                    if (dm) dm.field("OnEnabledSafeZone").value = false;
                },
                isTogglable: true,
                toolTip: "Makes you invincible."
            }),
            new ButtonInfo({
                buttonText: "Max Health",
                method: () => {
                    const dm = getDeathManager();
                    if (dm) dm.field("healthPlayer").value = dm.field("maxHealth").value;
                },
                isTogglable: false,
                toolTip: "Restores your health to max."
            }),
            
                        
            new ButtonInfo({
                buttonText: "Kill Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (gunTrigger() && ray && !(ray.isNull?.() ?? true)) {
                            try {
                                const col = ray.method("get_collider").invoke();
                                if (col && !col.isNull()) {
                                    const cp = getComponentInParent(col, ClientPlayerClass);
                                    if (cp && !cp.isNull() && !isLocalPlayer(cp)) {
                                        const pv = cp.field("pv").value;
                                        pv.method("RPC").invoke(
                                            Il2Cpp.string("DyeSynx"),
                                            0,
                                            Il2Cpp.array(SystemObject, [
                                                Il2Cpp.reference([0, -1, 0], Il2Cpp.Type.Enum.VALUETYPE),
                                                Il2Cpp.reference(9999.0, Il2Cpp.Type.Enum.FLOAT),
                                                Il2Cpp.array(SystemObject, 0)
                                            ])
                                        );
                                        sendAllOutgoing();
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Kills whoever you aim at."
            }),
            new ButtonInfo({
                buttonText: "Push Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (gunTrigger() && ray && !(ray.isNull?.() ?? true)) {
                            try {
                                const col = ray.method("get_collider").invoke();
                                if (col && !col.isNull()) {
                                    const cp = getComponentInParent(col, ClientPlayerClass);
                                    if (cp && !cp.isNull() && !isLocalPlayer(cp)) {
                                        const pv = cp.field("pv").value;
                                        const dir = gunHandTransform().method("get_forward").invoke();
                                        const force = Vector3.method("op_Multiply", 2).invoke(dir, 50.0);
                                        pv.method("RPC").invoke(
                                            Il2Cpp.string("NetworkPush"),
                                            0,
                                            Il2Cpp.array(SystemObject, [
                                                Il2Cpp.reference(force, Il2Cpp.Type.Enum.VALUETYPE),
                                                Il2Cpp.reference(true, Il2Cpp.Type.Enum.BOOLEAN)
                                            ])
                                        );
                                        sendAllOutgoing();
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Pushes and ragdolls whoever you aim at."
            }),
            new ButtonInfo({
                buttonText: "Flash Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (gunTrigger() && ray && !(ray.isNull?.() ?? true)) {
                            try {
                                const col = ray.method("get_collider").invoke();
                                if (col && !col.isNull()) {
                                    const cp = getComponentInParent(col, ClientPlayerClass);
                                    if (cp && !cp.isNull() && !isLocalPlayer(cp)) {
                                        const pv = cp.field("pv").value;
                                        pv.method("RPC").invoke(Il2Cpp.string("Flashing"), 0, Il2Cpp.array(SystemObject, 0));
                                        sendAllOutgoing();
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Flashes the targeted player's screen."
            }),
            new ButtonInfo({
                buttonText: "Shock Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (gunTrigger() && ray && !(ray.isNull?.() ?? true)) {
                            try {
                                const col = ray.method("get_collider").invoke();
                                if (col && !col.isNull()) {
                                    const cp = getComponentInParent(col, ClientPlayerClass);
                                    if (cp && !cp.isNull() && !isLocalPlayer(cp)) {
                                        const pv = cp.field("pv").value;
                                        pv.method("RPC").invoke(Il2Cpp.string("ToShoked"), 0, Il2Cpp.array(SystemObject, 0));
                                        sendAllOutgoing();
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Shocks the targeted player."
            }),
            new ButtonInfo({
                buttonText: "Lag Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (gunTrigger() && ray && !(ray.isNull?.() ?? true)) {
                            try {
                                const col = ray.method("get_collider").invoke();
                                if (col && !col.isNull()) {
                                    const cp = getComponentInParent(col, ClientPlayerClass);
                                    if (cp && !cp.isNull() && !isLocalPlayer(cp)) {
                                        const pv = cp.field("pv").value;
                                        for (let i = 0; i < 100; i++) {
                                            pv.method("RPC").invoke(Il2Cpp.string("ToShoked"), 0, Il2Cpp.array(SystemObject, 0));
                                        }
                                        sendAllOutgoing();
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Crashes the targeted player via RPC flood."
            }),
            new ButtonInfo({
                buttonText: "Crash Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (gunTrigger() && ray && !(ray.isNull?.() ?? true)) {
                            try {
                                const col = ray.method("get_collider").invoke();
                                if (col && !col.isNull()) {
                                    const cp = getComponentInParent(col, ClientPlayerClass);
                                    if (cp && !cp.isNull() && !isLocalPlayer(cp)) {
                                        const pv = cp.field("pv").value;
                                        for (let i = 0; i < 500; i++) {
                                            pv.method("RPC").invoke(Il2Cpp.string("ToShoked"), 0, Il2Cpp.array(SystemObject, 0));
                                        }
                                        sendAllOutgoing();
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Crashes the targeted player via RPC flood."
            }),
            new ButtonInfo({
                buttonText: "Kill All",
                method: () => {
                    const players = getClientPlayers();
                    for (const cp of players) {
                        if (!isLocalPlayer(cp)) {
                            try {
                                const pv = cp.field("pv").value;
                                pv.method("RPC").invoke(
                                    Il2Cpp.string("DyeSynx"),
                                    0,
                                    Il2Cpp.array(SystemObject, [
                                        Il2Cpp.reference([0, -1, 0], Il2Cpp.Type.Enum.VALUETYPE),
                                        Il2Cpp.reference(9999.0, Il2Cpp.Type.Enum.FLOAT),
                                        Il2Cpp.array(SystemObject, 0)
                                    ])
                                );
                            } catch(_) {}
                        }
                    }
                    sendAllOutgoing();
                },
                isTogglable: false,
                toolTip: "Kills every other player in the lobby."
            }),
            new ButtonInfo({
                buttonText: "Push All",
                method: () => {
                    const players = getClientPlayers();
                    for (const cp of players) {
                        if (!isLocalPlayer(cp)) {
                            try {
                                const pv = cp.field("pv").value;
                                pv.method("RPC").invoke(
                                    Il2Cpp.string("NetworkPush"),
                                    0,
                                    Il2Cpp.array(SystemObject, [
                                        Il2Cpp.reference([0, 100, 0], Il2Cpp.Type.Enum.VALUETYPE),
                                        Il2Cpp.reference(true, Il2Cpp.Type.Enum.BOOLEAN)
                                    ])
                                );
                            } catch(_) {}
                        }
                    }
                    sendAllOutgoing();
                },
                isTogglable: false,
                toolTip: "Launches all players into the sky."
            }),
                        new ButtonInfo({
                buttonText: "Flash All",
                method: () => {
                    const players = getClientPlayers();
                    for (const cp of players) {
                        if (!isLocalPlayer(cp)) {
                            try {
                                const pv = cp.field("pv").value;
                                pv.method("RPC").invoke(
                                    Il2Cpp.string("Flashing"),
                                    0,
                                    Il2Cpp.array(SystemObject, 0)
                                );
                            } catch(_) {}
                        }
                    }
                    sendAllOutgoing();
                },
                isTogglable: false,
                toolTip: "Shocks all players."
            }),  
            new ButtonInfo({
                buttonText: "Shock All",
                method: () => {
                    const players = getClientPlayers();
                    for (const cp of players) {
                        if (!isLocalPlayer(cp)) {
                            try {
                                const pv = cp.field("pv").value;
                                pv.method("RPC").invoke(
                                    Il2Cpp.string("ToShoked"),
                                    0,
                                    Il2Cpp.array(SystemObject, 0)
                                );
                            } catch(_) {}
                        }
                    }
                    sendAllOutgoing();
                },
                isTogglable: false,
                toolTip: "Shocks all players."
            }),        
            new ButtonInfo({
                buttonText: "Lag All",
                method: () => {
                    const players = getClientPlayers();
                    for (const cp of players) {
                        if (!isLocalPlayer(cp)) {
                            try {
                                const pv = cp.field("pv").value;
                                for (let i = 0; i < 100; i++) {
                                pv.method("RPC").invoke(
                                    Il2Cpp.string("ToShoked"),
                                    0,
                                    Il2Cpp.array(SystemObject, 0)
                                );
                            }
                            } catch(_) {}
                        }
                    }
                    sendAllOutgoing();
                },
                isTogglable: false,
                toolTip: "Shocks all players."
            }),               
            new ButtonInfo({
                buttonText: "Crash All",
                method: () => {
                    const players = getClientPlayers();
                    for (const cp of players) {
                        if (!isLocalPlayer(cp)) {
                            try {
                                const pv = cp.field("pv").value;
                                for (let i = 0; i < 500; i++) {
                                pv.method("RPC").invoke(
                                    Il2Cpp.string("ToShoked"),
                                    0,
                                    Il2Cpp.array(SystemObject, 0)
                                );
                            }
                            } catch(_) {}
                        }
                    }
                    sendAllOutgoing();
                },
                isTogglable: false,
                toolTip: "Shocks all players."
            }),                  
        ],

        [ // Player Mods [3]
            new ButtonInfo({
                buttonText: "Exit Player Mods",
                method: () => { currentCategory = 0; currentPage = 0; },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
            new ButtonInfo({
                buttonText: "ESP",
                method: () => {
                    const players = getClientPlayers();
                    for (const cp of players) {
                        if (!isLocalPlayer(cp)) {
                            try {
                                const renderers = cp.field("bodyRenderers").value;
                                if (renderers && !renderers.isNull()) {
                                    for (let i = 0; i < renderers.length; i++) {
                                        const r = renderers.get(i);
                                        if (r && !r.isNull()) {
                                            const mat = r.method("get_material").invoke();
                                            mat.method("set_shader").invoke(TextShader);
                                            mat.method("set_color").invoke([1, 0, 0, 1]);
                                        }
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Highlights all players with red glow through walls."
            }),
            new ButtonInfo({
    buttonText: "Rainbow ESP",
    method: function(this: any) {
        // 1. If the loop is already running, stop it (Toggle Off)
        if (this.rainbowInterval) {
            clearInterval(this.rainbowInterval);
            this.rainbowInterval = null;
            return;
        }

        // 2. Start the update loop (Toggle On)
        // 50ms interval runs ~20 times per second for smooth, low-overhead updates
        this.rainbowInterval = setInterval(() => {
            const time = Date.now() * 0.003; // Adjust 0.003 to change speed
            
            // Calculate current rainbow color [R, G, B, A]
            const r = Math.sin(time) * 0.5 + 0.5;
            const g = Math.sin(time + (2 * Math.PI / 3)) * 0.5 + 0.5;
            const b = Math.sin(time + (4 * Math.PI / 3)) * 0.5 + 0.5;
            const currentColor = [r, g, b, 1.0];

            const players = getClientPlayers();
            for (const cp of players) {
                if (!isLocalPlayer(cp)) {
                    try {
                        const renderers = cp.field("bodyRenderers").value;
                        if (renderers && !renderers.isNull()) {
                            for (let i = 0; i < renderers.length; i++) {
                                const r = renderers.get(i);
                                if (r && !r.isNull()) {
                                    const mat = r.method("get_material").invoke();
                                    mat.method("set_shader").invoke(TextShader);
                                    mat.method("set_color").invoke(currentColor);
                                }
                            }
                        }
                    } catch(_) {}
                }
            }
        }, 50); 
    },
    isTogglable: true,
    toolTip: "Highlights all players with rainbow glow through walls."
}),

            new ButtonInfo({
                buttonText: "Teleport To Random",
                method: () => {
                    const players = getClientPlayers().filter(p => !isLocalPlayer(p));
                    if (players.length > 0) {
                        const target = players[Math.floor(Math.random() * players.length)];
                        const pos = getTransform(target).method("get_position").invoke();
                        teleportPlayer(pos);
                    }
                },
                isTogglable: false,
                toolTip: "Teleports you to a random player."
            }),
            new ButtonInfo({
                buttonText: "Teleport To Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (gunTrigger() && ray && !(ray.isNull?.() ?? true)) {
                            try {
                                const col = ray.method("get_collider").invoke();
                                if (col && !col.isNull()) {
                                    const cp = getComponentInParent(col, ClientPlayerClass);
                                    if (cp && !cp.isNull() && !isLocalPlayer(cp)) {
                                        teleportPlayer(getTransform(cp).method("get_position").invoke());
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Teleports to the player you aim at."
            }),
            new ButtonInfo({
                buttonText: "Get ID Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (gunTrigger() && ray && !(ray.isNull?.() ?? true)) {
                            try {
                                const col = ray.method("get_collider").invoke();
                                if (col && !col.isNull()) {
                                    const cp = getComponentInParent(col, ClientPlayerClass);
                                    if (cp && !cp.isNull() && !isLocalPlayer(cp) && time > idGunDelay) {
                                        idGunDelay = time + 0.5;
                                        const name = String(cp.field("PlayerNickName").value);
                                        sendNotification("Name: " + name);
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Gets the targeted player's name."
            }),
            new ButtonInfo({
                buttonText: "Get ID Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (gunTrigger() && ray && !(ray.isNull?.() ?? true)) {
                            try {
                                const col = ray.method("get_collider").invoke();
                                if (col && !col.isNull()) {
                                    const cp = getComponentInParent(col, ClientPlayerClass);
                                    if (cp && !cp.isNull() && !isLocalPlayer(cp) && time > idGunDelay) {
                                        idGunDelay = time + 0.5;
                                        const id = String(cp.field("PlayerID").value);
                                        sendNotification("ID: " + id);
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Gets the targeted player's ID."
            }),
            new ButtonInfo({
                buttonText: "Get Player Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (gunTrigger() && ray && !(ray.isNull?.() ?? true)) {
                            try {
                                const col = ray.method("get_collider").invoke();
                                if (col && !col.isNull()) {
                                    const cp = getComponentInParent(col, ClientPlayerClass);
                                    if (cp && !cp.isNull() && !isLocalPlayer(cp) && time > idGunDelay) {
                                        idGunDelay = time + 0.5;
                                        const name = String(cp.field("PlayerNickName").value);
                                        const id = String(cp.field("PlayerID").value);
                                        sendNotification("Name: " + name + " | ID: " + id);
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Gets the targeted player's name and ID."
            }),
        ],

        [ // Fun Mods [4]
            new ButtonInfo({
                buttonText: "Exit Fun Mods",
                method: () => { currentCategory = 0; currentPage = 0; },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
            new ButtonInfo({
                buttonText: "Ragdoll",
                method: () => {
                    const cgm = getClientGameManager();
                    if (cgm) cgm.field("isRagdool").value = true;
                },
                disableMethod: () => {
                    const cgm = getClientGameManager();
                    if (cgm) {
                        cgm.field("isRagdool").value = false;
                        cgm.method("StopRagdoolSmooth").invoke(0.5);
                    }
                },
                isTogglable: true,
                toolTip: "Ragdolls your character."
            }),
            
            new ButtonInfo({
                buttonText: "Spam Break Chat",
                method: () => {
                    const cgm = getClientGameManager();
                    if (cgm) {
                        const msgMgr = cgm.field("messagePlayerManager").value;
                        if (msgMgr && !msgMgr.isNull()) {
                            msgMgr.method("SendTextMessage").invoke(Il2Cpp.string("  \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t     \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t  "));
                        }
                    }
                },
                isTogglable: false,
                toolTip: "Sends a message in chat."
            }),
            new ButtonInfo({
                buttonText: "Spam Break Chat v2",
                method: () => {
                    const cgm = getClientGameManager();
                    if (cgm) {
                        const msgMgr = cgm.field("messagePlayerManager").value;
                        if (msgMgr && !msgMgr.isNull()) {
                            msgMgr.method("SendTextMessage").invoke(Il2Cpp.string("  \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t     \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t    \n\n\n   \n\n\n\n\t   \t\t\t\t\t\t\n\n\n\n\n\n  \t\t\t  "));
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Sends a message in chat."
            }),

            new ButtonInfo({
                buttonText: "Spam Chat \'Nigger\'",
                method: () => {
                    const cgm = getClientGameManager();
                    if (cgm) {
                        const msgMgr = cgm.field("messagePlayerManager").value;
                        if (msgMgr && !msgMgr.isNull()) {
                            msgMgr.method("SendTextMessage").invoke(Il2Cpp.string("Nigger"));
                        }
                    }
                },
                isTogglable: false,
                toolTip: "Sends a message in chat."
            }),
            new ButtonInfo({
                buttonText: "Spam Chat \'EyeCantSee On Top\'",
                method: () => {
                    const cgm = getClientGameManager();
                    if (cgm) {
                        const msgMgr = cgm.field("messagePlayerManager").value;
                        if (msgMgr && !msgMgr.isNull()) {
                            msgMgr.method("SendTextMessage").invoke(Il2Cpp.string("EyeCantSee On Top"));
                        }
                    }
                },
                isTogglable: false,
                toolTip: "Sends a message in chat."
            }),
            new ButtonInfo({
                buttonText: "Spam Chat \'EyeCantSee Was Here\'",
                method: () => {
                    const cgm = getClientGameManager();
                    if (cgm) {
                        const msgMgr = cgm.field("messagePlayerManager").value;
                        if (msgMgr && !msgMgr.isNull()) {
                            msgMgr.method("SendTextMessage").invoke(Il2Cpp.string("EyeCantSee Was Here"));
                        }
                    }
                },
                isTogglable: false,
                toolTip: "Sends a message in chat."
            }),
            new ButtonInfo({
                buttonText: "Spam Chat",
                method: () => {
                    const cgm = getClientGameManager();
                    if (cgm) {
                        const msgMgr = cgm.field("messagePlayerManager").value;
                        if (msgMgr && !msgMgr.isNull()) {
                            msgMgr.method("SendTextMessage").invoke(Il2Cpp.string("Stuff Horror Menu"));
                        }
                    }
                },
                isTogglable: false,
                toolTip: "Sends a message in chat."
            }),
            new ButtonInfo({
                buttonText: "Spam Shock All",
                method: () => {
                    const players = getClientPlayers();
                    for (const cp of players) {
                        if (!isLocalPlayer(cp)) {
                            try {
                                const pv = cp.field("pv").value;
                                pv.method("RPC").invoke(Il2Cpp.string("ToShoked"), 0, Il2Cpp.array(SystemObject, 0));
                            } catch(_) {}
                        }
                    }
                    sendAllOutgoing();
                },
                isTogglable: true,
                toolTip: "Shocks every player."
            }),
            new ButtonInfo({
                buttonText: "Spam Flash All",
                method: () => {
                    const players = getClientPlayers();
                    for (const cp of players) {
                        if (!isLocalPlayer(cp)) {
                            try {
                                const pv = cp.field("pv").value;
                                pv.method("RPC").invoke(Il2Cpp.string("Flashing"), 0, Il2Cpp.array(SystemObject, 0));
                            } catch(_) {}
                        }
                    }
                    sendAllOutgoing();
                },
                isTogglable: true,
                toolTip: "Flashes every player."
            }),
            new ButtonInfo({
                buttonText: "Disconnect",
                method: () => {
                    PhotonNetwork.method("Disconnect").invoke();
                },
                isTogglable: false,
                toolTip: "Disconnects you from the room."
            }),
            new ButtonInfo({
                buttonText: "Lag/Crash ITEM SPAWNER ALL",
                method: () => {
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate").invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 1).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 2).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 3).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 4).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                    PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), 0, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                },
                isTogglable: false,
                toolTip: "Disconnects you from the room."
            }),
            new ButtonInfo({
                buttonText: "Next Item",
                method: () => {
                    spawnIndex = (spawnIndex + 1) % spawnItems.length;
                    sendNotification("Item: " + spawnItems[spawnIndex], true, 3);
                },
                isTogglable: false,
                toolTip: "Cycles to the next spawnable item."
            }),
            new ButtonInfo({
                buttonText: "Prev Item",
                method: () => {
                    spawnIndex = (spawnIndex - 1 + spawnItems.length) % spawnItems.length;
                    sendNotification("Item: " + spawnItems[spawnIndex], true, 3);
                },
                isTogglable: false,
                toolTip: "Cycles to the previous spawnable item."
            }),
            new ButtonInfo({
                buttonText: "Spawn Item",
                method: () => {
                    try {
                        const prefab = spawnItems[spawnIndex];
                        const handPos = gunHandTransform().method("get_position").invoke();
                        const handRot = gunHandTransform().method("get_rotation").invoke();
                        console.log("[Spawn] PhotonNetwork.Instantiate('" + prefab + "')");
                        const spawned = PhotonNetwork.method("Instantiate", 5).invoke(
                            Il2Cpp.string(prefab), handPos, handRot, 0, Il2Cpp.array(SystemObject, 0)
                        );
                        sendAllOutgoing();
                        sendNotification("Spawned: " + prefab, true, 3);
                    } catch(e: any) {
                        sendNotification("Spawn failed: " + e.message, true, 3);
                    }
                },
                isTogglable: false,
                toolTip: "Spawns the selected item at your gun hand."
            }),
            new ButtonInfo({
                buttonText: "Spawn Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        if (gunTrigger()) {
                            try {
                                const pos = getTransform(gunData.gunPointer).method("get_position").invoke();
                                try {
                                        PhotonNetwork.method("Instantiate", 5).invoke(
                                            Il2Cpp.string(spawnItems[spawnIndex]), pos, identityQuaternion, 0, Il2Cpp.array(SystemObject, 0)
                                        );
                                        sendAllOutgoing();
                                    } catch(_) {}
                            } catch(e: any) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Grip+trigger to spawn items where you aim."
            }),
            new ButtonInfo({
                buttonText: "Inf Ammo",
                method: () => {
                    // ShamcerManager guns
                    const guns = getAllGuns();
                    if (guns) {
                        for (let i = 0; i < guns.length; i++) {
                            try {
                                const gun = guns.get(i);
                                if (!gun || gun.isNull()) continue;
                                const im = gun.field("itemManager").value;
                                if (im && !im.isNull() && im.field("isHold").value) {
                                    gun.method("set_Bullets").invoke(gun.field("maxBullets").value);
                                }
                            } catch(_) {}
                        }
                    }
                    // RocketLauncher — reset launchingCount to 0
                    const rockets = getAllRockets();
                    if (rockets) {
                        for (let i = 0; i < rockets.length; i++) {
                            try {
                                const r = rockets.get(i);
                                if (!r || r.isNull()) continue;
                                const lc = r.field("launchingCount").value;
                                if (lc > 0) {
                                    r.field("launchingCount").value = 0;
                                    try {
                                        const pv = getComponent(r.method("get_gameObject").invoke(),
                                            Il2Cpp.domain.assembly("PhotonUnityNetworking").image.class("Photon.Pun.PhotonView"));
                                        if (pv && !pv.isNull()) pv.method("RPC").invoke(Il2Cpp.string("RechargeLauncher"), 0, Il2Cpp.array(SystemObject, 0));
                                        sendAllOutgoing();
                                    } catch(_) {}
                                }
                            } catch(_) {}
                        }
                    }
                    // GloveGun — reset timeOut
                    const gloves = getAllGloveGuns();
                    if (gloves) {
                        for (let i = 0; i < gloves.length; i++) {
                            try {
                                const g = gloves.get(i);
                                if (!g || g.isNull()) continue;
                                g.field("timeOut").value = false;
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Keeps all weapons at max ammo."
            }),
            new ButtonInfo({
                buttonText: "Rapid Fire",
                method: () => {
                    // ShamcerManager — remove shoot cooldown
                    const guns = getAllGuns();
                    if (guns) {
                        for (let i = 0; i < guns.length; i++) {
                            try {
                                const gun = guns.get(i);
                                if (!gun || gun.isNull()) continue;
                                gun.field("shootKD").value = false;
                            } catch(_) {}
                        }
                    }
                    // GloveGun — remove timeout
                    const gloves = getAllGloveGuns();
                    if (gloves) {
                        for (let i = 0; i < gloves.length; i++) {
                            try {
                                const g = gloves.get(i);
                                if (!g || g.isNull()) continue;
                                g.field("timeOut").value = false;
                            } catch(_) {}
                        }
                    }
                    // RocketLauncher — reset count
                    const rockets = getAllRockets();
                    if (rockets) {
                        for (let i = 0; i < rockets.length; i++) {
                            try {
                                const r = rockets.get(i);
                                if (!r || r.isNull()) continue;
                                const lc = r.field("launchingCount").value;
                                if (lc > 0) {
                                    r.field("launchingCount").value = 0;
                                    try {
                                        const pv = getComponent(r.method("get_gameObject").invoke(),
                                            Il2Cpp.domain.assembly("PhotonUnityNetworking").image.class("Photon.Pun.PhotonView"));
                                        if (pv && !pv.isNull()) pv.method("RPC").invoke(Il2Cpp.string("RechargeLauncher"), 0, Il2Cpp.array(SystemObject, 0));
                                        sendAllOutgoing();
                                    } catch(_) {}
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Removes fire rate cooldown on all weapons."
            }),
            new ButtonInfo({
                buttonText: "Auto Reload",
                method: () => {
                    // ShamcerManager
                    const guns = getAllGuns();
                    if (guns) {
                        for (let i = 0; i < guns.length; i++) {
                            try {
                                const gun = guns.get(i);
                                if (!gun || gun.isNull()) continue;
                                const bullets = gun.method("get_Bullets").invoke();
                                if (bullets <= 0) {
                                    gun.method("set_Bullets").invoke(gun.field("maxBullets").value);
                                }
                            } catch(_) {}
                        }
                    }
                    // RocketLauncher — recharge when empty
                    const rockets = getAllRockets();
                    if (rockets) {
                        for (let i = 0; i < rockets.length; i++) {
                            try {
                                const r = rockets.get(i);
                                if (!r || r.isNull()) continue;
                                const lc = r.field("launchingCount").value;
                                if (lc > 0) {
                                    r.field("launchingCount").value = 0;
                                    try {
                                        const pv = getComponent(r.method("get_gameObject").invoke(),
                                            Il2Cpp.domain.assembly("PhotonUnityNetworking").image.class("Photon.Pun.PhotonView"));
                                        if (pv && !pv.isNull()) pv.method("RPC").invoke(Il2Cpp.string("RechargeLauncher"), 0, Il2Cpp.array(SystemObject, 0));
                                        sendAllOutgoing();
                                    } catch(_) {}
                                }
                                r.method("Recharge").invoke();
                            } catch(_) {}
                        }
                    }
                    // GloveGun — reset timeout
                    const gloves = getAllGloveGuns();
                    if (gloves) {
                        for (let i = 0; i < gloves.length; i++) {
                            try {
                                const g = gloves.get(i);
                                if (!g || g.isNull()) continue;
                                g.field("timeOut").value = false;
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Auto reloads all weapons when empty."
            }),
            new ButtonInfo({
                buttonText: "Fart Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        if (gunTrigger()) {
                            try {
                                const GrenadeManagerClass = AssemblyCSharp.class("GrenadeManager");
                                const SmogManagerClass = AssemblyCSharp.class("SmogManager");
                                // Spam PoopExplosion on all grenades
                                const grenades = Object.method("FindObjectsOfType", 0).inflate(GrenadeManagerClass).invoke();
                                if (grenades && !grenades.isNull()) {
                                    for (let i = 0; i < grenades.length; i++) {
                                        try {
                                            const g = grenades.get(i);
                                            if (!g || g.isNull()) continue;
                                            const pv = getComponent(g.method("get_gameObject").invoke(),
                                                Il2Cpp.domain.assembly("PhotonUnityNetworking").image.class("Photon.Pun.PhotonView"));
                                            if (pv && !pv.isNull()) {
                                                pv.method("RPC").invoke(Il2Cpp.string("PoopExplosion"), 0, Il2Cpp.array(SystemObject, 0));
                                            }
                                        } catch(_) {}
                                    }
                                }
                                // Spam ToSmog on all smog managers
                                const smogs = Object.method("FindObjectsOfType", 0).inflate(SmogManagerClass).invoke();
                                if (smogs && !smogs.isNull()) {
                                    for (let i = 0; i < smogs.length; i++) {
                                        try {
                                            const s = smogs.get(i);
                                            if (!s || s.isNull()) continue;
                                            const pv = getComponent(s.method("get_gameObject").invoke(),
                                                Il2Cpp.domain.assembly("PhotonUnityNetworking").image.class("Photon.Pun.PhotonView"));
                                            if (pv && !pv.isNull()) {
                                                pv.method("RPC").invoke(Il2Cpp.string("ToSmog"), 0, Il2Cpp.array(SystemObject, 0));
                                            }
                                        } catch(_) {}
                                    }
                                }
                                sendAllOutgoing();
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Grip+trigger to spam poop/fart effects everywhere."
            }),
            new ButtonInfo({
                buttonText: "Push Allv2",
                method: () => {
                    const players = getClientPlayers();
                    for (const cp of players) {
                        if (!isLocalPlayer(cp)) {
                            try {
                                const pv = cp.field("pv").value;
                                pv.method("RPC").invoke(Il2Cpp.string("NetworkPush"), 0, Il2Cpp.array(SystemObject, [[0, 15, 0], true]));
                            } catch(_) {}
                        }
                    }
                    sendAllOutgoing();
                    sendNotification("Launched everyone!", true, 3);
                },
                isTogglable: false,
                toolTip: "Ragdoll-pushes all players upward."
            }),
            new ButtonInfo({
                buttonText: "Flash Allv3",
                method: () => {
                    try {
                        const ColorPlayerManagerClass = AssemblyCSharp.class("ColorPlayerManager");
                        const all = Object.method("FindObjectsOfType", 0).inflate(ColorPlayerManagerClass).invoke();
                        if (all && !all.isNull()) {
                            for (let i = 0; i < all.length; i++) {
                                try {
                                    const cpm = all.get(i);
                                    if (!cpm || cpm.isNull()) continue;
                                    const pv = getComponent(cpm.method("get_gameObject").invoke(),
                                        Il2Cpp.domain.assembly("PhotonUnityNetworking").image.class("Photon.Pun.PhotonView"));
                                    if (pv && !pv.isNull()) {
                                        pv.method("RPC").invoke(Il2Cpp.string("Flashing"), 0, Il2Cpp.array(SystemObject, 0));
                                    }
                                } catch(_) {}
                            }
                        }
                        sendAllOutgoing();
                        sendNotification("Flashed everyone!", true, 3);
                    } catch(_) {}
                },
                isTogglable: false,
                toolTip: "Triggers flash effect on all players."
            }),
            new ButtonInfo({
                buttonText: "Explode Mines",
                method: () => {
                    try {
                        const MineManagerClass = AssemblyCSharp.class("MineManager");
                        const mines = Object.method("FindObjectsOfType", 0).inflate(MineManagerClass).invoke();
                        if (mines && !mines.isNull()) {
                            for (let i = 0; i < mines.length; i++) {
                                try {
                                    const m = mines.get(i);
                                    if (!m || m.isNull()) continue;
                                    const pv = getComponent(m.method("get_gameObject").invoke(),
                                        Il2Cpp.domain.assembly("PhotonUnityNetworking").image.class("Photon.Pun.PhotonView"));
                                    if (pv && !pv.isNull()) {
                                        pv.method("RPC").invoke(Il2Cpp.string("ExplosionMine"), 0, Il2Cpp.array(SystemObject, 0));
                                    }
                                } catch(_) {}
                            }
                        }
                        sendAllOutgoing();
                        sendNotification("Mines detonated!", true, 3);
                    } catch(_) {}
                },
                isTogglable: false,
                toolTip: "Detonates all mines in the scene."
            }),
            new ButtonInfo({
                buttonText: "Explode Gun",
                method: () => {
                    if (gunGrab()) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (gunTrigger() && ray && !(ray.isNull?.() ?? true)) {
                            try {
                                const col = ray.method("get_collider").invoke();
                                if (col && !col.isNull()) {
                                    const cp = getComponentInParent(col, ClientPlayerClass);
                                    if (cp && !cp.isNull() && !isLocalPlayer(cp)) {
                                        const pv = cp.field("pv").value;
                                        pv.method("RPC").invoke(
                                            Il2Cpp.string("ToExplision"),
                                            0,
                                            Il2Cpp.array(SystemObject, 0)
                                        );
                                        sendAllOutgoing();
                                    }
                                }
                            } catch(_) {}
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Kills whoever you aim at."
            }),
            new ButtonInfo({
                buttonText: "Explode All",
                method: () => {
                    try {
                        const GrenadeManagerClass = AssemblyCSharp.class("GrenadeManager");
                        const grenades = Object.method("FindObjectsOfType", 0).inflate(GrenadeManagerClass).invoke();
                        if (grenades && !grenades.isNull()) {
                            for (let i = 0; i < grenades.length; i++) {
                                try {
                                    const g = grenades.get(i);
                                    if (!g || g.isNull()) continue;
                                    const pv = getComponent(g.method("get_gameObject").invoke(),
                                        Il2Cpp.domain.assembly("PhotonUnityNetworking").image.class("Photon.Pun.PhotonView"));
                                    if (pv && !pv.isNull()) {
                                        pv.method("RPC").invoke(Il2Cpp.string("ToExplision"), 0, Il2Cpp.array(SystemObject, 0));
                                    }
                                } catch(_) {}
                            }
                        }
                        sendAllOutgoing();
                        sendNotification("Exploded all grenades!", true, 3);
                    } catch(_) {}
                },
                isTogglable: false,
                toolTip: "Triggers explosion on all grenades."
            }),
            new ButtonInfo({
                buttonText: "Launch Rockets",
                method: () => {
                    try {
                        const RocketLauncherManagerClass = AssemblyCSharp.class("RocketLauncherManager");
                        const rockets = Object.method("FindObjectsOfType", 0).inflate(RocketLauncherManagerClass).invoke();
                        if (rockets && !rockets.isNull()) {
                            for (let i = 0; i < rockets.length; i++) {
                                try {
                                    const r = rockets.get(i);
                                    if (!r || r.isNull()) continue;
                                    const pv = getComponent(r.method("get_gameObject").invoke(),
                                        Il2Cpp.domain.assembly("PhotonUnityNetworking").image.class("Photon.Pun.PhotonView"));
                                    if (pv && !pv.isNull()) {
                                        pv.method("RPC").invoke(Il2Cpp.string("OnRocketLaunch"), 0, Il2Cpp.array(SystemObject, 0));
                                    }
                                } catch(_) {}
                            }
                        }
                        sendAllOutgoing();
                        sendNotification("Rockets launched!", true, 3);
                    } catch(_) {}
                },
                isTogglable: false,
                toolTip: "Fires all rocket launchers in the scene."
            }),
            new ButtonInfo({
                buttonText: "Color All RGB",
                method: () => {
                    try {
                        const r = Math.random();
                        const g = Math.random();
                        const b = Math.random();
                        const ColorPlayerManagerClass = AssemblyCSharp.class("ColorPlayerManager");
                        const all = Object.method("FindObjectsOfType", 0).inflate(ColorPlayerManagerClass).invoke();
                        if (all && !all.isNull()) {
                            for (let i = 0; i < all.length; i++) {
                                try {
                                    const cpm = all.get(i);
                                    if (!cpm || cpm.isNull()) continue;
                                    const pv = getComponent(cpm.method("get_gameObject").invoke(),
                                        Il2Cpp.domain.assembly("PhotonUnityNetworking").image.class("Photon.Pun.PhotonView"));
                                    if (pv && !pv.isNull()) {
                                        pv.method("RPC").invoke(Il2Cpp.string("SetPlayerColorRPC"), 0, Il2Cpp.array(SystemObject, [r, g, b]));
                                    }
                                } catch(_) {}
                            }
                        }
                        sendAllOutgoing();
                        sendNotification("Colored everyone!", true, 3);
                    } catch(_) {}
                },
                isTogglable: false,
                toolTip: "Sets all players to a random color."
            }),
            new ButtonInfo({
                buttonText: "Fart All",
                method: () => {
                    try {
                        const GrenadeManagerClass = AssemblyCSharp.class("GrenadeManager");
                        const grenades = Object.method("FindObjectsOfType", 0).inflate(GrenadeManagerClass).invoke();
                        if (grenades && !grenades.isNull()) {
                            for (let i = 0; i < grenades.length; i++) {
                                try {
                                    const g = grenades.get(i);
                                    if (!g || g.isNull()) continue;
                                    const pv = getComponent(g.method("get_gameObject").invoke(),
                                        Il2Cpp.domain.assembly("PhotonUnityNetworking").image.class("Photon.Pun.PhotonView"));
                                    if (pv && !pv.isNull()) {
                                        pv.method("RPC").invoke(Il2Cpp.string("PoopExplosion"), 0, Il2Cpp.array(SystemObject, 0));
                                    }
                                } catch(_) {}
                            }
                        }
                        sendAllOutgoing();
                        sendNotification("Fart bombed!", true, 3);
                    } catch(_) {}
                },
                isTogglable: false,
                toolTip: "Triggers poop explosion on all grenades in the scene."
            }),
        ],

        [ // Settings [5]
            new ButtonInfo({
                buttonText: "Exit Settings",
                method: () => { currentCategory = 0; currentPage = 0; },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
            new ButtonInfo({
                buttonText: "Gun Lock",
                method: () => { gunLockEnabled = true; },
                disableMethod: () => { gunLockEnabled = false; unlockGun(); },
                isTogglable: true,
                toolTip: "Locks gun onto targeted player on trigger pull."
            }),
            new ButtonInfo({
                buttonText: "Right Hand",
                method: () => { righthand = true; reloadMenu(); },
                isTogglable: false,
                toolTip: "Puts menu on right hand."
            }),
            new ButtonInfo({
                buttonText: "Left Hand",
                method: () => { righthand = false; reloadMenu(); },
                isTogglable: false,
                toolTip: "Puts menu on left hand."
            }),
            new ButtonInfo({
                buttonText: "Next Name",
                method: () => {
                    nameIndex = (nameIndex + 1) % nameList.length;
                    sendNotification("Name: " + nameList[nameIndex], true, 3);
                },
                isTogglable: false,
                toolTip: "Cycles to next name."
            }),
            new ButtonInfo({
                buttonText: "Set Name",
                method: () => {
                    try {
                        const name = nameList[nameIndex];
                        const players = getClientPlayers();
                        for (const cp of players) {
                            if (isLocalPlayer(cp)) {
                                const pv = cp.field("pv").value;
                                if (pv && !pv.isNull()) {
                                    pv.method("RPC").invoke(
                                        Il2Cpp.string("PlayerNickNameInit"), 0,
                                        Il2Cpp.array(SystemObject, [Il2Cpp.string(name), Il2Cpp.string("")])
                                    );
                                }
                                cp.field("PlayerNickName").value = Il2Cpp.string(name);
                                break;
                            }
                        }
                        PhotonNetwork.method("get_LocalPlayer").invoke().method("set_NickName").invoke(Il2Cpp.string(name));
                        sendAllOutgoing();
                        sendNotification("Name set: " + name, true, 3);
                    } catch(e) {
                        sendNotification("Name failed: " + e, true, 3);
                    }
                },
                isTogglable: false,
                toolTip: "Sets your name to the selected name."
            }),
            new ButtonInfo({
                buttonText: "Set Name \'EyeCantSee\'",
                method: () => {
                    try {
                        const name = "EyeCantSee";
                        const players = getClientPlayers();
                        for (const cp of players) {
                            if (isLocalPlayer(cp)) {
                                const pv = cp.field("pv").value;
                                if (pv && !pv.isNull()) {
                                    pv.method("RPC").invoke(
                                        Il2Cpp.string("PlayerNickNameInit"), 0,
                                        Il2Cpp.array(SystemObject, [Il2Cpp.string(name), Il2Cpp.string("")])
                                    );
                                }
                                cp.field("PlayerNickName").value = Il2Cpp.string(name);
                                break;
                            }
                        }
                        PhotonNetwork.method("get_LocalPlayer").invoke().method("set_NickName").invoke(Il2Cpp.string(name));
                        sendAllOutgoing();
                        sendNotification("Name set: " + name, true, 3);
                    } catch(e) {
                        sendNotification("Name failed: " + e, true, 3);
                    }
                },
                isTogglable: false,
                toolTip: "Sets your name to the selected name."
            }),
            new ButtonInfo({
                buttonText: "Toggle Notifs",
                method: () => { buttonNotifications = !buttonNotifications; },
                isTogglable: false,
                toolTip: "Toggles button notifications."
            }),
            new ButtonInfo({
                buttonText: "Change Theme",
                method: () => {
                    themeIndex++;
                    themeIndex %= 6;
                    switch (themeIndex) {
                        case 0: bgColor = [0.8, 0.1, 0.1, 1.0]; textColor = [1.0, 0.8, 0.8, 1.0]; break;
                        case 1: bgColor = [0.1, 0.5, 0.9, 1.0]; textColor = [0.8, 0.9, 1.0, 1.0]; break;
                        case 2: bgColor = [0.1, 0.8, 0.2, 1.0]; textColor = [0.8, 1.0, 0.8, 1.0]; break;
                        case 3: bgColor = [0.6, 0.0, 0.8, 1.0]; textColor = [0.9, 0.7, 1.0, 1.0]; break;
                        case 4: bgColor = [1.0, 0.5, 0.0, 1.0]; textColor = [1.0, 0.8, 0.5, 1.0]; break;
                        case 5: bgColor = [0.2, 0.2, 0.2, 1.0]; textColor = [0.9, 0.9, 0.9, 1.0]; break;
                    }
                    buttonColor = [bgColor[0] * 0.6, bgColor[1] * 0.6, bgColor[2] * 0.6, 1.0];
                    buttonPressedColor = [bgColor[0] * 0.3, bgColor[1] * 0.3, bgColor[2] * 0.3, 1.0];
                    reloadMenu();
                },
                isTogglable: false,
                toolTip: "Changes the menu color theme."
            }),
        ],

        [ // Favorite Mods [6]
            new ButtonInfo({
                buttonText: "Exit Favorite Mods",
                method: () => { currentCategory = 0; currentPage = 0; },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
        ],

        [ // Enabled Mods [7]
            new ButtonInfo({
                buttonText: "Exit Enabled Mods",
                method: () => { currentCategory = 0; currentPage = 0; },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
        ],
    ];

    function reloadMenu() {
        if (menu != null) {
            Destroy(menu);
            menu = null;
            renderMenu();
        }
    }

    function getIndex(name: any) {
        if (name.startsWith("PreviousPage")) {
            currentPage = Math.max(0, currentPage - 1);
            reloadMenu();
            return null;
        } else if (name.startsWith("NextPage")) {
            const lastPage = Math.ceil(buttons[currentCategory].length / 8) - 1;
            currentPage = Math.min(lastPage, currentPage + 1);
            reloadMenu();
            return null;
        } else if (name == "Disconnect") {
            PhotonNetwork.method("Disconnect").invoke();
            return null;
        } else if (name == "GlobalReturn") {
            currentCategory = 0;
            currentPage = 0;
            reloadMenu();
            return null;
        }

        const ret = buttons.flat().find(b => b.buttonText === name);
        return ret || null;
    }

    function getCategoryIndex(button: any) {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].includes(button)) return i;
        }
        return -1;
    }

    function renderMenu() {
        menu = createObject(zeroVector, identityQuaternion, [0.1, 0.3, 0.3825], 3, [0, 0, 0, 0]);
        Destroy(getComponent(menu, BoxCollider));

        const menuBackground = createObject([0.1, 0, 0], identityQuaternion, [0.1, 1, 1], 3, bgColor, getTransform(menu));
        Destroy(getComponent(menuBackground, BoxCollider));

        const canvasObject = createObject(zeroVector, identityQuaternion, oneVector, 3, [0, 0, 0, 0], getTransform(menu));
        const canvas = addComponent(canvasObject, Canvas);
        Destroy(getComponent(canvasObject, BoxCollider));

        const canvasScaler = addComponent(canvasObject, CanvasScaler);
        addComponent(canvasObject, GraphicRaycaster);
        canvas.method("set_renderMode").invoke(2);
        canvasScaler.method("set_dynamicPixelsPerUnit").invoke(1000.0);

        renderMenuText(canvasObject, menuName + `<color=grey>[</color><color=white>${currentPage + 1}</color><color=grey>]</color>`, textColor, [0.11, 0, 0.175], [1, 0.1]);

        if (time > notifactionResetTime) currentNotification = "";
        renderMenuText(canvasObject, currentNotification, textColor, [0.11, 0, 0.275], [1, 0.1]);

        menu.method("set_layer").invoke(29);

        const disconnectButton = createObject([0.1, 0.0, 0.225], identityQuaternion, [0.09, 0.9, 0.08], 3, buttonColor, getTransform(menu));
        disconnectButton.method("set_name").invoke(Il2Cpp.string("@Disconnect"));
        if (BannerLink) addComponent(disconnectButton, BannerLink);
        getComponent(disconnectButton, BoxCollider).method("set_isTrigger").invoke(true);
        disconnectButton.method("set_layer").invoke(29);
        renderMenuText(canvasObject, "Disconnect", textColor, [0.11, 0, 0.225], [1, 0.1]);

        const returnButton = createObject([0.1, -0.175, -0.225], identityQuaternion, [0.09, 0.09, 0.09], 3, buttonColor, getTransform(menu));
        returnButton.method("set_name").invoke(Il2Cpp.string("@GlobalReturn"));
        if (BannerLink) addComponent(returnButton, BannerLink);
        getComponent(returnButton, BoxCollider).method("set_isTrigger").invoke(true);
        returnButton.method("set_layer").invoke(29);
        renderMenuText(canvasObject, "<", textColor, [0.11, -0.175, -0.225], [1, 0.1]);

        {
            const pageButton = createObject([0.1, 0.2, 0], identityQuaternion, [0.09, 0.2, 0.9], 3, buttonColor, getTransform(menu));
            pageButton.method("set_name").invoke(Il2Cpp.string("@PreviousPage"));
            if (BannerLink) addComponent(pageButton, BannerLink);
            getComponent(pageButton, BoxCollider).method("set_isTrigger").invoke(true);
            pageButton.method("set_layer").invoke(29);
            renderMenuText(canvasObject, "<", textColor, [0.11, 0.2, 0], [1, 0.1]);
        }

        {
            const pageButton = createObject([0.1, -0.2, 0], identityQuaternion, [0.09, 0.2, 0.9], 3, buttonColor, getTransform(menu));
            pageButton.method("set_name").invoke(Il2Cpp.string("@NextPage"));
            if (BannerLink) addComponent(pageButton, BannerLink);
            getComponent(pageButton, BoxCollider).method("set_isTrigger").invoke(true);
            pageButton.method("set_layer").invoke(29);
            renderMenuText(canvasObject, ">", textColor, [0.11, -0.2, 0], [1, 0.1]);
        }

        let i = 0;
        const targetMods = buttons[currentCategory]
            .slice(currentPage * 8)
            .slice(0, 8);

        targetMods.forEach((buttonData) => {
            const button = createObject([0.105, 0, 0.13 - (i * 0.04)], identityQuaternion, [0.09, 0.9, 0.08], 3, buttonColor, getTransform(menu));
            button.method("set_name").invoke(Il2Cpp.string("@" + buttonData.buttonText));
            if (BannerLink) addComponent(button, BannerLink);
            getComponent(button, BoxCollider).method("set_isTrigger").invoke(true);
            button.method("set_layer").invoke(29);
            renderMenuText(canvasObject, buttonData.buttonText, textColor, [0.11, 0, 0.13 - (i * 0.04)], [1, 0.1]);
            updateButtonColor(button, buttonData);
            i++;
        });

        getTransform(menu).method("set_localScale").invoke(Vector3.method("op_Multiply", 2).invoke(getTransform(menu).method("get_localScale").invoke(), menuscale));
        recenterMenu();
    }

    function renderReference() {
        const parent = righthand ? leftHandTransform : rightHandTransform;
        reference = createObject(zeroVector, identityQuaternion, [0.01, 0.01, 0.01], 0, bgColor, parent);
        referenceCollider = getComponent(reference, Collider);
        referenceCollider.method("set_isTrigger").invoke(true);
        getTransform(reference).method("set_localPosition").invoke([0.01, -0.117, 0.05]);
        reference.method("set_layer").invoke(29);
        const rb = addComponent(reference, Rigidbody);
        rb.method("set_isKinematic").invoke(true);
    }

    function recenterMenu() {
        try {
            const menuTransform = getTransform(menu);
            let targetPos, targetRot;

            if (righthand) {
                targetPos = rightHandTransform.method("get_position").invoke();
                targetRot = rightHandTransform.method("get_rotation").invoke();
                targetRot = Quaternion.method("op_Multiply").invoke(targetRot, Quaternion.method("Euler").invoke(0, 0, 180));
            } else {
                targetPos = leftHandTransform.method("get_position").invoke();
                targetRot = leftHandTransform.method("get_rotation").invoke();
                targetRot = Quaternion.method("op_Multiply").invoke(targetRot, Quaternion.method("Euler").invoke(0, 0, 0));
            }

            menuTransform.method("set_position").invoke(targetPos);
            menuTransform.method("set_rotation").invoke(targetRot);
        } catch(_) {
            refreshTransforms();
        }
    }

    function toggleFavorite(info: ButtonInfo) {
        let exists = false;
        for (let index = 0; index < buttons[6].length; index++) {
            const mod = buttons[6][index];
            if (mod.buttonText == info.buttonText) { exists = true; break; }
        }
        if (exists) {
            if (info.buttonText == "Exit Favorite Mods") return;
            for (let index = 0; index < buttons[6].length; index++) {
                const mod = buttons[6][index];
                if (mod.buttonText == info.buttonText) { buttons[6].splice(index, 1); break; }
            }
        } else {
            if (info.buttonText == "Exit Favorite Mods") return;
            buttons[6].push(info);
        }
    }

    function loadEnabled() {
        buttons[7].splice(1);
        buttons.forEach((buttonList, index) => {
            if (index != 7 && index != 6) {
                buttonList.forEach(button => {
                    if (button.enabled) buttons[7].push(button);
                });
            }
        });
    }

    // Gun system
    let gunLocked = false;
    let lockTarget: any = null;
    let GunPointer: any = null;
    let GunLine: any = null;
    let physicsRaycastAllVec4: any = null;
    let physicsRaycastOutVec4: any = null;
    let physicsRaycastOutVec5: any = null;

    function tryLockGunTarget(gunData: any) {
        if (!gunData || !gunData.ray || gunData.ray.handle?.isNull?.()) return;
        try {
            const col = gunData.ray.method("get_collider").invoke();
            if (!col || col.isNull()) return;
            const cp = getComponentInParent(col, ClientPlayerClass);
            if (!cp || cp.handle.isNull() || isLocalPlayer(cp)) return;
            gunLocked = true;
            lockTarget = getTransform(cp);
        } catch(_) {}
    }

    function unlockGun() {
        gunLocked = false;
        lockTarget = null;
    }

    function renderGun(overrideLayerMask = null) {
        const gunHand = gunHandTransform();
        const StartPosition = gunHand.method("get_position").invoke();
        const Direction = gunHand.method("get_forward").invoke();

        const rayStartPosition = Vector3.method("op_Addition", 2).invoke(
            StartPosition,
            Vector3.method("op_Multiply", 2).invoke(Direction, 0.08)
        );

        const layerMask = overrideLayerMask ?? -1;
        let finalRay = null;
        try {
            if (!physicsRaycastAllVec4) {
                physicsRaycastAllVec4 = Physics.method("RaycastAll").overload(
                    "UnityEngine.Vector3",
                    "UnityEngine.Vector3",
                    "System.Single",
                    "System.Int32"
                );
            }
            const hits = physicsRaycastAllVec4.invoke(rayStartPosition, Direction, 512.0, layerMask);
            if (hits && !hits.isNull() && hits.length > 0) {
                let bestDistance = Number.POSITIVE_INFINITY;
                for (let i = 0; i < hits.length; i++) {
                    try {
                        const hit = hits.get(i);
                        if (!hit || hit.isNull?.()) continue;
                        const hitCollider = hit.method("get_collider").invoke();
                        if (!hitCollider || hitCollider.isNull()) continue;
                        const hitPoint = hit.method("get_point").invoke();
                        const distance = Vector3.method("Distance").invoke(hitPoint, StartPosition) as number;
                        if (distance < 0.08 || distance >= bestDistance) continue;
                        bestDistance = distance;
                        finalRay = hit;
                    } catch(_) {}
                }
            }
        } catch(_) {}

        if (!finalRay) {
            try {
                const hitBuf = Il2Cpp.alloc(128);
                if (!physicsRaycastOutVec4) {
                    physicsRaycastOutVec4 = Physics.method("Raycast").overload(
                        "UnityEngine.Vector3", "UnityEngine.Vector3", "UnityEngine.RaycastHit&", "System.Single"
                    );
                }
                if (!physicsRaycastOutVec5) {
                    physicsRaycastOutVec5 = Physics.method("Raycast").overload(
                        "UnityEngine.Vector3", "UnityEngine.Vector3", "UnityEngine.RaycastHit&", "System.Single", "System.Int32"
                    );
                }
                const didHit = overrideLayerMask == null
                    ? physicsRaycastOutVec4.invoke(rayStartPosition, Direction, hitBuf, 512.0)
                    : physicsRaycastOutVec5.invoke(rayStartPosition, Direction, hitBuf, 512.0, layerMask);
                if (didHit) {
                    const hitRef = Il2Cpp.reference(hitBuf);
                    const hitPoint = hitRef.method("get_point").invoke();
                    const distance = Vector3.method("Distance").invoke(hitPoint, StartPosition) as number;
                    if (distance >= 0.08) finalRay = hitRef;
                }
            } catch(_) {}
        }

        let EndPosition;
        if (gunLocked && lockTarget && !(lockTarget.isNull?.() ?? true)) {
            EndPosition = lockTarget.method("get_position").invoke();
        } else {
            if (finalRay && !(finalRay.isNull?.() ?? false)) {
                EndPosition = finalRay.method("get_point").invoke();
            } else {
                const farDirection = Vector3.method("op_Multiply", 2).invoke(Direction, 512);
                EndPosition = Vector3.method("op_Addition", 2).invoke(StartPosition, farDirection);
            }
        }

        if (Vector3.method("op_Equality").invoke(EndPosition, zeroVector)) {
            const farDirection = Vector3.method("op_Multiply", 2).invoke(Direction, 512);
            EndPosition = Vector3.method("op_Addition", 2).invoke(StartPosition, farDirection);
        }

        if (GunPointer == null || GunPointer.isNull?.()) {
            GunPointer = createObject(EndPosition, identityQuaternion, [0.1, 0.1, 0.1], 0, [1, 1, 1, 1]);
        }

        GunPointer.method("SetActive").invoke(true);
        const pointerTransform = getTransform(GunPointer);
        pointerTransform.method("set_position").invoke(EndPosition);

        const PointerRenderer = getComponent(GunPointer, Renderer);
        const material = PointerRenderer.method("get_material").invoke();
        material.method("set_shader").invoke(TextShader);

        const pointerColor = (gunLocked || gunTrigger()) ? buttonPressedColor : buttonColor;
        material.method("set_color").invoke(pointerColor);

        const collider = getComponent(GunPointer, Collider);
        if (collider != null) Destroy(collider);

        if (GunLine == null || GunLine.isNull?.()) {
            const lineObj = createObject(zeroVector, identityQuaternion, oneVector, 0, [0, 0, 0, 0]);
            GunLine = addComponent(lineObj, LineRenderer);
        } else {
            GunLine.method("get_gameObject").invoke().method("SetActive").invoke(true);
        }

        const lineMaterial = GunLine.method("get_material").invoke();
        lineMaterial.method("set_shader").invoke(TextShader);

        GunLine.method("set_startColor").invoke(bgColor);
        GunLine.method("set_endColor").invoke(bgColor);

        const lineWidth = 0.025;
        GunLine.method("set_startWidth").invoke(lineWidth);
        GunLine.method("set_endWidth").invoke(lineWidth);

        GunLine.method("set_positionCount").invoke(2);
        GunLine.method("set_useWorldSpace").invoke(true);

        GunLine.method("SetPosition").invoke(0, StartPosition);
        GunLine.method("SetPosition").invoke(1, EndPosition);

        if (gunTrigger() || gunLocked) {
            const Step = 34;
            GunLine.method("set_positionCount").invoke(Step);
            GunLine.method("SetPosition").invoke(0, StartPosition);
            const dirVec = readVec3Components(Direction);
            const dirMag = Math.sqrt((dirVec[0] * dirVec[0]) + (dirVec[1] * dirVec[1]) + (dirVec[2] * dirVec[2])) || 1;
            const dirNorm: [number, number, number] = [dirVec[0] / dirMag, dirVec[1] / dirMag, dirVec[2] / dirMag];
            let upBasis: [number, number, number] = [0, 1, 0];
            if (Math.abs(dirNorm[1]) > 0.92) upBasis = [1, 0, 0];
            let side: [number, number, number] = [
                (upBasis[1] * dirNorm[2]) - (upBasis[2] * dirNorm[1]),
                (upBasis[2] * dirNorm[0]) - (upBasis[0] * dirNorm[2]),
                (upBasis[0] * dirNorm[1]) - (upBasis[1] * dirNorm[0])
            ];
            let sideMag = Math.sqrt((side[0] * side[0]) + (side[1] * side[1]) + (side[2] * side[2])) || 1;
            side = [side[0] / sideMag, side[1] / sideMag, side[2] / sideMag];
            let swirlUp: [number, number, number] = [
                (dirNorm[1] * side[2]) - (dirNorm[2] * side[1]),
                (dirNorm[2] * side[0]) - (dirNorm[0] * side[2]),
                (dirNorm[0] * side[1]) - (dirNorm[1] * side[0])
            ];
            let swirlUpMag = Math.sqrt((swirlUp[0] * swirlUp[0]) + (swirlUp[1] * swirlUp[1]) + (swirlUp[2] * swirlUp[2])) || 1;
            swirlUp = [swirlUp[0] / swirlUpMag, swirlUp[1] / swirlUpMag, swirlUp[2] / swirlUpMag];

            for (let i = 1; i < (Step - 1); i++) {
                const t = i / (Step - 1);
                const Position = Vector3.method("Lerp").invoke(StartPosition, EndPosition, t);
                const swirlAngle = (time * 9.0) + (t * Math.PI * 10.0);
                const swirlFade = Math.sin(t * Math.PI);
                const swirlRadius = (0.018 + (Math.sin((t * Math.PI * 2.0) + (time * 2.4)) * 0.004)) * swirlFade;
                const offset = [
                    (side[0] * Math.cos(swirlAngle) + swirlUp[0] * Math.sin(swirlAngle)) * swirlRadius,
                    (side[1] * Math.cos(swirlAngle) + swirlUp[1] * Math.sin(swirlAngle)) * swirlRadius,
                    (side[2] * Math.cos(swirlAngle) + swirlUp[2] * Math.sin(swirlAngle)) * swirlRadius
                ];
                const finalPosition = Vector3.method("op_Addition", 2).invoke(Position, offset);
                GunLine.method("SetPosition").invoke(i, finalPosition);
            }

            GunLine.method("SetPosition").invoke(Step - 1, EndPosition);
        }

        if (gunLockEnabled) {
            if (gunTrigger() && !gunLocked) {
                tryLockGunTarget({ ray: finalRay });
            } else if (!gunTrigger() && gunLocked) {
                unlockGun();
            }
        }

        return { ray: finalRay, gunPointer: GunPointer };
    }

    // Hook into BannerLink.OnTriggerEnter for button presses
    const ButtonActivation = BannerLink.method("OnTriggerEnter");
    ButtonActivation.implementation = function (collider: any) {
        const rawName = this.method("get_name").invoke().toString();

        if (rawName.length > 1 && rawName[1] == "@") {
            if (collider.handle.equals(referenceCollider?.handle)) {
                const goName = rawName.substring(2, rawName.length - 1);
                const _time = Time.method("get_time").invoke();

                if (_time > buttonClickDelay) {
                    buttonClickDelay = _time + 0.2;

                    const button = getIndex(goName);
                    playButtonSound();
                    if (button) {
                        if (leftGrab) {
                            toggleFavorite(button);
                            reloadMenu();
                        } else {
                            if (button.isTogglable) {
                                button.enabled = !button.enabled;
                                reloadMenu();
                                if (button?.enabled) {
                                    if (button.toolTip && buttonNotifications)
                                        sendNotification("<color=grey>[</color><color=green>ENABLE</color><color=grey>]</color> " + button.toolTip, false);
                                    button.enableMethod?.();
                                } else {
                                    if (button.toolTip && buttonNotifications)
                                        sendNotification("<color=grey>[</color><color=red>DISABLE</color><color=grey>]</color> " + button.toolTip, false);
                                    button?.disableMethod?.();
                                }
                            } else {
                                reloadMenu();
                                if (button.toolTip && buttonNotifications)
                                    sendNotification("<color=grey>[</color><color=green>ENABLE</color><color=grey>]</color> " + button.toolTip, false);
                                button?.method?.();
                            }
                            if (getCategoryIndex(button) == 7 && !enabledRecent)
                                loadEnabled();
                        }
                    }
                }
            }
            return;
        }

        return this.method("OnTriggerEnter").invoke(collider);
    };

    // Block item despawn limit
    const NetworkDestroyer = ItemManagerClass.method("NetworkDestroyer");
    NetworkDestroyer.implementation = function () {
        // Do nothing — prevents the game from destroying excess items
    };

    // Hook into PlayerVr.Update for the main loop
    const PlayerUpdate = PlayerVrClass.method("Update");
    PlayerUpdate.implementation = function () {
        // Read input via OVRInput (Oculus SDK)
        // Button.One=1 (A/X), Button.Two=2 (B/Y), Button.PrimaryIndexTrigger=8192, Button.PrimaryHandTrigger=16384
        // Controller.LTouch=1, Controller.RTouch=2
        try {
            xrUpdate();
            leftPrimary = xrButton(1, "PrimaryButton");
            leftSecondary = xrButton(1, "SecondaryButton");
            leftGrab = xrButton(1, "GripButton");
            leftTrigger = xrButton(1, "TriggerButton");

            rightPrimary = xrButton(2, "PrimaryButton");
            rightSecondary = xrButton(2, "SecondaryButton");
            rightGrab = xrButton(2, "GripButton");
            rightTrigger = xrButton(2, "TriggerButton");
        } catch(e: any) {
            if (frameCount < 5) console.error("[Input] XR error: " + e.message);
        }

        deltaTime = Time.method("get_deltaTime").invoke();
        time = Time.method("get_time").invoke();
        frameCount++;

        if (!spawnItemsScanned && frameCount % 60 === 0) scanSpawnItems();
        if (frameCount % 120 === 0) refreshTransforms();

        if (leftPrimary || rightSecondary) {
            if (currentNotification != "" && time > notifactionResetTime)
                reloadMenu();

            if (menu == null) {
                renderMenu();
            } else {
                recenterMenu();
            }
        } else {
            if (menu != null) {
                Destroy(menu);
                menu = null;
            }
        }

        if (menu == null) {
            if (reference != null) { Destroy(reference); reference = null; }
        } else {
            if (reference == null) renderReference();
        }

        try {
            if (GunPointer != null) {
                if (!(GunPointer.method("get_activeSelf").invoke())) {
                    Destroy(GunPointer);
                    GunPointer = null;
                } else {
                    GunPointer.method("SetActive").invoke(false);
                }
            }
            if (GunLine != null) {
                let lineObj = GunLine.method("get_gameObject").invoke();
                if (lineObj != null) {
                    if (!(lineObj.method("get_activeSelf").invoke())) {
                        Destroy(lineObj);
                        GunLine = null;
                    } else {
                        lineObj.method("SetActive").invoke(false);
                    }
                }
            }
        } catch(_) {}

        buttons.flat()
            .filter(button => button.enabled)
            .forEach(button => {
                if (button.method) {
                    try {
                        button.method();
                    } catch (error) {
                        console.error(`Error in mod '${button.buttonText}':`, error);
                    }
                }
            });

        return this.method("Update").invoke();
    };

    console.log(`
    Stuff Horror Menu v${version}
    Compiled ${new Date().toISOString()}
    `);
});
