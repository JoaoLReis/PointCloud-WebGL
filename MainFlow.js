var gl;
var camera = new Camera();

//Objects
var globalID = 0;
var currentObject;
var currentPolygon;
var currentPolygon2;
var appObjects = new Map();

//PARSING
var colors = [];
var vertex = [];
var numberVertex = 0;
var numberColors = 0;
var ready = false;

//fps Counter
var numFrames = 0;
var time = 0;
var prevTime = new Date().getTime();

function webGLStart() {
    if(!ready)
    {
        alert("I'm not ready!!");
    }
    
    var canvas = document.getElementById("MyTest");
    

    initGL(canvas);
    initStuff();
    
    var depthTextureExtension = gl.getExtension("WEBGL_depth_texture");
    if (!depthTextureExtension) {
        alert("depth textures not supported");
    }
    
    gl.enable(gl.DEPTH_TEST);
    
    pointCloudDrawing();
    polyDrawing();
   // initTexture();
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
  
    tick();
}

function pointCloudDrawing()
{
    var pointCloud = new PointCloud();
    pointCloud.init();
    pointCloud.prepareDraw();
    pointCloud.cleanUp();
    currentObject = pointCloud;
    if(parseIndex == 0)
    {
        appObjects.set("Dragon", currentObject);
    }
    else if(parseIndex == 1)
    {
        appObjects.set("Manuscript", currentObject);
    }
    else if(parseIndex == 2)
    {
        appObjects.set("Parliament", currentObject);
    }
    if(mapContains(appObjects, "Parliament"))
    {
        document.getElementById("Debug2").innerHTML = "True";
    }
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
//    initShaders(1);
//    initDepthScreenBuffers();
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
    polygon.init();
    polygon.prepareDraw();
    polygon.createDepthTexture();
    polygon.cleanUp();
    polygon.modelMatrixUpdateFunction = function() {
        var model = mat4.create();
        model = mat4.invert(mat4.create(), camera.view());
        model = mat4.translate(mat4.create(), model, [0.0046, 0.0027, -0.011]);
        this.modelMatrix = model;
    }
    currentPolygon = polygon;
}

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}


var exampleTexture;

function initTexture()
{
    exampleTexture = gl.createTexture();
    exampleTexture.image = new Image();
    exampleTexture.image.onload = function() {
      handleLoadedTexture(exampleTexture);
    }

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