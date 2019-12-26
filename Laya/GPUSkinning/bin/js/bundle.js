(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    var Vector3 = Laya.Vector3;
    class TestScene extends Laya.Scene3D {
        static create() {
            let node = new TestScene();
            node.name = "WarScene";
            let scene = node;
            scene.init();
            return scene;
        }
        init() {
            window['warScene'] = this;
            this.initCamera();
        }
        initCamera() {
            var cameraRootNode = new Laya.Sprite3D("CameraRoot");
            var cameraRotationXNode = new Laya.Sprite3D("CameraRotationX");
            var camera = new Laya.Camera(0, 0.1, 1000);
            var screenLayer = new Laya.Sprite3D("ScreenLayer");
            cameraRootNode.addChild(cameraRotationXNode);
            cameraRotationXNode.addChild(camera);
            camera.addChild(screenLayer);
            cameraRotationXNode.transform.localRotationEulerX = -20;
            camera.transform.localPosition = new Vector3(0, 0, 200);
            camera.clearColor = new Laya.Vector4(0.2, 0.5, 0.8, 1);
            camera.orthographic = true;
            camera.orthographicVerticalSize = 5.2;
            camera.farPlane = 2000;
            this.camera = camera;
            this.cameraNode = cameraRootNode;
            this.screen3DLayer = screenLayer;
            let directionLight = this.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            this.lightRotaitonSrc = directionLight.transform.localRotationEuler = new Laya.Vector3(125, 68, 106);
            this.directionLight = directionLight;
            this.addChild(cameraRootNode);
            this.addChild(directionLight);
        }
        lightRotaitonStart() {
            this.lightRotaiton = this.directionLight.transform.localRotationEuler;
            Laya.timer.frameLoop(1, this, this.onLightRotaitonLoop);
        }
        lightRotaitonStop() {
            this.directionLight.transform.localRotationEuler = this.lightRotaitonSrc;
            Laya.timer.clear(this, this.onLightRotaitonLoop);
        }
        onLightRotaitonLoop() {
            this.lightRotaiton.x += 1;
            this.lightRotaiton.y += 2;
            this.lightRotaiton.z += 2;
            this.directionLight.transform.localRotationEuler = this.lightRotaiton;
        }
    }

    class MBaseMaterial extends Laya.Material {
        static getShaderVS(filename) {
            return this.SHADER_PATH_ROOT + filename + ".vs";
        }
        static getShaderPS(filename) {
            return this.SHADER_PATH_ROOT + filename + ".fs";
        }
        static loadShaderVSAsync(filename) {
            return __awaiter(this, void 0, void 0, function* () {
                let code = yield this.loadAsync(this.getShaderVS(filename), Laya.Loader.TEXT);
                return code.replace(/\r/g, "");
            });
        }
        static loadShaderPSAsync(filename) {
            return __awaiter(this, void 0, void 0, function* () {
                let code = yield this.loadAsync(this.getShaderPS(filename), Laya.Loader.TEXT);
                return code.replace(/\r/g, "");
            });
        }
        static loadAsync(path, type) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    Laya.loader.load(path, Laya.Handler.create(null, (res) => {
                        resolve(res);
                    }), null, type);
                });
            });
        }
    }
    MBaseMaterial.SHADER_PATH_ROOT = "res/shaders/";

    var Shader3D = Laya.Shader3D;
    var SubShader = Laya.SubShader;
    var VertexMesh = Laya.VertexMesh;
    var BaseMaterial = Laya.BaseMaterial;
    var Vector4 = Laya.Vector4;
    var RenderState = Laya.RenderState;
    var Scene3DShaderDeclaration = Laya.Scene3DShaderDeclaration;
    class Cartoon2Material extends MBaseMaterial {
        constructor() {
            super();
            this._enableVertexColor = false;
            this._enableVertexColor = false;
            this.setShaderName(Cartoon2Material.shaderName);
            this._albedoIntensity = 1.0;
            this._albedoColor = new Vector4(1.0, 1.0, 1.0, 1.0);
            this._shadowColor = new Vector4(0.1764706, 0.1764706, 0.1764706, 1.0);
            var sv = this._shaderValues;
            sv.setVector(Cartoon2Material.ALBEDOCOLOR, new Vector4(1.0, 1.0, 1.0, 1.0));
            sv.setVector(Cartoon2Material.MATERIALSPECULAR, new Vector4(1.0, 1.0, 1.0, 1.0));
            sv.setNumber(Cartoon2Material.SHININESS, 0.078125);
            sv.setVector(Cartoon2Material.SHADOWCOLOR, new Vector4(0.1764706, 0.1764706, 0.1764706, 1.0));
            sv.setNumber(Cartoon2Material.COLOR_RANGE, 88.4);
            sv.setNumber(Cartoon2Material.COLOR_DEEP, 0.08);
            sv.setNumber(Cartoon2Material.OUTLINE_WIDTH, 0.004);
            sv.setNumber(BaseMaterial.ALPHATESTVALUE, 0.5);
            sv.setVector(Cartoon2Material.TILINGOFFSET, new Vector4(1.0, 1.0, 0.0, 0.0));
            this._enableLighting = true;
            this.renderMode = Cartoon2Material.RENDERMODE_OPAQUE;
        }
        static install() {
            return __awaiter(this, void 0, void 0, function* () {
                this.__initDefine__();
                yield this.initShader();
                this.defaultMaterial = new Cartoon2Material();
                this.defaultMaterial.enableLighting = true;
                this.defaultMaterial.lock = true;
            });
        }
        static initShader() {
            return __awaiter(this, void 0, void 0, function* () {
                var outlineVS = yield this.loadShaderVSAsync("Cartoon2OutlineShader");
                var outlinePS = yield this.loadShaderPSAsync("Cartoon2OutlineShader");
                var vs = yield this.loadShaderVSAsync(this.shaderName);
                var ps = yield this.loadShaderPSAsync(this.shaderName);
                var attributeMap;
                var uniformMap;
                var stateMap;
                var shader;
                var subShader;
                attributeMap =
                    {
                        'a_Position': VertexMesh.MESH_POSITION0,
                        'a_Color': VertexMesh.MESH_COLOR0,
                        'a_Normal': VertexMesh.MESH_NORMAL0,
                        'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0,
                        'a_Texcoord1': VertexMesh.MESH_TEXTURECOORDINATE1,
                        'a_BoneWeights': VertexMesh.MESH_BLENDWEIGHT0,
                        'a_BoneIndices': VertexMesh.MESH_BLENDINDICES0,
                        'a_Tangent0': VertexMesh.MESH_TANGENT0,
                        'a_MvpMatrix': VertexMesh.MESH_MVPMATRIX_ROW0,
                        'a_WorldMat': VertexMesh.MESH_WORLDMATRIX_ROW0
                    };
                uniformMap =
                    {
                        'u_Bones': Shader3D.PERIOD_CUSTOM,
                        'u_DiffuseTexture': Shader3D.PERIOD_MATERIAL,
                        'u_SpecularTexture': Shader3D.PERIOD_MATERIAL,
                        'u_NormalTexture': Shader3D.PERIOD_MATERIAL,
                        'u_AlphaTestValue': Shader3D.PERIOD_MATERIAL,
                        'u_DiffuseColor': Shader3D.PERIOD_MATERIAL,
                        'u_ShadowColor': Shader3D.PERIOD_MATERIAL,
                        'u_MaterialSpecular': Shader3D.PERIOD_MATERIAL,
                        'u_Shininess': Shader3D.PERIOD_MATERIAL,
                        'u_ColorRange': Shader3D.PERIOD_MATERIAL,
                        'u_ColorDeep': Shader3D.PERIOD_MATERIAL,
                        'u_OutlineWidth': Shader3D.PERIOD_MATERIAL,
                        'u_TilingOffset': Shader3D.PERIOD_MATERIAL,
                        'u_WorldMat': Shader3D.PERIOD_SPRITE,
                        'u_MvpMatrix': Shader3D.PERIOD_SPRITE,
                        'u_LightmapScaleOffset': Shader3D.PERIOD_SPRITE,
                        'u_LightMap': Shader3D.PERIOD_SPRITE,
                        'u_CameraPos': Shader3D.PERIOD_CAMERA,
                        'u_Viewport': Shader3D.PERIOD_CAMERA,
                        'u_ProjectionParams': Shader3D.PERIOD_CAMERA,
                        'u_View': Shader3D.PERIOD_CAMERA,
                        'u_ReflectTexture': Shader3D.PERIOD_SCENE,
                        'u_ReflectIntensity': Shader3D.PERIOD_SCENE,
                        'u_FogStart': Shader3D.PERIOD_SCENE,
                        'u_FogRange': Shader3D.PERIOD_SCENE,
                        'u_FogColor': Shader3D.PERIOD_SCENE,
                        'u_DirationLightCount': Shader3D.PERIOD_SCENE,
                        'u_LightBuffer': Shader3D.PERIOD_SCENE,
                        'u_LightClusterBuffer': Shader3D.PERIOD_SCENE,
                        'u_AmbientColor': Shader3D.PERIOD_SCENE,
                        'u_shadowMap1': Shader3D.PERIOD_SCENE,
                        'u_shadowMap2': Shader3D.PERIOD_SCENE,
                        'u_shadowMap3': Shader3D.PERIOD_SCENE,
                        'u_shadowPSSMDistance': Shader3D.PERIOD_SCENE,
                        'u_lightShadowVP': Shader3D.PERIOD_SCENE,
                        'u_shadowPCFoffset': Shader3D.PERIOD_SCENE,
                        'u_DirectionLight.color': Shader3D.PERIOD_SCENE,
                        'u_DirectionLight.direction': Shader3D.PERIOD_SCENE,
                        'u_PointLight.position': Shader3D.PERIOD_SCENE,
                        'u_PointLight.range': Shader3D.PERIOD_SCENE,
                        'u_PointLight.color': Shader3D.PERIOD_SCENE,
                        'u_SpotLight.position': Shader3D.PERIOD_SCENE,
                        'u_SpotLight.direction': Shader3D.PERIOD_SCENE,
                        'u_SpotLight.range': Shader3D.PERIOD_SCENE,
                        'u_SpotLight.spot': Shader3D.PERIOD_SCENE,
                        'u_SpotLight.color': Shader3D.PERIOD_SCENE
                    };
                stateMap =
                    {
                        's_Cull': Shader3D.RENDER_STATE_CULL,
                        's_Blend': Shader3D.RENDER_STATE_BLEND,
                        's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
                        's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
                        's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
                        's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
                    };
                shader = Shader3D.add(this.shaderName, null, null, true);
                subShader = new SubShader(attributeMap, uniformMap);
                shader.addSubShader(subShader);
                var outlinePass = subShader.addShaderPass(outlineVS, outlinePS);
                outlinePass.renderState.cull = Laya.RenderState.CULL_FRONT;
                var mainPass = subShader.addShaderPass(vs, ps, stateMap);
                mainPass.renderState.cull = Laya.RenderState.CULL_NONE;
            });
        }
        static __initDefine__() {
            this.SHADERDEFINE_DIFFUSEMAP = Shader3D.getDefineByName("DIFFUSEMAP");
            this.SHADERDEFINE_NORMALMAP = Shader3D.getDefineByName("NORMALMAP");
            this.SHADERDEFINE_SPECULARMAP = Shader3D.getDefineByName("SPECULARMAP");
            this.SHADERDEFINE_TILINGOFFSET = Shader3D.getDefineByName("TILINGOFFSET");
            this.SHADERDEFINE_ENABLEVERTEXCOLOR = Shader3D.getDefineByName("ENABLEVERTEXCOLOR");
        }
        get _ColorR() {
            return this._albedoColor.x;
        }
        set _ColorR(value) {
            this._albedoColor.x = value;
            this.albedoColor = this._albedoColor;
        }
        get _ColorG() {
            return this._albedoColor.y;
        }
        set _ColorG(value) {
            this._albedoColor.y = value;
            this.albedoColor = this._albedoColor;
        }
        get _ColorB() {
            return this._albedoColor.z;
        }
        set _ColorB(value) {
            this._albedoColor.z = value;
            this.albedoColor = this._albedoColor;
        }
        get _ColorA() {
            return this._albedoColor.w;
        }
        set _ColorA(value) {
            this._albedoColor.w = value;
            this.albedoColor = this._albedoColor;
        }
        get _SpecColorR() {
            return this._shaderValues.getVector(Cartoon2Material.MATERIALSPECULAR).x;
        }
        set _SpecColorR(value) {
            this._shaderValues.getVector(Cartoon2Material.MATERIALSPECULAR).x = value;
        }
        get _SpecColorG() {
            return this._shaderValues.getVector(Cartoon2Material.MATERIALSPECULAR).y;
        }
        set _SpecColorG(value) {
            this._shaderValues.getVector(Cartoon2Material.MATERIALSPECULAR).y = value;
        }
        get _SpecColorB() {
            return this._shaderValues.getVector(Cartoon2Material.MATERIALSPECULAR).z;
        }
        set _SpecColorB(value) {
            this._shaderValues.getVector(Cartoon2Material.MATERIALSPECULAR).z = value;
        }
        get _SpecColorA() {
            return this._shaderValues.getVector(Cartoon2Material.MATERIALSPECULAR).w;
        }
        set _SpecColorA(value) {
            this._shaderValues.getVector(Cartoon2Material.MATERIALSPECULAR).w = value;
        }
        get _AlbedoIntensity() {
            return this._albedoIntensity;
        }
        set _AlbedoIntensity(value) {
            if (this._albedoIntensity !== value) {
                var finalAlbedo = this._shaderValues.getVector(Cartoon2Material.ALBEDOCOLOR);
                Vector4.scale(this._albedoColor, value, finalAlbedo);
                this._albedoIntensity = value;
                this._shaderValues.setVector(Cartoon2Material.ALBEDOCOLOR, finalAlbedo);
            }
        }
        get _Shininess() {
            return this._shaderValues.getNumber(Cartoon2Material.SHININESS);
        }
        set _Shininess(value) {
            value = Math.max(0.0, Math.min(1.0, value));
            this._shaderValues.setNumber(Cartoon2Material.SHININESS, value);
        }
        get _ColorRange() {
            return this._shaderValues.getNumber(Cartoon2Material.COLOR_RANGE);
        }
        set _ColorRange(value) {
            value = Math.max(-1.0, Math.min(100.0, value));
            this._shaderValues.setNumber(Cartoon2Material.COLOR_RANGE, value);
        }
        get _ColorDeep() {
            return this._shaderValues.getNumber(Cartoon2Material.COLOR_DEEP);
        }
        set _ColorDeep(value) {
            value = Math.max(0.0, Math.min(2, value));
            this._shaderValues.setNumber(Cartoon2Material.COLOR_DEEP, value);
        }
        get _OutlineWidth() {
            return this._shaderValues.getNumber(Cartoon2Material.OUTLINE_WIDTH);
        }
        set _OutlineWidth(value) {
            this._shaderValues.setNumber(Cartoon2Material.OUTLINE_WIDTH, value);
        }
        get _MainTex_STX() {
            return this._shaderValues.getVector(Cartoon2Material.TILINGOFFSET).x;
        }
        set _MainTex_STX(x) {
            var tilOff = this._shaderValues.getVector(Cartoon2Material.TILINGOFFSET);
            tilOff.x = x;
            this.tilingOffset = tilOff;
        }
        get _MainTex_STY() {
            return this._shaderValues.getVector(Cartoon2Material.TILINGOFFSET).y;
        }
        set _MainTex_STY(y) {
            var tilOff = this._shaderValues.getVector(Cartoon2Material.TILINGOFFSET);
            tilOff.y = y;
            this.tilingOffset = tilOff;
        }
        get _MainTex_STZ() {
            return this._shaderValues.getVector(Cartoon2Material.TILINGOFFSET).z;
        }
        set _MainTex_STZ(z) {
            var tilOff = this._shaderValues.getVector(Cartoon2Material.TILINGOFFSET);
            tilOff.z = z;
            this.tilingOffset = tilOff;
        }
        get _MainTex_STW() {
            return this._shaderValues.getVector(Cartoon2Material.TILINGOFFSET).w;
        }
        set _MainTex_STW(w) {
            var tilOff = this._shaderValues.getVector(Cartoon2Material.TILINGOFFSET);
            tilOff.w = w;
            this.tilingOffset = tilOff;
        }
        get _Cutoff() {
            return this.alphaTestValue;
        }
        set _Cutoff(value) {
            this.alphaTestValue = value;
        }
        set renderMode(value) {
            switch (value) {
                case Cartoon2Material.RENDERMODE_OPAQUE:
                    this.alphaTest = false;
                    this.renderQueue = BaseMaterial.RENDERQUEUE_OPAQUE;
                    this.depthWrite = true;
                    this.cull = RenderState.CULL_BACK;
                    this.blend = RenderState.BLEND_DISABLE;
                    this.depthTest = RenderState.DEPTHTEST_LESS;
                    break;
                case Cartoon2Material.RENDERMODE_CUTOUT:
                    this.renderQueue = BaseMaterial.RENDERQUEUE_ALPHATEST;
                    this.alphaTest = true;
                    this.depthWrite = true;
                    this.cull = RenderState.CULL_BACK;
                    this.blend = RenderState.BLEND_DISABLE;
                    this.depthTest = RenderState.DEPTHTEST_LESS;
                    break;
                case Cartoon2Material.RENDERMODE_TRANSPARENT:
                    this.renderQueue = BaseMaterial.RENDERQUEUE_TRANSPARENT;
                    this.alphaTest = false;
                    this.depthWrite = false;
                    this.cull = RenderState.CULL_BACK;
                    this.blend = RenderState.BLEND_ENABLE_ALL;
                    this.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
                    this.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
                    this.depthTest = RenderState.DEPTHTEST_LESS;
                    break;
                default:
                    throw new Error("Material:renderMode value error.");
            }
        }
        get enableVertexColor() {
            return this._enableVertexColor;
        }
        set enableVertexColor(value) {
            this._enableVertexColor = value;
            if (value)
                this._shaderValues.addDefine(Cartoon2Material.SHADERDEFINE_ENABLEVERTEXCOLOR);
            else
                this._shaderValues.removeDefine(Cartoon2Material.SHADERDEFINE_ENABLEVERTEXCOLOR);
        }
        get tilingOffsetX() {
            return this._MainTex_STX;
        }
        set tilingOffsetX(x) {
            this._MainTex_STX = x;
        }
        get tilingOffsetY() {
            return this._MainTex_STY;
        }
        set tilingOffsetY(y) {
            this._MainTex_STY = y;
        }
        get tilingOffsetZ() {
            return this._MainTex_STZ;
        }
        set tilingOffsetZ(z) {
            this._MainTex_STZ = z;
        }
        get tilingOffsetW() {
            return this._MainTex_STW;
        }
        set tilingOffsetW(w) {
            this._MainTex_STW = w;
        }
        get tilingOffset() {
            return this._shaderValues.getVector(Cartoon2Material.TILINGOFFSET);
        }
        set tilingOffset(value) {
            if (value) {
                if (value.x != 1 || value.y != 1 || value.z != 0 || value.w != 0)
                    this._shaderValues.addDefine(Cartoon2Material.SHADERDEFINE_TILINGOFFSET);
                else
                    this._shaderValues.removeDefine(Cartoon2Material.SHADERDEFINE_TILINGOFFSET);
            }
            else {
                this._shaderValues.removeDefine(Cartoon2Material.SHADERDEFINE_TILINGOFFSET);
            }
            this._shaderValues.setVector(Cartoon2Material.TILINGOFFSET, value);
        }
        get albedoColorR() {
            return this._ColorR;
        }
        set albedoColorR(value) {
            this._ColorR = value;
        }
        get albedoColorG() {
            return this._ColorG;
        }
        set albedoColorG(value) {
            this._ColorG = value;
        }
        get albedoColorB() {
            return this._ColorB;
        }
        set albedoColorB(value) {
            this._ColorB = value;
        }
        get albedoColorA() {
            return this._ColorA;
        }
        set albedoColorA(value) {
            this._ColorA = value;
        }
        get albedoColor() {
            return this._albedoColor;
        }
        set albedoColor(value) {
            var finalAlbedo = this._shaderValues.getVector(Cartoon2Material.ALBEDOCOLOR);
            Vector4.scale(value, this._albedoIntensity, finalAlbedo);
            this._albedoColor = value;
            this._shaderValues.setVector(Cartoon2Material.ALBEDOCOLOR, finalAlbedo);
        }
        get shadowColor() {
            return this._shadowColor;
        }
        set shadowColor(value) {
            this._albedoColor = value;
            this._shaderValues.setVector(Cartoon2Material.ALBEDOCOLOR, value);
        }
        get albedoIntensity() {
            return this._albedoIntensity;
        }
        set albedoIntensity(value) {
            this._AlbedoIntensity = value;
        }
        get specularColorR() {
            return this._SpecColorR;
        }
        set specularColorR(value) {
            this._SpecColorR = value;
        }
        get specularColorG() {
            return this._SpecColorG;
        }
        set specularColorG(value) {
            this._SpecColorG = value;
        }
        get specularColorB() {
            return this._SpecColorB;
        }
        set specularColorB(value) {
            this._SpecColorB = value;
        }
        get specularColorA() {
            return this._SpecColorA;
        }
        set specularColorA(value) {
            this._SpecColorA = value;
        }
        get specularColor() {
            return this._shaderValues.getVector(Cartoon2Material.MATERIALSPECULAR);
        }
        set specularColor(value) {
            this._shaderValues.setVector(Cartoon2Material.MATERIALSPECULAR, value);
        }
        get shininess() {
            return this._Shininess;
        }
        set shininess(value) {
            this._Shininess = value;
        }
        get albedoTexture() {
            return this._shaderValues.getTexture(Cartoon2Material.ALBEDOTEXTURE);
        }
        set albedoTexture(value) {
            if (value)
                this._shaderValues.addDefine(Cartoon2Material.SHADERDEFINE_DIFFUSEMAP);
            else
                this._shaderValues.removeDefine(Cartoon2Material.SHADERDEFINE_DIFFUSEMAP);
            this._shaderValues.setTexture(Cartoon2Material.ALBEDOTEXTURE, value);
        }
        get normalTexture() {
            return this._shaderValues.getTexture(Cartoon2Material.NORMALTEXTURE);
        }
        set normalTexture(value) {
            if (value)
                this._shaderValues.addDefine(Cartoon2Material.SHADERDEFINE_NORMALMAP);
            else
                this._shaderValues.removeDefine(Cartoon2Material.SHADERDEFINE_NORMALMAP);
            this._shaderValues.setTexture(Cartoon2Material.NORMALTEXTURE, value);
        }
        get specularTexture() {
            return this._shaderValues.getTexture(Cartoon2Material.SPECULARTEXTURE);
        }
        set specularTexture(value) {
            if (value)
                this._shaderValues.addDefine(Cartoon2Material.SHADERDEFINE_SPECULARMAP);
            else
                this._shaderValues.removeDefine(Cartoon2Material.SHADERDEFINE_SPECULARMAP);
            this._shaderValues.setTexture(Cartoon2Material.SPECULARTEXTURE, value);
        }
        get enableLighting() {
            return this._enableLighting;
        }
        set enableLighting(value) {
            if (this._enableLighting !== value) {
                if (value) {
                    this._disablePublicDefineDatas.remove(Scene3DShaderDeclaration.SHADERDEFINE_POINTLIGHT);
                    this._disablePublicDefineDatas.remove(Scene3DShaderDeclaration.SHADERDEFINE_SPOTLIGHT);
                    this._disablePublicDefineDatas.remove(Scene3DShaderDeclaration.SHADERDEFINE_DIRECTIONLIGHT);
                }
                else {
                    this._disablePublicDefineDatas.add(Scene3DShaderDeclaration.SHADERDEFINE_POINTLIGHT);
                    this._disablePublicDefineDatas.add(Scene3DShaderDeclaration.SHADERDEFINE_SPOTLIGHT);
                    this._disablePublicDefineDatas.add(Scene3DShaderDeclaration.SHADERDEFINE_DIRECTIONLIGHT);
                }
                this._enableLighting = value;
            }
        }
        set depthWrite(value) {
            this._shaderValues.setBool(Cartoon2Material.DEPTH_WRITE, value);
        }
        get depthWrite() {
            return this._shaderValues.getBool(Cartoon2Material.DEPTH_WRITE);
        }
        set cull(value) {
            this._shaderValues.setInt(Cartoon2Material.CULL, value);
        }
        get cull() {
            return this._shaderValues.getInt(Cartoon2Material.CULL);
        }
        set blend(value) {
            this._shaderValues.setInt(Cartoon2Material.BLEND, value);
        }
        get blend() {
            return this._shaderValues.getInt(Cartoon2Material.BLEND);
        }
        set blendSrc(value) {
            this._shaderValues.setInt(Cartoon2Material.BLEND_SRC, value);
        }
        get blendSrc() {
            return this._shaderValues.getInt(Cartoon2Material.BLEND_SRC);
        }
        set blendDst(value) {
            this._shaderValues.setInt(Cartoon2Material.BLEND_DST, value);
        }
        get blendDst() {
            return this._shaderValues.getInt(Cartoon2Material.BLEND_DST);
        }
        set depthTest(value) {
            this._shaderValues.setInt(Cartoon2Material.DEPTH_TEST, value);
        }
        get depthTest() {
            return this._shaderValues.getInt(Cartoon2Material.DEPTH_TEST);
        }
        clone() {
            var dest = new Cartoon2Material();
            this.cloneTo(dest);
            return dest;
        }
        cloneTo(destObject) {
            super.cloneTo(destObject);
            var destMaterial = destObject;
            destMaterial._enableLighting = this._enableLighting;
            destMaterial._albedoIntensity = this._albedoIntensity;
            destMaterial._enableVertexColor = this._enableVertexColor;
            this._albedoColor.cloneTo(destMaterial._albedoColor);
        }
    }
    Cartoon2Material.shaderName = "Cartoon2Shader";
    Cartoon2Material.RENDERMODE_OPAQUE = 0;
    Cartoon2Material.RENDERMODE_CUTOUT = 1;
    Cartoon2Material.RENDERMODE_TRANSPARENT = 2;
    Cartoon2Material.ALBEDOTEXTURE = Shader3D.propertyNameToID("u_DiffuseTexture");
    Cartoon2Material.NORMALTEXTURE = Shader3D.propertyNameToID("u_NormalTexture");
    Cartoon2Material.SPECULARTEXTURE = Shader3D.propertyNameToID("u_SpecularTexture");
    Cartoon2Material.ALBEDOCOLOR = Shader3D.propertyNameToID("u_DiffuseColor");
    Cartoon2Material.SHADOWCOLOR = Shader3D.propertyNameToID("u_ShadowColor");
    Cartoon2Material.MATERIALSPECULAR = Shader3D.propertyNameToID("u_MaterialSpecular");
    Cartoon2Material.SHININESS = Shader3D.propertyNameToID("u_Shininess");
    Cartoon2Material.COLOR_RANGE = Shader3D.propertyNameToID("u_ColorRange");
    Cartoon2Material.COLOR_DEEP = Shader3D.propertyNameToID("u_ColorDeep");
    Cartoon2Material.OUTLINE_WIDTH = Shader3D.propertyNameToID("u_OutlineWidth");
    Cartoon2Material.TILINGOFFSET = Shader3D.propertyNameToID("u_TilingOffset");
    Cartoon2Material.CULL = Shader3D.propertyNameToID("s_Cull");
    Cartoon2Material.BLEND = Shader3D.propertyNameToID("s_Blend");
    Cartoon2Material.BLEND_SRC = Shader3D.propertyNameToID("s_BlendSrc");
    Cartoon2Material.BLEND_DST = Shader3D.propertyNameToID("s_BlendDst");
    Cartoon2Material.DEPTH_TEST = Shader3D.propertyNameToID("s_DepthTest");
    Cartoon2Material.DEPTH_WRITE = Shader3D.propertyNameToID("s_DepthWrite");

    var Shader3D$1 = Laya.Shader3D;
    class MaterialInstall {
        static install() {
            return __awaiter(this, void 0, void 0, function* () {
                yield Cartoon2Material.install();
            });
        }
        static initShader() {
            return __awaiter(this, void 0, void 0, function* () {
            });
        }
        static exportShaderVariantCollection() {
            let shaderObj = {};
            let arr;
            for (let i = 0; i < Shader3D$1.debugShaderVariantCollection.variantCount; i++) {
                let shadervariant = Shader3D$1.debugShaderVariantCollection.getByIndex(i);
                let shaderName = shadervariant.shader.name;
                if (!shaderObj[shaderName])
                    shaderObj[shaderName] = [];
                arr = shaderObj[shaderName];
                let obj = {};
                obj.defineNames = shadervariant.defineNames;
                obj.passIndex = shadervariant.passIndex;
                obj.subShaderIndex = shadervariant.subShaderIndex;
                arr.push(obj);
            }
            let json = JSON.stringify(shaderObj, null, 4);
            console.log(json);
        }
    }
    window['MaterialInstall'] = MaterialInstall;

    class TestShader {
        constructor() {
            this.scene = TestScene.create();
            Laya.stage.addChild(this.scene);
            this.InitAsync();
        }
        InitAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                yield MaterialInstall.install();
                this.TestPrefab();
            });
        }
        TestPrefab() {
            let box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
            box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            var meshRenderer = box.meshRenderer;
            let material = new Cartoon2Material();
            material.enableLighting = true;
            meshRenderer.material = material;
            this.scene.addChild(box);
        }
        GetPathByResId(resId) {
            return TestShader.Res3DRoot + resId + ".lh";
        }
        loadPrefab() {
            return __awaiter(this, void 0, void 0, function* () {
                yield MaterialInstall.install();
                let prefabName = "Hero_1001_Dianguanglongqi_Skin1";
                let path = this.GetPathByResId(prefabName);
                let res = yield this.Load3DAsync(path);
                let node1 = this.createRole(res);
                let node2 = this.createRole(res);
                node2.transform.localPositionX = 2;
                node2.transform.localScaleX = -1;
                var modelNode1 = node1.getChildByName("model");
                var modelNode2 = node2.getChildByName("model");
                let animator1 = modelNode1.getComponent(Laya.Animator);
                let animator2 = modelNode2.getComponent(Laya.Animator);
                Laya.timer.loop(3000, this, () => {
                    animator1.play(Math.random() > 0.5 ? "RUN" : "IDLE");
                    modelNode1.transform.localScaleX *= -1;
                });
                Laya.timer.loop(4000, this, () => {
                    modelNode2.transform.localScaleX *= -1;
                    animator2.play(Math.random() > 0.5 ? "RUN" : "IDLE");
                });
            });
        }
        createRole(res) {
            let node = res.clone();
            node.transform.position = new Laya.Vector3(0, 0, 0);
            window['node'] = node;
            var modelNode = node.getChildByName("model");
            let animator = modelNode.getComponent(Laya.Animator);
            let skinnedMeshSprite3D = (modelNode.getChildAt(1));
            if (!(skinnedMeshSprite3D instanceof Laya.SkinnedMeshSprite3D)) {
                skinnedMeshSprite3D = (modelNode.getChildAt(0));
            }
            let meshRenderer = skinnedMeshSprite3D.skinnedMeshRenderer;
            let unlitMaterial = meshRenderer.material;
            let material = new Cartoon2Material();
            material.enableLighting = true;
            material.albedoTexture = unlitMaterial.albedoTexture;
            meshRenderer.material = material;
            this.scene.addChild(node);
            animator.play("IDLE");
            return node;
        }
        Load3DAsync(path) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    Laya.loader.create(path, Laya.Handler.create(null, (res) => {
                        resolve(res);
                    }));
                });
            });
        }
    }
    TestShader.Res3DRoot = "res3d/Conventional/";

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    var GPUSKinningCullingMode;
    (function (GPUSKinningCullingMode) {
        GPUSKinningCullingMode[GPUSKinningCullingMode["AlwaysAnimate"] = 0] = "AlwaysAnimate";
        GPUSKinningCullingMode[GPUSKinningCullingMode["CullUpdateTransforms"] = 1] = "CullUpdateTransforms";
        GPUSKinningCullingMode[GPUSKinningCullingMode["CullCompletely"] = 2] = "CullCompletely";
    })(GPUSKinningCullingMode || (GPUSKinningCullingMode = {}));

    class GPUSkinningBetterList {
        constructor(bufferIncrement) {
            this.size = 0;
            this.bufferIncrement = 0;
            this.bufferIncrement = Math.max(1, bufferIncrement);
        }
        Get(i) {
            return this.buffer[i];
        }
        Set(i, value) {
            this.buffer[i] = value;
        }
        AllocateMore() {
            let newList = (this.buffer != null)
                ? new Array(this.buffer.length + this.bufferIncrement)
                : new Array(this.bufferIncrement);
            if (this.buffer != null && this.size > 0) {
                arrayCopyValue(this.buffer, newList, false);
            }
            this.buffer = newList;
        }
        Clear() {
            this.size = 0;
        }
        Release() {
            this.size = 0;
            this.buffer = null;
        }
        Add(item) {
            if (this.buffer == null || this.size == this.buffer.length) {
                this.AllocateMore();
            }
            this.buffer[this.size++] = item;
        }
        AddRange(items) {
            if (items == null) {
                return;
            }
            let length = items.length;
            if (length == 0) {
                return;
            }
            if (this.buffer == null) {
                this.buffer = new Array(Math.max(this.bufferIncrement, length));
                arrayCopyValue(items, this.buffer, false);
                this.size = length;
            }
            else {
                if (this.size + length > this.buffer.length) {
                    let newList = new Array(Math.max(this.buffer.length + this.bufferIncrement, this.size + length));
                    arrayCopyValue(this.buffer, newList, false);
                    this.buffer = newList;
                    for (var i = 0; i < length; i++) {
                        this.buffer[this.size + i] = items[i];
                    }
                }
                else {
                    for (var i = 0; i < length; i++) {
                        this.buffer[this.size + i] = items[i];
                    }
                }
                this.size += length;
            }
        }
        RemoveAt(index) {
            if (this.buffer != null && index > -1 && index < this.size) {
                this.size--;
                this.buffer[index] = null;
                for (let b = index; b < this.size; ++b) {
                    this.buffer[b] = this.buffer[b + 1];
                }
                this.buffer[this.size] = null;
            }
        }
        Pop() {
            if (this.buffer == null || this.size == 0) {
                return null;
            }
            --this.size;
            let t = this.buffer[this.size];
            this.buffer[this.size] = null;
            return t;
        }
        Peek() {
            if (this.buffer == null || this.size == 0) {
                return null;
            }
            return this.buffer[this.size - 1];
        }
    }

    class GPUSkinningExecuteOncePerFrame {
        constructor() {
            this.frameCount = -1;
        }
        CanBeExecute() {
            return this.frameCount != Laya.timer.currFrame;
        }
        MarkAsExecuted() {
            this.frameCount = Laya.timer.currFrame;
        }
    }

    class GPUSkinningMaterial {
        constructor() {
            this.executeOncePerFrame = new GPUSkinningExecuteOncePerFrame();
        }
        Destroy() {
            if (this.material) {
                this.material.destroy();
                this.material = null;
            }
        }
    }

    var MaterialState;
    (function (MaterialState) {
        MaterialState[MaterialState["RootOn_BlendOff"] = 0] = "RootOn_BlendOff";
        MaterialState[MaterialState["RootOn_BlendOn_CrossFadeRootOn"] = 1] = "RootOn_BlendOn_CrossFadeRootOn";
        MaterialState[MaterialState["RootOn_BlendOn_CrossFadeRootOff"] = 2] = "RootOn_BlendOn_CrossFadeRootOff";
        MaterialState[MaterialState["RootOff_BlendOff"] = 3] = "RootOff_BlendOff";
        MaterialState[MaterialState["RootOff_BlendOn_CrossFadeRootOn"] = 4] = "RootOff_BlendOn_CrossFadeRootOn";
        MaterialState[MaterialState["RootOff_BlendOn_CrossFadeRootOff"] = 5] = "RootOff_BlendOn_CrossFadeRootOff";
        MaterialState[MaterialState["Count"] = 6] = "Count";
    })(MaterialState || (MaterialState = {}));

    var BoundSphere = Laya.BoundSphere;
    var Vector4$1 = Laya.Vector4;
    var Vector3$1 = Laya.Vector3;
    class GPUSkinningPlayerResources {
        constructor() {
            this.anim = null;
            this.mesh = null;
            this.players = [];
            this.cullingGroup = null;
            this.cullingBounds = new GPUSkinningBetterList(100);
            this.mtrls = null;
            this.executeOncePerFrame = new GPUSkinningExecuteOncePerFrame();
            this.time = 0;
            GPUSkinningPlayerResources.Init();
        }
        get Time() {
            return this.time;
        }
        set Time(value) {
            this.time = value;
        }
        static Init() {
            if (this._isInited)
                return;
            this._isInited = true;
            this.shaderPropID_GPUSkinning_TextureMatrix = Laya.Shader3D.propertyNameToID("_GPUSkinning_TextureMatrix");
            this.shaderPropID_GPUSkinning_TextureSize_NumPixelsPerFrame = Laya.Shader3D.propertyNameToID("_GPUSkinning_TextureSize_NumPixelsPerFrame");
            this.shaderPorpID_GPUSkinning_FrameIndex_PixelSegmentation = Laya.Shader3D.propertyNameToID("_GPUSkinning_FrameIndex_PixelSegmentation");
            this.shaderPropID_GPUSkinning_RootMotion = Laya.Shader3D.propertyNameToID("_GPUSkinning_RootMotion");
            this.shaderPorpID_GPUSkinning_FrameIndex_PixelSegmentation_Blend_CrossFade = Laya.Shader3D.propertyNameToID("_GPUSkinning_FrameIndex_PixelSegmentation_Blend_CrossFade");
            this.shaderPropID_GPUSkinning_RootMotion_CrossFade = Laya.Shader3D.propertyNameToID("_GPUSkinning_RootMotion_CrossFade");
        }
        Destroy() {
            this.anim = null;
            this.mesh = null;
            if (this.mtrls != null) {
                for (let i = 0; i < this.mtrls.length; i++) {
                    this.mtrls[i].Destroy();
                    this.mtrls[i] = null;
                }
                this.mtrls = null;
            }
            if (this.texture != null) {
                this.texture.destroy();
                this.texture = null;
            }
            if (this.players != null) {
                this.players.length = 0;
                this.players = null;
            }
        }
        AddCullingBounds() {
            this.cullingBounds.Add(new BoundSphere(new Vector3$1(0, 0, 0), 0));
        }
        RemoveCullingBounds(index) {
            this.cullingBounds.RemoveAt(index);
        }
        LODSettingChanged(player) {
            if (player.LODEnabled) {
                let players = this.players;
                let numPlayers = players.length;
                for (let i = 0; i < numPlayers; i++) {
                    if (players[i].Player == player) {
                        let distanceIndex = 0;
                        this.SetLODMeshByDistanceIndex(distanceIndex, players[i].Player);
                        break;
                    }
                }
            }
            else {
                player.SetLODMesh(null);
            }
        }
        SetLODMeshByDistanceIndex(index, player) {
            let lodMesh = null;
            if (index == 0) {
                lodMesh = this.mesh;
            }
            else {
                let lodMeshes = this.anim.lodMeshes;
                lodMesh = lodMeshes == null || lodMeshes.length == 0 ? this.mesh : lodMeshes[Math.min(index - 1, lodMeshes.length - 1)];
                if (lodMesh == null)
                    lodMesh = this.mesh;
            }
            player.SetLODMesh(lodMesh);
        }
        UpdateCullingBounds() {
            let numPlayers = this.players.length;
            for (let i = 0; i < numPlayers; ++i) {
                let player = this.players[i];
                let bounds = this.cullingBounds.Get(i);
                bounds.center = player.Player.Position;
                bounds.radius = this.anim.sphereRadius;
                this.cullingBounds[i] = bounds;
            }
        }
        Update(deltaTime, mtrl) {
            if (this.executeOncePerFrame.CanBeExecute()) {
                this.executeOncePerFrame.MarkAsExecuted();
                this.time += deltaTime;
                this.UpdateCullingBounds();
            }
            if (mtrl.executeOncePerFrame.CanBeExecute()) {
                let anim = this.anim;
                mtrl.executeOncePerFrame.MarkAsExecuted();
                mtrl.material._shaderValues.setTexture(GPUSkinningPlayerResources.shaderPropID_GPUSkinning_TextureMatrix, this.texture);
                mtrl.material._shaderValues.setVector(GPUSkinningPlayerResources.shaderPropID_GPUSkinning_TextureSize_NumPixelsPerFrame, new Vector4$1(anim.textureWidth, anim.textureHeight, anim.bones.length * 3, 0));
            }
        }
        UpdatePlayingData(mpb, playingClip, frameIndex, frame, rootMotionEnabled, lastPlayedClip, frameIndex_crossFade, crossFadeTime, crossFadeProgress) {
            mpb.setVector(GPUSkinningPlayerResources.shaderPorpID_GPUSkinning_FrameIndex_PixelSegmentation, new Vector4$1(frameIndex, playingClip.pixelSegmentation, 0, 0));
            if (rootMotionEnabled) {
                let rootMotionInv = frame.RootMotionInv(this.anim.rootBoneIndex);
                mpb.setMatrix4x4(GPUSkinningPlayerResources.shaderPropID_GPUSkinning_RootMotion, rootMotionInv);
            }
            if (this.IsCrossFadeBlending(lastPlayedClip, crossFadeTime, crossFadeProgress)) {
                if (lastPlayedClip.rootMotionEnabled) {
                    mpb.setMatrix4x4(GPUSkinningPlayerResources.shaderPropID_GPUSkinning_RootMotion_CrossFade, lastPlayedClip.frames[frameIndex_crossFade].RootMotionInv(this.anim.rootBoneIndex));
                }
                mpb.setVector(GPUSkinningPlayerResources.shaderPorpID_GPUSkinning_FrameIndex_PixelSegmentation_Blend_CrossFade, new Vector4$1(frameIndex_crossFade, lastPlayedClip.pixelSegmentation, this.CrossFadeBlendFactor(crossFadeProgress, crossFadeTime)));
            }
        }
        CrossFadeBlendFactor(crossFadeProgress, crossFadeTime) {
            return Mathf.Clamp01(crossFadeProgress / crossFadeTime);
        }
        IsCrossFadeBlending(lastPlayedClip, crossFadeTime, crossFadeProgress) {
            return lastPlayedClip != null && crossFadeTime > 0 && crossFadeProgress <= crossFadeTime;
        }
        GetMaterial(state) {
            return this.mtrls[state];
        }
        InitMaterial(originalMaterial) {
            if (this.mtrls != null) {
                return;
            }
            let mtrls = this.mtrls = [];
            for (let i = 0; i < MaterialState.Count; ++i) {
                let materialItem = new GPUSkinningMaterial();
                let material = materialItem.material = originalMaterial.clone();
                mtrls[i] = materialItem;
                material.name = GPUSkinningPlayerResources.keywords[i];
                this.EnableKeywords(i, mtrls[i]);
            }
        }
        EnableKeywords(ki, mtrl) {
            for (let i = 0; i < this.mtrls.length; ++i) {
                if (i == ki) {
                    mtrl.material._shaderValues.addDefine(GPUSkinningPlayerResources.keywords[i]);
                }
                else {
                    mtrl.material._shaderValues.removeDefine(GPUSkinningPlayerResources.keywords[i]);
                }
            }
        }
    }
    GPUSkinningPlayerResources.keywords = [
        "ROOTON_BLENDOFF", "ROOTON_BLENDON_CROSSFADEROOTON", "ROOTON_BLENDON_CROSSFADEROOTOFF",
        "ROOTOFF_BLENDOFF", "ROOTOFF_BLENDON_CROSSFADEROOTON", "ROOTOFF_BLENDON_CROSSFADEROOTOFF"
    ];
    GPUSkinningPlayerResources.shaderPropID_GPUSkinning_TextureMatrix = -1;
    GPUSkinningPlayerResources.shaderPropID_GPUSkinning_TextureSize_NumPixelsPerFrame = 0;
    GPUSkinningPlayerResources.shaderPorpID_GPUSkinning_FrameIndex_PixelSegmentation = 0;
    GPUSkinningPlayerResources.shaderPropID_GPUSkinning_RootMotion = 0;
    GPUSkinningPlayerResources.shaderPorpID_GPUSkinning_FrameIndex_PixelSegmentation_Blend_CrossFade = 0;
    GPUSkinningPlayerResources.shaderPropID_GPUSkinning_RootMotion_CrossFade = 0;
    GPUSkinningPlayerResources._isInited = false;

    class GPUSkinningPlayerMonoManager {
        constructor() {
            this.items = [];
        }
        Register(anim, mesh, originalMtrl, textureRawData, player) {
            if (anim == null || originalMtrl == null || textureRawData == null || player == null) {
                return;
            }
            let item = null;
            let items = this.items;
            let numItems = items.length;
            for (let i = 0; i < numItems; ++i) {
                if (items[i].anim.guid == anim.guid) {
                    item = items[i];
                    break;
                }
            }
            if (item == null) {
                item = new GPUSkinningPlayerResources();
                items.push(item);
            }
            if (item.anim == null) {
                item.anim = anim;
            }
            if (item.mesh == null) {
                item.mesh = mesh;
            }
            item.InitMaterial(originalMtrl);
            if (item.texture == null) {
                item.texture = textureRawData;
            }
            if (item.players.indexOf(player) == -1) {
                item.players.push(player);
                item.AddCullingBounds();
            }
            return item;
        }
        Unregister(player) {
            if (player == null) {
                return;
            }
            let items = this.items;
            let numItems = items.length;
            for (let i = 0; i < numItems; ++i) {
                let playerIndex = items[i].players.indexOf(player);
                if (playerIndex != -1) {
                    items[i].players.splice(playerIndex, 1);
                    items[i].RemoveCullingBounds(playerIndex);
                    if (items[i].players.length == 0) {
                        items[i].Destroy();
                        items.splice(i, 1);
                    }
                    break;
                }
            }
        }
    }

    class GPUSkinningPlayerJoint extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.BoneIndex = 0;
            this.BoneGUID = null;
        }
        get Transform() {
            return this.transform;
        }
        get GameObject() {
            return this.go;
        }
        onAwake() {
            this.go = this.owner;
            this.transform = this.go.transform;
        }
        Init(boneIndex, boneGUID) {
            this.BoneIndex = boneIndex;
            this.BoneGUID = boneGUID;
        }
    }

    var GPUSkinningWrapMode;
    (function (GPUSkinningWrapMode) {
        GPUSkinningWrapMode[GPUSkinningWrapMode["Once"] = 0] = "Once";
        GPUSkinningWrapMode[GPUSkinningWrapMode["Loop"] = 1] = "Loop";
    })(GPUSkinningWrapMode || (GPUSkinningWrapMode = {}));

    var Vector3$2 = Laya.Vector3;
    var Matrix4x4 = Laya.Matrix4x4;
    var Quaternion = Laya.Quaternion;
    class GPUSkinningPlayer {
        constructor(go, res) {
            this.time = 0;
            this.timeDiff = 0;
            this.crossFadeTime = -1;
            this.crossFadeProgress = 0;
            this.lastPlayedTime = 0;
            this.lastPlayedClip = null;
            this.lastPlayingFrameIndex = -1;
            this.lastPlayingClip = null;
            this.playingClip = null;
            this.res = null;
            this.rootMotionFrameIndex = -1;
            this.sAnimEvent = new Typed2Signal();
            this.rootMotionEnabled = false;
            this.cullingMode = GPUSKinningCullingMode.CullUpdateTransforms;
            this.visible = false;
            this.lodEnabled = false;
            this.isPlaying = false;
            this.joints = null;
            this.go = go;
            this.transform = go.transform;
            this.res = res;
            this.mr = go.meshRenderer;
            this.mf = go.meshFilter;
            let mtrl = this.GetCurrentMaterial();
            this.mr.sharedMaterial = mtrl == null ? null : mtrl.material;
            this.mf.sharedMesh = res.mesh;
            this.ConstructJoints();
        }
        get RootMotionEnabled() {
            return this.rootMotionEnabled;
        }
        set RootMotionEnabled(value) {
            this.rootMotionFrameIndex = -1;
            this.rootMotionEnabled = value;
        }
        get CullingMode() {
            return this.cullingMode;
        }
        set CullingMode(value) {
            this.cullingMode = value;
        }
        get Visible() {
            return this.visible;
        }
        set Visible(value) {
            this.visible = value;
        }
        get LODEnabled() {
            return this.lodEnabled;
        }
        set LODEnabled(value) {
            this.lodEnabled = value;
            this.res.LODSettingChanged(this);
        }
        get IsPlaying() {
            return this.isPlaying;
        }
        get PlayingClipName() {
            return this.playingClip == null ? null : this.playingClip.name;
        }
        get Position() {
            return this.transform == null ? new Vector3$2() : this.transform.position;
        }
        get LocalPosition() {
            return this.transform == null ? new Vector3$2() : this.transform.localPosition;
        }
        get Joints() {
            return this.joints;
        }
        get WrapMode() {
            return this.playingClip == null ? GPUSkinningWrapMode.Once : this.playingClip.wrapMode;
        }
        get ClipTimeLength() {
            if (!this.playingClip) {
                return 0;
            }
            return this.playingClip.length;
        }
        get IsTimeAtTheEndOfLoop() {
            if (this.playingClip == null) {
                return false;
            }
            else {
                return this.GetFrameIndex() == (Math.floor(this.playingClip.length * this.playingClip.fps) - 1);
            }
        }
        get NormalizedTime() {
            if (this.playingClip == null) {
                return 0;
            }
            else {
                return this.GetFrameIndex() / (Math.floor(this.playingClip.length * this.playingClip.fps) - 1);
            }
        }
        set NormalizedTime(value) {
            if (this.playingClip != null) {
                var v = Mathf.Clamp01(value);
                if (this.WrapMode == GPUSkinningWrapMode.Once) {
                    this.time = v * this.playingClip.length;
                }
                else if (this.WrapMode == GPUSkinningWrapMode.Loop) {
                    if (this.playingClip.individualDifferenceEnabled) {
                        this.res.Time = this.playingClip.length + v * this.playingClip.length - this.timeDiff;
                    }
                    else {
                        this.res.Time = v * this.playingClip.length;
                    }
                }
                else {
                    console.error(`GPUSkinningPlayer.NormalizedTime 未知 播放模式 WrapMode=${this.WrapMode}`);
                }
            }
        }
        GetCurrentTime() {
            let time = 0;
            switch (this.WrapMode) {
                case GPUSkinningWrapMode.Once:
                    time = this.time;
                    break;
                case GPUSkinningWrapMode.Loop:
                    time = this.res.Time + (this.playingClip.individualDifferenceEnabled ? this.timeDiff : 0);
                    break;
                default:
                    console.error(`GPUSkinningPlayer.GetCurrentTime 未知 播放模式 WrapMode=${this.WrapMode}`);
                    break;
            }
            return time;
        }
        GetFrameIndex() {
            let time = this.GetCurrentTime();
            if (this.playingClip.length == time) {
                return this.GetTheLastFrameIndex_WrapMode_Once(this.playingClip);
            }
            else {
                return this.GetFrameIndex_WrapMode_Loop(this.playingClip, time);
            }
        }
        GetCrossFadeFrameIndex() {
            if (this.lastPlayedClip == null) {
                return 0;
            }
            switch (this.lastPlayedClip.wrapMode) {
                case GPUSkinningWrapMode.Once:
                    if (this.lastPlayedTime >= this.lastPlayedClip.length) {
                        return this.GetTheLastFrameIndex_WrapMode_Once(this.lastPlayedClip);
                    }
                    else {
                        return this.GetFrameIndex_WrapMode_Loop(this.lastPlayedClip, this.lastPlayedTime);
                    }
                    break;
                case GPUSkinningWrapMode.Loop:
                    return this.GetFrameIndex_WrapMode_Loop(this.lastPlayedClip, this.lastPlayedTime);
                    break;
                default:
                    console.error(`GPUSkinningPlayer.GetCrossFadeFrameIndex 未知 播放模式 this.lastPlayedClip.wrapMode=${this.lastPlayedClip.wrapMode}`);
                    break;
            }
        }
        GetTheLastFrameIndex_WrapMode_Once(clip) {
            return Math.floor(clip.length * clip.fps) - 1;
        }
        GetFrameIndex_WrapMode_Loop(clip, time) {
            return Math.floor(time * clip.fps) % Math.floor(clip.length * clip.fps);
        }
        GetCurrentMaterial() {
            if (this.res == null) {
                return null;
            }
            if (this.playingClip == null) {
                return this.res.GetMaterial(MaterialState.RootOff_BlendOff);
            }
            let res = this.res;
            let playingClip = this.playingClip;
            let lastPlayedClip = this.lastPlayedClip;
            let rootMotionEnabled = this.rootMotionEnabled;
            let crossFadeTime = this.crossFadeTime;
            let crossFadeProgress = this.crossFadeProgress;
            if (playingClip.rootMotionEnabled && rootMotionEnabled) {
                if (res.IsCrossFadeBlending(lastPlayedClip, crossFadeTime, crossFadeProgress)) {
                    if (lastPlayedClip.rootMotionEnabled) {
                        return res.GetMaterial(MaterialState.RootOn_BlendOn_CrossFadeRootOn);
                    }
                    return res.GetMaterial(MaterialState.RootOn_BlendOn_CrossFadeRootOff);
                }
                return res.GetMaterial(MaterialState.RootOn_BlendOff);
            }
            if (res.IsCrossFadeBlending(lastPlayedClip, crossFadeTime, crossFadeProgress)) {
                if (lastPlayedClip.rootMotionEnabled) {
                    return res.GetMaterial(MaterialState.RootOff_BlendOn_CrossFadeRootOn);
                }
                return res.GetMaterial(MaterialState.RootOff_BlendOn_CrossFadeRootOff);
            }
            else {
                return res.GetMaterial(MaterialState.RootOff_BlendOff);
            }
        }
        SetLODMesh(mesh) {
            if (!this.LODEnabled) {
                mesh = this.res.mesh;
            }
            if (this.mf != null && this.mf.sharedMesh != mesh) {
                this.mf.sharedMesh = mesh;
            }
        }
        ConstructJoints() {
            if (this.joints)
                return;
            let existingJoints = this.go.getComponentsInChildren(GPUSkinningPlayerJoint);
            let bones = this.res.anim.bones;
            let numBones = bones == null ? 0 : bones.length;
            for (let i = 0; i < numBones; i++) {
                let bone = bones[i];
                if (!bone.isExposed) {
                    continue;
                }
                if (this.joints == null) {
                    this.joints = [];
                }
                let joints = this.joints;
                let inTheExistingJoints = false;
                if (existingJoints != null) {
                    for (let j = 0; j < existingJoints.length; j++) {
                        let existingJoint = existingJoints[j];
                        if (existingJoint && existingJoint.BoneGUID == bone.guid) {
                            if (existingJoint.BoneIndex != i) {
                                existingJoint.Init(i, bone.guid);
                            }
                            joints.push(existingJoint);
                            existingJoints[j] = null;
                            inTheExistingJoints = true;
                            break;
                        }
                    }
                }
                if (!inTheExistingJoints) {
                    let joinGO = new Laya.Sprite3D(bone.name);
                    this.go.addChild(joinGO);
                    joinGO.transform.localPosition = new Vector3$2();
                    joinGO.transform.localScale = new Vector3$2(1, 1, 1);
                    let join = joinGO.addComponent(GPUSkinningPlayerJoint);
                    joints.push(join);
                    join.Init(i, bone.guid);
                }
            }
            this.DeleteInvalidJoints(existingJoints);
        }
        DeleteInvalidJoints(joints) {
            if (joints) {
                for (let i = 0; i < joints.length; i++) {
                    let join = joints[i];
                    let joinGO = join.owner;
                    for (let j = joinGO.numChildren; j >= 0; j--) {
                        let child = joinGO.getChildAt(j);
                        this.go.addChild(child);
                        child.transform.localPosition = new Vector3$2();
                    }
                    joinGO.removeSelf();
                    joinGO.destroy();
                }
            }
        }
        Play(clipName) {
            let clips = this.res.anim.clips;
            let numClips = clips == null ? 0 : clips.length;
            let playingClip = this.playingClip;
            for (let i = 0; i < numClips; ++i) {
                if (clips[i].name == clipName) {
                    let item = clips[i];
                    if (playingClip != item
                        || (playingClip != null && playingClip.wrapMode == GPUSkinningWrapMode.Once && this.IsTimeAtTheEndOfLoop)
                        || (playingClip != null && !this.isPlaying)) {
                        this.SetNewPlayingClip(item);
                    }
                    return;
                }
            }
        }
        CrossFade(clipName, fadeLength) {
            if (this.playingClip == null) {
                this.Play(clipName);
            }
            else {
                let playingClip = this.playingClip;
                let clips = this.res.anim.clips;
                let numClips = clips == null ? 0 : clips.length;
                for (let i = 0; i < numClips; ++i) {
                    if (clips[i].name == clipName) {
                        let item = clips[i];
                        if (playingClip != item) {
                            this.crossFadeProgress = 0;
                            this.crossFadeTime = fadeLength;
                            this.SetNewPlayingClip(item);
                            return;
                        }
                        if ((playingClip != null && playingClip.wrapMode == GPUSkinningWrapMode.Once && this.IsTimeAtTheEndOfLoop)
                            || (playingClip != null && !this.isPlaying)) {
                            this.SetNewPlayingClip(item);
                            return;
                        }
                    }
                }
            }
        }
        SetNewPlayingClip(clip) {
            this.lastPlayedClip = this.playingClip;
            this.lastPlayedTime = this.GetCurrentTime();
            this.isPlaying = true;
            this.playingClip = clip;
            this.rootMotionFrameIndex = -1;
            this.time = 0;
            this.timeDiff = Random.range(0, clip.length);
        }
        Stop() {
            this.isPlaying = false;
        }
        Resume() {
            if (this.playingClip != null) {
                this.isPlaying = true;
            }
        }
        Update(timeDelta) {
            if (!this.isPlaying || this.playingClip == null) {
                return;
            }
            let currMtrl = this.GetCurrentMaterial();
            if (currMtrl == null) {
                return;
            }
            if (this.mr.sharedMaterial != currMtrl.material) {
                this.mr.sharedMaterial = currMtrl.material;
            }
            let playingClip = this.playingClip;
            switch (playingClip.wrapMode) {
                case GPUSkinningWrapMode.Loop:
                    this.UpdateMaterial(timeDelta, currMtrl);
                    break;
                case GPUSkinningWrapMode.Once:
                    if (this.time >= playingClip.length) {
                        this.time = playingClip.length;
                        this.UpdateMaterial(timeDelta, currMtrl);
                    }
                    else {
                        this.UpdateMaterial(timeDelta, currMtrl);
                        this.time += timeDelta;
                        if (this.time > playingClip.length) {
                            this.time = playingClip.length;
                        }
                    }
                    break;
                default:
                    console.error(`GPUSkinningPlayer.Update 未知 播放模式 playingClip.wrapMode=${playingClip.wrapMode}`);
                    break;
            }
            this.crossFadeProgress += timeDelta;
            this.lastPlayedTime += timeDelta;
        }
        UpdateMaterial(deltaTime, currMtrl) {
            let res = this.res;
            let frameIndex = this.GetFrameIndex();
            if (this.lastPlayingClip == this.playingClip && this.lastPlayingFrameIndex == frameIndex) {
                res.Update(deltaTime, currMtrl);
                return;
            }
            this.lastPlayingClip = this.playingClip;
            this.lastPlayingFrameIndex = frameIndex;
            let lastPlayedClip = this.lastPlayingClip;
            let playingClip = this.playingClip;
            let blend_crossFade = 1;
            let frameIndex_crossFade = -1;
            let frame_crossFade = null;
            if (res.IsCrossFadeBlending(lastPlayedClip, this.crossFadeTime, this.crossFadeProgress)) {
                frameIndex_crossFade = this.GetCrossFadeFrameIndex();
                frame_crossFade = lastPlayedClip.frames[frameIndex_crossFade];
                blend_crossFade = res.CrossFadeBlendFactor(this.crossFadeProgress, this.crossFadeTime);
            }
            var mpb = currMtrl.material._shaderValues;
            let frame = playingClip.frames[frameIndex];
            if (this.Visible ||
                this.CullingMode == GPUSKinningCullingMode.AlwaysAnimate) {
                res.Update(deltaTime, currMtrl);
                res.UpdatePlayingData(mpb, playingClip, frameIndex, frame, playingClip.rootMotionEnabled && this.rootMotionEnabled, lastPlayedClip, this.GetCrossFadeFrameIndex(), this.crossFadeTime, this.crossFadeProgress);
                this.UpdateJoints(frame);
            }
            if (playingClip.rootMotionEnabled && this.rootMotionEnabled && frameIndex != this.rootMotionFrameIndex) {
                if (this.CullingMode != GPUSKinningCullingMode.CullCompletely) {
                    this.rootMotionFrameIndex = frameIndex;
                    this.DoRootMotion(frame_crossFade, 1 - blend_crossFade, false);
                    this.DoRootMotion(frame, blend_crossFade, true);
                }
            }
            this.UpdateEvents(playingClip, frameIndex, frame_crossFade == null ? null : lastPlayedClip, frameIndex_crossFade);
        }
        UpdateJoints(frame) {
            if (this.joints == null) {
                return;
            }
            let res = this.res;
            let joints = this.joints;
            let playingClip = this.playingClip;
            let matrices = frame.matrices;
            let bones = res.anim.bones;
            let numJoints = joints.length;
            for (let i = 0; i < numJoints; ++i) {
                let joint = joints[i];
                let jointTransform = joint.Transform;
                if (jointTransform != null) {
                    let jointMatrix = new Matrix4x4();
                    Matrix4x4.multiply(frame.matrices[joint.BoneIndex], bones[joint.BoneIndex].BindposeInv, jointMatrix);
                    if (playingClip.rootMotionEnabled && this.rootMotionEnabled) {
                        let outM = new Matrix4x4();
                        Matrix4x4.multiply(frame.RootMotionInv(res.anim.rootBoneIndex), jointMatrix, outM);
                        jointMatrix = outM;
                    }
                    var vec3 = new Vector3$2();
                    jointMatrix.getTranslationVector(vec3);
                    jointTransform.localPosition = vec3;
                    vec3 = new Vector3$2();
                    jointMatrix.getForward(vec3);
                    var vec3_2 = new Vector3$2();
                    Quaternion.angleTo(new Vector3$2(1, 0, 0), vec3, vec3_2);
                    jointTransform.localRotationEuler = vec3_2;
                }
                else {
                    joints.splice(i, 1);
                    --i;
                    --numJoints;
                }
            }
        }
        DoRootMotion(frame, blend, doRotate) {
        }
        UpdateEvents(playingClip, playingFrameIndex, corssFadeClip, crossFadeFrameIndex) {
            this.UpdateClipEvent(playingClip, playingFrameIndex);
            this.UpdateClipEvent(corssFadeClip, crossFadeFrameIndex);
        }
        UpdateClipEvent(clip, frameIndex) {
            if (clip == null || clip.events == null || clip.events.length == 0) {
                return;
            }
            let events = clip.events;
            let numEvents = events.length;
            for (let i = 0; i < numEvents; ++i) {
                if (events[i].frameIndex == frameIndex) {
                    this.sAnimEvent.dispatch(this, events[i].eventId);
                    break;
                }
            }
        }
    }

    class GPUSkinningPlayerMono extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.defaultPlayingClipIndex = 0;
            this.rootMotionEnabled = false;
            this.lodEnabled = true;
            this.cullingMode = GPUSKinningCullingMode.CullUpdateTransforms;
        }
        get Player() {
            return this.player;
        }
        onStart() {
            this.Init();
        }
        onUpdate() {
            if (this.player != null) {
                this.player.Update(Laya.timer.delta / 1000);
            }
        }
        onDestroy() {
            this.anim = null;
            this.mesh = null;
            this.mtrl = null;
            this.textureRawData = null;
            GPUSkinningPlayerMono.playerManager.Unregister(this);
        }
        SetData(anim, mesh, mtrl, textureRawData) {
            if (this.player != null) {
                return;
            }
            this.anim = anim;
            this.mesh = mesh;
            this.mtrl = mtrl;
            this.textureRawData = textureRawData;
            this.Init();
        }
        Init() {
            this.gameObject = this.owner;
            if (this.player != null) {
                return;
            }
            let anim = this.anim;
            let mesh = this.mesh;
            let mtrl = this.mtrl;
            let textureRawData = this.textureRawData;
            if (anim != null && mesh != null && mtrl != null && textureRawData != null) {
                let res = GPUSkinningPlayerMono.playerManager.Register(anim, mesh, mtrl, textureRawData, this);
                let player = new GPUSkinningPlayer(this.gameObject, res);
                player.RootMotionEnabled = this.rootMotionEnabled;
                player.LODEnabled = this.lodEnabled;
                player.CullingMode = this.cullingMode;
                this.player = player;
                if (anim != null && anim.clips != null && anim.clips.length > 0) {
                    player.Play(anim.clips[Mathf.clamp(this.defaultPlayingClipIndex, 0, anim.clips.length)].name);
                }
            }
        }
    }
    GPUSkinningPlayerMono.playerManager = new GPUSkinningPlayerMonoManager();

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            var scene = Laya.stage.addChild(new Laya.Scene3D());
            var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 3, 3));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            camera.addComponent(GPUSkinningPlayerMono);
            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            var box = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1)));
            box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            var material = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function (tex) {
                material.albedoTexture = tex;
            }));
            box.meshRenderer.material = material;
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/GameUI.ts", GameUI);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class TestMain {
        constructor() {
            this.InitLaya();
            new TestShader();
        }
        InitLaya() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            Laya.Shader3D.debugMode = true;
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
        }
    }
    new TestMain();

}());
//# sourceMappingURL=bundle.js.map
