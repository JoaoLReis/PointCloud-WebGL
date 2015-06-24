var gl;
var camera = new Camera();

//Objects
var globalID = 0;
var currentObject;
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
    
    //createDepthTexture();
    pointCloudDrawing();
    //polyDrawing();
    
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.enable(gl.DEPTH_TEST);
  
    tick();
}

function pointCloudDrawing()
{
    //initShaders(0);
    //initPCBuffers();
    var pointCloud = new PointCloud();
    pointCloud.init();
    pointCloud.prepareDraw();
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
    initShaders(1);
    initDepthScreenBuffers();
}

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}


