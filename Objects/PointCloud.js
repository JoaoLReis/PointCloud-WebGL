/* 
 * This file was created by João Luís Reis
 */

var PointCloud = function() {
    this.ID = 0;
    this.vertexes = vertex;
    this.colors = colors;
    this.numColors = numberColors;
    this.numVertex = numberVertex;
    
    this.vertexPositionBuffer;
    this.vertexColorBuffer;
    
    this.shaderProgram;
};

PointCloud.prototype.init = function()
{
    //get ID for this objet
    this.ID = getNewObjectID();
    
    //initialize buffers
    //Vertex buffer
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexes), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = this.numVertex;

    //Color buffer
    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = this.numColors;
    this.vertexColorBuffer.numItems = this.numVertex;
    
    //initialize shaders
    var fragmentShader = getShader(gl, fragmentShaderSrc, false);
    var vertexShader = getShader(gl, vertexShaderSrc, true);
    this.shaderProgram = createShaderProgram(this.shaderProgram, vertexShader, fragmentShader);
}

PointCloud.prototype.prepareDraw = function()
{
    this.startShader();
}

PointCloud.prototype.startShader = function()
{
    gl.useProgram(this.shaderProgram);

    this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

    this.shaderProgram.cameraUniform = gl.getUniformLocation(this.shaderProgram, "Camera");
    this.shaderProgram.modelUniform = gl.getUniformLocation(this.shaderProgram, "Model");
    this.shaderProgram.pointSizeUniform = gl.getUniformLocation(this.shaderProgram, "pointSize");

    this.shaderProgram.red = gl.getUniformLocation(this.shaderProgram, "red");
    this.shaderProgram.green = gl.getUniformLocation(this.shaderProgram, "green");
    this.shaderProgram.blue = gl.getUniformLocation(this.shaderProgram, "blue");
}

PointCloud.prototype.drawPreparation = function()
{
    var model = mat4.create();
    model = mat4.translate(mat4.create(), model, [0, 0.0, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniform1f(this.shaderProgram.pointSizeUniform, document.getElementById("pointSize").value);
    gl.uniform1f(this.shaderProgram.red, document.getElementById("red").value);
    gl.uniform1f(this.shaderProgram.green, document.getElementById("green").value);
    gl.uniform1f(this.shaderProgram.blue, document.getElementById("blue").value);
    
    var m = camera.matrix();
    gl.uniformMatrix4fv(this.shaderProgram.cameraUniform, false, camera.matrix());
    gl.uniformMatrix4fv(this.shaderProgram.modelUniform, false, model);
}