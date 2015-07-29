var lineVertexShaderSrc =         
        
"attribute vec3 aVertexPosition;" +
"" +
"uniform mat4 Camera;" +
"uniform mat4 Model;" +
"" +
"" +
"void main(void) {" +
"" +
"	gl_Position = Camera * Model * vec4(aVertexPosition, 1.0);" +
"" +
"" +
"" +
"}";