var polyVertexShaderSrc =         
        
"attribute vec3 aVertexPosition;" +
"attribute vec4 aVertexColor;" +
"attribute vec2 aTextureCoord;" +
"" +
"uniform mat4 Camera;" +
"uniform mat4 Model;" +
"" +
"varying vec4 vColor;" +
"varying vec2 vTextureCoord;" +
"" +
"void main(void) {" +
"" +
"	gl_Position = Camera * Model * vec4(aVertexPosition, 1.0);" +
"	vColor = aVertexColor;" +      
"       vTextureCoord = aTextureCoord;" +
"" +
"" +
"" +
"}";