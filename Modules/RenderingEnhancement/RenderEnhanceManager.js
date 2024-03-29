/* 
 * This file was created by João Luís Reis
 */

var RenderEnhanceManager = function()
{
    this.ID = 0;
};

RenderEnhanceManager.prototype.init = function()
{
//    pointCloudDrawing();
    if(depthTextures)
        polyDrawing();
//    octreeDrawing(0);
//    avatarDrawing(1);
   // initTexture();
};

RenderEnhanceManager.prototype.drawScene = function()
{
    this.drawRegularScene(depthTextures);
};

RenderEnhanceManager.prototype.drawRegularScene = function(depth)
{
    if(depth)
    {
        //Set drawing to framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, depthFrameBuffer);

        //Draw the point cloud
        gl.clear(gl.DEPTH_BUFFER_BIT);
        var keysPC = Object.keys(currentPointClouds);
        for(var i = 0; i < keysPC.length; i++)
        {
            currentPointClouds[keysPC[i]].draw();
        }
        //Set drawing to canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        //Draw the Quad with the depth texture
        currentPolygon.drawPreparation();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, depthTexture);
        gl.uniform1i(currentPolygon.shaderProgram.samplerUniform, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, currentPolygon.vertexPositionBuffer.numItems);

        currentPolygon2.drawPreparation();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.uniform1i(currentPolygon2.shaderProgram.samplerUniform, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, currentPolygon2.vertexPositionBuffer.numItems);

    }
    else{
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    
    var keysPC = Object.keys(currentPointClouds);
    for(var i = 0; i < keysPC.length; i++)
    {
        currentPointClouds[keysPC[i]].draw();
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

RenderEnhanceManager.prototype.drawComplexScene = function()
{
    //TODO need to create PC manager to iterate all active PC and draw them
    
    //Set drawing to framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFrameBuffer);
    
    //Draw the point cloud
    gl.colorMask(false, false, false, false);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    currentObject.drawPreparation();
    gl.drawArrays(gl.POINTS, 0, currentObject.vertexPositionBuffer.numItems);
    
    //Draw the floor
    currentPolygon2.drawPreparation();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.uniform1i(currentPolygon2.shaderProgram.samplerUniform, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, currentPolygon2.vertexPositionBuffer.numItems);
    
    //Set drawing to canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.colorMask(true, true, true, true);
    
    //Draw the point cloud
    currentObject.drawPreparation();
    gl.drawArrays(gl.POINTS, 0, currentObject.vertexPositionBuffer.numItems);
    
    //Draw the floor
    currentPolygon2.drawPreparation();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.uniform1i(currentPolygon2.shaderProgram.samplerUniform, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, currentPolygon2.vertexPositionBuffer.numItems);
    
    //Draw the Quad with the depth texture
    currentPolygon.drawPreparation();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.uniform1i(currentPolygon.shaderProgram.samplerUniform, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, currentPolygon.vertexPositionBuffer.numItems);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};


function pointCloudDrawing()
{
    var pointCloud = new PointCloud();
    pointCloud.init();
    pointCloud.prepareDraw();
    pointCloud.cleanUp();
    currentObject = pointCloud;
//    if(parseIndex == 0)
//    {
//        appObjects.set("Dragon", currentObject);
//    }
//    else if(parseIndex == 1)
//    {
//        appObjects.set("Manuscript", currentObject);
//    }
//    else if(parseIndex == 2)
//    {
//        appObjects.set("Parliament", currentObject);
//    }
//    if(mapContains(appObjects, "Parliament"))
//    {
//        document.getElementById("Debug2").innerHTML = "True";
//    }
//    document.getElementById("Debug2").innerHTML = "";
//    appObjects.forEach(function(value, key, mapObj) {
//    document.getElementById("Debug2").innerHTML += key;
//    });
    
}

function mapContains(map, id)
{
    var contains = false;
    
    map.forEach(function(value, key, mapObj) {
    if(key === id){
        contains = true;
    }
    });
 
    return contains;
}

function polyDrawing()
{
    //initShaders(1);
    //initDepthScreenBuffers();
    var vertices = [
         0.01, 0.005625, 0,
        0, 0.005625, 0,
         0.01, 0, 0,
        0, 0, 0
        ];
        
    var vertexNormals = [
         0.000000, 0, -1,
         0.000000, 0, -1,
         0.000000, 0, -1,
         0.000000, 0, -1
    ];
    
    var textureCoords = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];
    
    var polygon = new Polygon(vertices, vertexNormals, textureCoords);
    polygon.init(true);
    polygon.prepareDraw();
    polygon.createDepthTexture();
    polygon.cleanUp();
    polygon.modelMatrixUpdateFunction = function() {
        var model = mat4.create();
        model = mat4.invert(mat4.create(), camera.view());
        model = mat4.translate(mat4.create(), model, [0.0046, 0.0027, -0.011]);
        this.modelMatrix = model;
    };
    currentPolygon = polygon;
    
    var vertices2 = [
        50, -4, 50,
        -50, -4, 50,
        50, -4, -50,
        -50, -4, -50
        ];
        
    var vertexNormals2 = [
         1, 1, 0,
         0, 1, 0,
         0, 1, 1,
         1, 0, 1
    ];
    
    var textureCoords2 = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];
    
    var polygon2 = new Polygon(vertices2, vertexNormals2, textureCoords2);
    polygon2.init(false);
    polygon2.prepareDraw();
    polygon2.createDepthTexture();
    polygon2.cleanUp();
    polygon2.modelMatrixUpdateFunction = function() {
    };
    currentPolygon2 = polygon2;
}

function octreeDrawing(index)
{
    var verts = collisionManager.pointCloudOctrees[index].wireframeVertices;
    var vertices = [];
    var depths = [];
    for(var i = 0; i < verts.length; i++)
    {
        var point = verts[i].position();
        for(var k = 0; k < point.length; k++)
            vertices.push(point[k]);
        depths.push(verts[i].depth);
        
    }
    
    console.log("!$!$!$!$" + vertices.length);
    console.log("!$!$!$!$" + depths.length);
    var octree = new Wireframe(vertices, vertices.length/3, depths, index);
    octree.init();
    octree.prepareDraw();
    octree.cleanUp();
    currentPolygon = octree;
}

function avatarDrawing(index)
{
    var verts = collisionManager.pointCloudOctrees[index].wireframeVertices;
    var vertices = [];
    var depths = [];
    for(var i = 0; i < verts.length; i++)
    {
        var point = verts[i].position();
        for(var k = 0; k < point.length; k++)
            vertices.push(point[k]);
        depths.push(verts[i].depth);
        
    }
    
    console.log("!$!$!$!$" + vertices.length);
    console.log("!$!$!$!$" + depths.length);
    var octree = new Wireframe(vertices, vertices.length/3, depths, index);
    octree.init();
    octree.prepareDraw();
    octree.cleanUp();
    avatar = octree;
    
}

var exampleTexture;

function initTexture()
{
    exampleTexture = gl.createTexture();
    exampleTexture.image = new Image();
    exampleTexture.image.onload = function() {
      handleLoadedTexture(exampleTexture);
    };

    exampleTexture.image.src = "CoolDesktopWallpaper.jpg";
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);
}