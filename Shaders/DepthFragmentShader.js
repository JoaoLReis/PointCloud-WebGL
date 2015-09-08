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
"       gl_FragColor = vec4(textureColor.r, textureColor.g, textureColor.b, alpha);" +
"" +
"" +
"" +
"" +
"}";