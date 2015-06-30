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


