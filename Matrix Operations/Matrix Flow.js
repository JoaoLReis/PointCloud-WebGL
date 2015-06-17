//Matrix
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
var viewMatrix = mat4.create();

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms(posM) {
    var matrix = posM;
    matrix = multiplyMatrix(matrix, viewMatrix);
    matrix = multiplyMatrix(matrix, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.uMatrixUniform, false, matrix);
}