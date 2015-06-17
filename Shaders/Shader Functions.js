//SHADERS
var shaderProgram;

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = createShaderProgram(shaderProgram, vertexShader, fragmentShader);
	
	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	shaderProgram.cameraUniform = gl.getUniformLocation(shaderProgram, "Camera");
        shaderProgram.modelUniform = gl.getUniformLocation(shaderProgram, "Model");
	shaderProgram.pointSizeUniform = gl.getUniformLocation(shaderProgram, "pointSize");
        
	shaderProgram.red = gl.getUniformLocation(shaderProgram, "red");
	shaderProgram.green = gl.getUniformLocation(shaderProgram, "green");
	shaderProgram.blue = gl.getUniformLocation(shaderProgram, "blue");
        
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

function getShader(gl, id) {
	var shaderSrc;
	var shader;
	if (id == "shader-fs") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
		shaderSrc = fragmentShaderSrc;
	} else if (id == "shader-vs") {
		shader = gl.createShader(gl.VERTEX_SHADER);
		shaderSrc = vertexShaderSrc;
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


