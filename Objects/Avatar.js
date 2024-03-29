/* 
 * This file was created by João Luís Reis
 */

var Avatar = function(name, vertices, colors, numberColors, numberVertex, points) {
    this.ID = 0;
    this.name = name;
    this.points = points;
    this.vertexes = vertices;
    this.colors = colors;
    this.originalColors = colors;
    this.numColors = numberColors;
    this.numVertex = numberVertex;
    this.modelMatrix = mat4.create();
    this.translation = [0, 0, 0];
    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
    this.moveDirection = [0, 0, 0];
    this.modelMatrixUpdateFunction = function(){
        var model = mat4.create();
        //model = mat4.invert(mat4.create(), camera.view());
        model = mat4.translate(mat4.create(), model, this.translation);
        model = mat4.rotateX(mat4.create(), model, this.rotX);
        model = mat4.rotateY(mat4.create(), model, this.rotY);
        model = mat4.rotateZ(mat4.create(), model, this.rotZ);
        this.modelMatrix = model;
    };
    
    this.vertexPositionBuffer;
    this.vertexColorBuffer;
    
    this.shaderProgram;
    
    //Collision detection
    this.octreeManager = new OctreeManager();
    this.octreeManager.init();
    this.wireframe = null;
};

//region RENDERING
Avatar.prototype.init = function()
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
};

Avatar.prototype.prepareDraw = function()
{
    this.startShader();
};

Avatar.prototype.startShader = function()
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
};

Avatar.prototype.drawPreparation = function()
{
    this.prepareDraw();
    
    this.modelMatrixUpdateFunction();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniform1f(this.shaderProgram.pointSizeUniform, document.getElementById("pointSize") ? document.getElementById("pointSize").value : 2);
    gl.uniform1f(this.shaderProgram.red, document.getElementById("red") ? document.getElementById("red").value : 1);
    gl.uniform1f(this.shaderProgram.green, document.getElementById("green") ? document.getElementById("green").value : 1);
    gl.uniform1f(this.shaderProgram.blue, document.getElementById("blue") ? document.getElementById("blue").value : 1);
    
    var m = camera.matrix();
    gl.uniformMatrix4fv(this.shaderProgram.cameraUniform, false, camera.matrix());
    gl.uniformMatrix4fv(this.shaderProgram.modelUniform, false, this.modelMatrix);
};

Avatar.prototype.drawToScreen = function()
{
    gl.drawArrays(gl.POINTS, 0, this.vertexPositionBuffer.numItems);

    var now = new Date().getTime();
    this.octreeManager.pointCloudOctree.updatePosition(this.modelMatrix);
    document.getElementById("DebugString6").innerHTML = "Octree position Update Time: " + (new Date().getTime() - now);
    if(drawOctrees && showOctree)
    {
        this.octreeManager.prepareOctreeDraw();
        this.octreeDrawingUpdate();
        this.wireframe.draw();
    }
};

Avatar.prototype.draw = function()
{
    this.drawPreparation();
    this.drawToScreen();
};

Avatar.prototype.cleanUp = function()
{
    gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
};
//endregion

//region OCTREE DRAWING
Avatar.prototype.octreeDrawing = function()
{
    var now = new Date().getTime();
    var verts = this.octreeManager.pointCloudOctree.wireframeVertices;
    var vertices = [];
    var depths = [];
    for(var i = 0; i < verts.length; i++)
    {
        var point = verts[i].position();
        for(var k = 0; k < point.length; k++)
            vertices.push(point[k]);
        depths.push(verts[i].depth);
    }
    
    console.log("!$!$!$!$ Avatar" + vertices.length);
    console.log("!$!$!$!$ Avatar" + depths.length);
    this.wireframe = new Wireframe(vertices, vertices.length/3, depths, this.octreeManager.pointCloudOctree.maxDepth);
    this.wireframe.init();
    this.wireframe.prepareDraw();
    this.wireframe.cleanUp();
    addTime("Octree drawn", now);
};

Avatar.prototype.octreeDrawingUpdate = function()
{
    var now = new Date().getTime();
    var verts = this.octreeManager.pointCloudOctree.wireframeVertices;
    var vertices = [];
    for(var i = 0; i < verts.length; i++)
    {
        var point = verts[i].position();
        for(var k = 0; k < point.length; k++)
            vertices.push(point[k]);
    }
    this.wireframe.vertexes = vertices;
    this.wireframe.initVPosBuffer();
//    this.wireframe.prepareDraw();
//    this.wireframe.cleanUp();
//    addTime("Octree drawn", now);
};
//endregion

//region GETTERS/SETTERS
Avatar.prototype.resetColor = function()
{
    for(var i = 0; i < this.colors.length; i++)
    {
        this.colors[i] = this.originalColors[i];
    }
};

Avatar.prototype.getRotation = function()
{
    var model = mat4.create();
    return mat4.mul(mat4.create(), mat4.rotateX(mat4.create(), model, this.rotX), mat4.mul(mat4.create(), mat4.rotateY(mat4.create(), model, this.rotY), mat4.rotateZ(mat4.create(), model, this.rotZ)));
};

Avatar.prototype.getModelMatrix = function()
{
    return this.modelMatrix;
};

Avatar.prototype.updateModelMatrix = function(newModel)
{
    this.modelMatrix = newModel;
};

Avatar.prototype.updateMoveDirection = function(x, y, z)
{
    this.moveDirection = [this.moveDirection + x, this.moveDirection.y + y, this.moveDirection.z + z];
    this.translation[0] += x;
    this.translation[1] += y;
    this.translation[2] += z;
};
//endregion

Avatar.prototype.resetFrame = function()
{
    this.moveDirection = [0, 0, 0];
};