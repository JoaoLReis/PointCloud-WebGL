var renderManager = new RenderEnhanceManager();
var collisionManager = new CollisionDetectionManager();

function webGLInit()
{
    var canvas = document.getElementById("MyTest");
    
    initGL(canvas);
    initStuff();
    
    if(depthTextures)
    {
        var depthTextureExtension = gl.getExtension("WEBGL_depth_texture");
        if (!depthTextureExtension) {
            alert("depth textures not supported");
        } 
    }
    document.getElementById("Ready").innerHTML = "Inited - Not Ready";
}

function webGLStart() {
    if(!ready)
    {
        alert("I'm not ready!!");
    }

//    if(drawOctrees){
//        var keysPC = Object.keys(currentPointClouds);
//        for(var i = 0; i < keysPC.length; i++)
//        {
//            currentPointClouds[keysPC[i]].octreeManager.prepareOctreeDraw();
//            currentPointClouds[keysPC[i]].octreeDrawing();
//        }
//    }
    gl.enable(gl.DEPTH_TEST);
    
    
//    octreeManager.init();
//    octreeManager.createOctree(centerPC, XYZlength, vertex);
//    octreeManager.prepareOctreeDraw();
    
    renderManager.init();
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    tick();
}

function createSynthPC()
{
    document.getElementById("Ready").innerHTML = "Synthesizing";
    document.getElementById("Ready").style.color = "red";
    generateSynthPC("Other", 200000, -5, 5);
    generateSynthPC("Avatar", 1000, -1, 1);
    document.getElementById("Ready").innerHTML = "Ready";
    document.getElementById("Ready").style.color = "green";
    ready = true;
}

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}
