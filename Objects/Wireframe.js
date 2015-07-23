/* 
 * This file was created by João Luís Reis
 */

var Wireframe = function(vertex, normals) {
    this.ID = 0;
    this.vertexes = vertex;
    this.normals = normals;
    this.modelMatrix = mat4.create();
    this.modelMatrixUpdateFunction = function(){};
    
    this.vertexPositionBuffer;
    this.vertexNormalBuffer;    

    
    this.shaderProgram;
};

Wireframe.prototype.init = function()
{
    //get ID for this objet
    this.ID = getNewObjectID();
    
    //initialize buffers
    //Vertex buffer
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexes), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = 4;

    //Color buffer
    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = 4;
    
    //initialize shaders
    
    var fragmentShader = getShader(gl, lineFragmentShaderSrc, false);
    var vertexShader = getShader(gl, lineVertexShaderSrc, true);
    this.shaderProgram = createShaderProgram(this.shaderProgram, vertexShader, fragmentShader);

}

Wireframe.prototype.prepareDraw = function()
{
    this.startShader();
}

Wireframe.prototype.startShader = function()
{
    gl.useProgram(this.shaderProgram);

    this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.vertexNormalAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);

    this.shaderProgram.cameraUniform = gl.getUniformLocation(this.shaderProgram, "Camera");
    this.shaderProgram.modelUniform = gl.getUniformLocation(this.shaderProgram, "Model");
}

Wireframe.prototype.cleanUp = function()
{
    gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
}

Wireframe.prototype.drawPreparation = function()
{
    this.prepareDraw();

    this.modelMatrixUpdateFunction();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
    gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    var m = camera.matrix();
    gl.uniformMatrix4fv(this.shaderProgram.cameraUniform, false, camera.matrix());
    gl.uniformMatrix4fv(this.shaderProgram.modelUniform, false, this.modelMatrix);
}

Wireframe.prototype.getModelMatrix = function()
{
    return this.modelMatrix;
}

Wireframe.prototype.updateModelMatrix = function(newModel)
{
    this.modelMatrix = newModel;
}