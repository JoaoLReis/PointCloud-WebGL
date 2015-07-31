var lineFragmentShaderSrc = 

"precision mediump float;" +

"" +
"" +
"varying float vDepth;" +
"varying float maxDepth;" +
"" +
"" +
"void main(void) {" +
"       if(vDepth > 9.0)" +
"           gl_FragColor = vec4(0.0, 1.0, vDepth*0.1, 1.0);" +
"       else{" +
"           gl_FragColor = vec4(0.1 + vDepth*0.1*(1.0+(10.0-maxDepth)*0.1), 0.1 + vDepth*0.1*(1.0+(10.0-maxDepth*1.5)*0.1), 0.1 + vDepth*0.1*(1.0+(10.0-maxDepth*2.0)*0.1), 1);" +
"       }" +
"" +
"}";