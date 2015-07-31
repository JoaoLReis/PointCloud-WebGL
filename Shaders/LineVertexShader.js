var lineVertexShaderSrc =         
        
"attribute vec3 aVertexPosition;" +
"attribute float aVertexDepth;" +

"" +
"uniform mat4 Camera;" +
"uniform mat4 Model;" +
"uniform float mDepth;" +


"varying float vDepth;" +
"varying float maxDepth;" +

"" +
"void main(void) {" +
"" +
"	gl_Position = Camera * Model * vec4(aVertexPosition, 1.0);" +
"       vDepth = aVertexDepth;" +
"       maxDepth = mDepth;" +

"" +
"" +
"}";