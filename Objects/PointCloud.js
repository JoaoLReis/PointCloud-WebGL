/* 
 * This file was created by João Luís Reis
 */

var PointCloud = function(name, vertices, colors, numberColors, numberVertex, points) {
    this.ID = 0;
    this.name = name;
    this.points = points;
    this.vertexes = vertices;
    this.colors = colors;
    this.originalColors = [];
    for(var i = 0; i < colors.length; i++)
    {
        this.originalColors[i] = colors[i];
    }
    this.numColors = numberColors;
    this.numVertex = numberVertex;
    
    this.vertexPositionBuffer;
    this.vertexColorBuffer;
    
    this.shaderProgram;
    
    //Collision detection
    this.octreeManager = new OctreeManager();
    this.octreeManager.init();
    this.wireframe = null;
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

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.DYNAMIC_DRAW);
    this.vertexColorBuffer.itemSize = this.numColors;
    this.vertexColorBuffer.numItems = this.numVertex;
    
    //initialize shaders
    var fragmentShader = getShader(gl, fragmentShaderSrc, false);
    var vertexShader = getShader(gl, vertexShaderSrc, true);
    this.shaderProgram = createShaderProgram(this.shaderProgram, vertexShader, fragmentShader);
};

PointCloud.prototype.initColorBuffer = function(index, data)
{
    //Color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);

    gl.bufferSubData(gl.ARRAY_BUFFER, index*4, data);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = this.numColors;
    this.vertexColorBuffer.numItems = this.numVertex;
};

PointCloud.prototype.prepareDraw = function()
{
    this.startShader();
};

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
};

PointCloud.prototype.drawPreparation = function()
{
    this.prepareDraw();
    
    var model = mat4.create();
    model = mat4.translate(mat4.create(), model, [0, 0.0, 0]);

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
    gl.uniformMatrix4fv(this.shaderProgram.modelUniform, false, model);
};

PointCloud.prototype.drawToScreen = function()
{
    gl.drawArrays(gl.POINTS, 0, this.vertexPositionBuffer.numItems);

    if(drawOctrees && showOctree)
    {   
        this.wireframe.draw();
    }
};

PointCloud.prototype.draw = function()
{
    this.drawPreparation();
    this.drawToScreen();
};

PointCloud.prototype.cleanUp = function()
{
    gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
};

PointCloud.prototype.octreeDrawing = function()
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
    
    console.log("!$!$!$!$ PC " + vertices.length);
    console.log("!$!$!$!$ PC " + depths.length);
    this.wireframe = new Wireframe(vertices, vertices.length/3, depths, this.octreeManager.pointCloudOctree.maxDepth);
    this.wireframe.init();
    this.wireframe.prepareDraw();
    this.wireframe.cleanUp();
    addTime("Octree drawn", now);
};

PointCloud.prototype.checkCollision = function (bmin, bmax, results)
{
    return this.octreeManager.checkCollision(bmin, bmax, results);
};

PointCloud.prototype.resetColor = function()
{
    for(var i = 0; i < this.colors.length; i++)
    {
        this.colors[i] = this.originalColors[i];
    }
};

PointCloud.prototype.resetFrame = function()
{
};