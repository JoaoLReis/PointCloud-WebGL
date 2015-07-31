/* 
 * This file was created by João Luís Reis
 */

var Wireframe = function(vertex, numberVertex, depths, index) {
    this.ID = 0;
    this.collisionManagerIndex = index;
    this.vertexes = vertex;
    this.numberVertex = numberVertex;
    this.depths = depths;
    this.modelMatrix = mat4.create();
    
    this.vertexPositionBuffer;
    this.vertexDepthBuffer;    

    
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
    this.vertexPositionBuffer.numItems = this.numberVertex;

    //Vertex Depth buffer
    this.vertexDepthBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexDepthBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.depths), gl.STATIC_DRAW);
    this.vertexDepthBuffer.itemSize = 1;
    this.vertexDepthBuffer.numItems = this.numberVertex;

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
    
    this.shaderProgram.vertexDepthAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexDepth");
    gl.enableVertexAttribArray(this.shaderProgram.vertexDepthAttribute);

    this.shaderProgram.cameraUniform = gl.getUniformLocation(this.shaderProgram, "Camera");
    this.shaderProgram.modelUniform = gl.getUniformLocation(this.shaderProgram, "Model");
    this.shaderProgram.depthUniform = gl.getUniformLocation(this.shaderProgram, "mDepth");
}

Wireframe.prototype.cleanUp = function()
{
    gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.vertexDepthAttribute);
}

Wireframe.prototype.drawPreparation = function()
{
    this.prepareDraw();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexDepthBuffer);
    gl.enableVertexAttribArray(this.shaderProgram.vertexDepthAttribute);
    gl.vertexAttribPointer(this.shaderProgram.vertexDepthAttribute, this.vertexDepthBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    var m = camera.matrix();
    gl.uniformMatrix4fv(this.shaderProgram.cameraUniform, false, camera.matrix());
    gl.uniformMatrix4fv(this.shaderProgram.modelUniform, false, this.modelMatrix);
    gl.uniform1f(this.shaderProgram.depthUniform, false, collisionManager.pointCloudOctrees[this.collisionManagerIndex].maxDepth);
}

Wireframe.prototype.getModelMatrix = function()
{
    return this.modelMatrix;
}

Wireframe.prototype.updateModelMatrix = function(newModel)
{
    this.modelMatrix = newModel;
}