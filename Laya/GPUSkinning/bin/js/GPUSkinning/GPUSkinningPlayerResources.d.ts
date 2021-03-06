import GPUSkinningAnimation from "./Datas/GPUSkinningAnimation";
import GPUSkinningPlayerMono from "./GPUSkinningPlayerMono";
import GPUSkinningMaterial from "./GPUSkinningMaterial";
import GPUSkinningPlayer from "./GPUSkinningPlayer";
import Material = Laya.Material;
import Mesh = Laya.Mesh;
import Texture2D = Laya.Texture2D;
import GPUSkinningClip from "./Datas/GPUSkinningClip";
import GPUSkinningFrame from "./Datas/GPUSkinningFrame";
import { MaterialState } from "./MaterialState";
import { GPUSkinningQuality } from "./Datas/GPUSkinningQuality";
export default class GPUSkinningPlayerResources {
    anim: GPUSkinningAnimation;
    mesh: Mesh;
    texture: Texture2D;
    players: GPUSkinningPlayerMono[];
    private cullingGroup;
    private cullingBounds;
    private mtrls;
    private executeOncePerFrame;
    private time;
    Time: float;
    private static keywords;
    private static keywordDefines;
    private static ShaderDefine_SKIN_1;
    private static ShaderDefine_SKIN_2;
    private static ShaderDefine_SKIN_4;
    private static shaderPropID_GPUSkinning_TextureMatrix;
    private static shaderPropID_GPUSkinning_TextureSize_NumPixelsPerFrame;
    static shaderPorpID_GPUSkinning_FrameIndex_PixelSegmentation: int;
    private static shaderPropID_GPUSkinning_RootMotion;
    static shaderPorpID_GPUSkinning_FrameIndex_PixelSegmentation_Blend_CrossFade: int;
    private static shaderPropID_GPUSkinning_RootMotion_CrossFade;
    private static _isInited;
    static Init(): void;
    constructor();
    Destroy(): void;
    AddCullingBounds(): void;
    RemoveCullingBounds(index: int): void;
    LODSettingChanged(player: GPUSkinningPlayer): void;
    private SetLODMeshByDistanceIndex;
    private UpdateCullingBounds;
    Update(deltaTime: float, mtrl: GPUSkinningMaterial): void;
    UpdatePlayingData(mpb: Laya.ShaderData, spriteShaderData: Laya.ShaderData, playingClip: GPUSkinningClip, frameIndex: int, frame: GPUSkinningFrame, rootMotionEnabled: boolean, lastPlayedClip: GPUSkinningClip, frameIndex_crossFade: int, crossFadeTime: float, crossFadeProgress: float): void;
    CrossFadeBlendFactor(crossFadeProgress: float, crossFadeTime: float): float;
    IsCrossFadeBlending(lastPlayedClip: GPUSkinningClip, crossFadeTime: float, crossFadeProgress: float): boolean;
    GetMaterial(state: MaterialState): GPUSkinningMaterial;
    InitMaterial(originalMaterial: Material, skinningQuality: GPUSkinningQuality): void;
    CloneMaterial(originalMaterial: Material, skinningQuality: GPUSkinningQuality): Material;
    private EnableKeywords;
}
