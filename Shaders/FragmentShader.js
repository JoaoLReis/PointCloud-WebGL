var fragmentShaderSrc = 

"precision mediump float;" +

"varying vec4 vColor;" +
"varying float isVisible;" +

"" +
"" +

"void main(void) {" +

"   if (isVisible == 0.0)" +
"      discard;" +

"   gl_FragColor = vColor;" +
"}";