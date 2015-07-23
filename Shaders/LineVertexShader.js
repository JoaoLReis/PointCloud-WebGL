var lineVertexShaderSrc =         
        
"attribute vec3 aVertexPosition;" +
"attribute vec4 aVertexColor;" +
"" +
"uniform mat4 Camera;" +
"uniform mat4 Model;" +
"" +
"varying vec4 vColor;" +
"" +
"void main(void) {" +
"" +
"	gl_Position = Camera * Model * vec4(aVertexPosition, 1.0);" +
"	vColor = aVertexColor;" +      
"" +
"" +
"" +
"}";