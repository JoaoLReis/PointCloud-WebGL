//SHADERS
var shaderProgram;
var polyShaderProgram;

//function initShaders(number) {
//        if(number == 0)
//            shaderProgramPC();
//	if(number == 1)
//            shaderProgramPoly();
//}
//
//function shaderProgramPC()
//{
//    var fragmentShader = getShader(gl, "PCshader-fs");
//    var vertexShader = getShader(gl, "PCshader-vs");
//
//    shaderProgram = createShaderProgram(shaderProgram, vertexShader, fragmentShader);
//	
//    gl.useProgram(shaderProgram);
//
//    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
//    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
//
//    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
//    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
//
//    shaderProgram.cameraUniform = gl.getUniformLocation(shaderProgram, "Camera");
//    shaderProgram.modelUniform = gl.getUniformLocation(shaderProgram, "Model");
//    shaderProgram.pointSizeUniform = gl.getUniformLocation(shaderProgram, "pointSize");
//
//    shaderProgram.red = gl.getUniformLocation(shaderProgram, "red");
//    shaderProgram.green = gl.getUniformLocation(shaderProgram, "green");
//    shaderProgram.blue = gl.getUniformLocation(shaderProgram, "blue");
//}

function shaderProgramPoly()
{
    var fragmentShader = getShader(gl, "Polyshader-fs");
    var vertexShader = getShader(gl, "Polyshader-vs");
    
    polyShaderProgram = createShaderProgram(polyShaderProgram, vertexShader, fragmentShader);
	
    gl.useProgram(polyShaderProgram);

    polyShaderProgram.vertexPositionAttribute = gl.getAttribLocation(polyShaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(polyShaderProgram.vertexPositionAttribute);

    polyShaderProgram.vertexColorAttribute = gl.getAttribLocation(polyShaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(polyShaderProgram.vertexColorAttribute);

    polyShaderProgram.cameraUniform = gl.getUniformLocation(polyShaderProgram, "Camera");
    polyShaderProgram.modelUniform = gl.getUniformLocation(polyShaderProgram, "Model");

}

function createShaderProgram(shProgram, vshader, fshader)
{
	var sProgram = shProgram;
	sProgram = gl.createProgram();
	gl.attachShader(sProgram, vshader);
	gl.attachShader(sProgram, fshader);
	gl.linkProgram(sProgram);

	if (!gl.getProgramParameter(sProgram, gl.LINK_STATUS)) {
		alert("Could not initialize shaders");
	}
	return sProgram;
}

function getShader(gl, src, isVertex) {
	var shaderSrc;
	var shader;
	if (isVertex) {
		shader = gl.createShader(gl.VERTEX_SHADER);
		shaderSrc = src;
        }
        else if (!isVertex){
		shader = gl.createShader(gl.FRAGMENT_SHADER);
		shaderSrc = src;
	} else {
		return null;
	}
	
	gl.shaderSource(shader, shaderSrc);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}


