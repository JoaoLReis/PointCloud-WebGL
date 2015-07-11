var depthFragmentShaderSrc = 

"precision mediump float;" +

"varying vec4 vColor;" +
"varying vec2 vTextureCoord;" +
"uniform sampler2D uSampler;" +
"" +
"" +
"" +
"" +

"void main(void) {" +
    "float alpha = 1.0;" +
    "vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));" +
    "alpha = textureColor.a;" +
""+
"" +
"   if(textureColor.r > 1.0)" +
"       gl_FragColor = vec4(0, 1, 1, alpha);" +
"   else if (textureColor.r < 0.99)" +
"       gl_FragColor = vec4(0, 0, textureColor.r, alpha);" +
"   else if (textureColor.r < 0.999)" +
"       gl_FragColor = vec4(0, textureColor.r, 0, alpha);" +
"   else if (textureColor.r < 1.0)" +
"       gl_FragColor = vec4(textureColor.r, 0, 0, alpha);" +
"   else" +
"       gl_FragColor = vec4(textureColor.r, textureColor.r, 0, alpha);" +
"" +
"" +
"" +
"" +
"}";