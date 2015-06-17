var gl;

//PARSING
var colors = [];
var vertex = [];
var numberVertex = 0;
var numberColors = 0;
var ready = false;
var camera = new Camera();

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
    
    initShaders();
    initBuffers();

    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.enable(gl.DEPTH_TEST);
  
    tick();
}

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}


