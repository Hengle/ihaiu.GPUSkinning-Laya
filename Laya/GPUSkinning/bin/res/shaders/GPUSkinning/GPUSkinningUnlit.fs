precision highp float;

uniform sampler2D u_GPUSkinning_TextureMatrix;

#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
	varying vec4 v_Color;
#endif

#ifdef ALBEDOTEXTURE
	uniform sampler2D u_AlbedoTexture;
	varying vec2 v_Texcoord0;
#endif

uniform vec4 u_AlbedoColor;

#ifdef ALPHATEST
	uniform float u_AlphaTestValue;
#endif

#ifdef FOG
	uniform float u_FogStart;
	uniform float u_FogRange;
	#ifdef ADDTIVEFOG
	#else
		uniform vec3 u_FogColor;
	#endif
#endif

void main()
{
	vec4 color =  u_AlbedoColor;
	#ifdef ALBEDOTEXTURE
		color *= texture2D(u_AlbedoTexture, v_Texcoord0);
	#endif

    // float frameStartIndex = getFrameStartIndex();
	// float matStartIndex = frameStartIndex + v_Texcoord1.x * 3.0;
	// vec4 row0 = texture2D(u_GPUSkinning_TextureMatrix, indexToUV(matStartIndex));
	// color = row0;
	//  color = texture2D(u_GPUSkinning_TextureMatrix, v_Texcoord0);
	// color = texture2D(u_GPUSkinning_TextureMatrix, v_Texcoord0) ;
	// color.a = 1.0;
	//color = texture2D(u_GPUSkinning_TextureMatrix, v_Texcoord0)  ;
	// + vec4(1.0, 1.0, 1.0, 1.0) * 0.5;
	// color = texture2DGradEXT(u_GPUSkinning_TextureMatrix, mod(v_Texcoord0, vec2(0.1, 0.5)), 
    //                               dFdx(v_Texcoord0), dFdy(v_Texcoord0));

	#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
		color *= v_Color;
	#endif
	
	#ifdef ALPHATEST
		if(color.a < u_AlphaTestValue)
			discard;
	#endif
	
	gl_FragColor = color;
	
	#ifdef FOG
		float lerpFact = clamp((1.0 / gl_FragCoord.w - u_FogStart) / u_FogRange, 0.0, 1.0);
		#ifdef ADDTIVEFOG
			gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0), lerpFact);
		#else
			gl_FragColor.rgb = mix(gl_FragColor.rgb, u_FogColor, lerpFact);
		#endif
	#endif
	
}

