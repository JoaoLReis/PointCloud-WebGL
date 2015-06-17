var vertexShaderSrc =         
        
"attribute vec3 aVertexPosition;" +
"attribute vec4 aVertexColor;" +

"uniform mat4 Camera;" +
"uniform mat4 Model;" +

"uniform float pointSize;" +

"uniform float red;" +
"uniform float green;" +
"uniform float blue;" +

"varying vec4 vColor;" +
"varying float isVisible;" +

"void main(void) {" +
"       isVisible = 1.0;" +
"       if(aVertexColor[2] > red || aVertexColor[0] > blue || aVertexColor[1] > green)" +
"           isVisible = 0.0;" +
"" +
"	gl_Position = Camera * Model * vec4(aVertexPosition, 1.0);" +
"	vColor = aVertexColor;" +      
"" +
"       gl_PointSize = pointSize;" + 
"}";