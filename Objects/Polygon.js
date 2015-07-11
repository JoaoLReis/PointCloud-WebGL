/* 
 * This file was created by João Luís Reis
 */

var Polygon = function(vertex, normals, texCoords) {
    this.ID = 0;
    this.vertexes = vertex;
    this.normals = normals;
    this.textureCoords = texCoords;
    this.modelMatrix = mat4.create();
    this.modelMatrixUpdateFunction = function(){};
    
    this.vertexPositionBuffer;
    this.vertexNormalBuffer;    
    this.textureCoordBuffer;

    
    this.shaderProgram;
};

Polygon.prototype.init = function(isDepth)
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
    
    this.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);
    this.textureCoordBuffer.itemSize = 2;
    this.textureCoordBuffer.numItems = 4;
    
    
    //initialize shaders
    if(isDepth)
    {
        var fragmentShader = getShader(gl, depthFragmentShaderSrc, false);
        var vertexShader = getShader(gl, depthVertexShaderSrc, true);
        this.shaderProgram = createShaderProgram(this.shaderProgram, vertexShader, fragmentShader);
    }
    else
    {
        var fragmentShader = getShader(gl, polyFragmentShaderSrc, false);
        var vertexShader = getShader(gl, polyVertexShaderSrc, true);
        this.shaderProgram = createShaderProgram(this.shaderProgram, vertexShader, fragmentShader);
    }
}

Polygon.prototype.prepareDraw = function()
{
    this.startShader();
}

Polygon.prototype.startShader = function()
{
    gl.useProgram(this.shaderProgram);

    this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.vertexNormalAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
    
    this.shaderProgram.vertexTextureAttribute = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(this.shaderProgram.vertexTextureAttribute);

    this.shaderProgram.cameraUniform = gl.getUniformLocation(this.shaderProgram, "Camera");
    this.shaderProgram.modelUniform = gl.getUniformLocation(this.shaderProgram, "Model");
    this.shaderProgram.samplerUniform = gl.getUniformLocation(this.shaderProgram, "uSampler");
}

Polygon.prototype.cleanUp = function()
{
    gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.vertexTextureAttribute);
}

Polygon.prototype.drawPreparation = function()
{
    this.prepareDraw();

    this.modelMatrixUpdateFunction();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
    gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    gl.enableVertexAttribArray(this.shaderProgram.vertexTextureAttribute);
    gl.vertexAttribPointer(this.shaderProgram.vertexTextureAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    var m = camera.matrix();
    gl.uniformMatrix4fv(this.shaderProgram.cameraUniform, false, camera.matrix());
    gl.uniformMatrix4fv(this.shaderProgram.modelUniform, false, this.modelMatrix);
}

Polygon.prototype.createDepthTexture = function()
{
    colorTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.viewportWidth, gl.viewportHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, gl.viewportWidth, gl.viewportHeight, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

    depthFrameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFrameBuffer);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

Polygon.prototype.getModelMatrix = function()
{
    return this.modelMatrix;
}

Polygon.prototype.updateModelMatrix = function(newModel)
{
    this.modelMatrix = newModel;
}