var renderManager = new RenderEnhanceManager();
var collisionManager = new CollisionDetectionManager();

function webGLInit()
{
    var canvas = document.getElementById("MyTest");
    
    initGL(canvas);
    initStuff();
    
    var depthTextureExtension = gl.getExtension("WEBGL_depth_texture");
    if (!depthTextureExtension) {
        alert("depth textures not supported");
    } 
    document.getElementById("Ready").innerHTML = "Inited - Not Ready";
}

function webGLStart() {
    if(!ready)
    {
        alert("I'm not ready!!");
    }
//    
//    var canvas = document.getElementById("MyTest");
//    
//    initGL(canvas);
//    initStuff();
//    
//    var depthTextureExtension = gl.getExtension("WEBGL_depth_texture");
//    if (!depthTextureExtension) {
//        alert("depth textures not supported");
//    }
    
    
//    if(drawOctrees){
//        var keysPC = Object.keys(currentPointClouds);
//        for(var i = 0; i < keysPC.length; i++)
//        {
//            currentPointClouds[keysPC[i]].collisionManager.prepareOctreeDraw();
//            currentPointClouds[keysPC[i]].octreeDrawing();
//        }
//    }
    gl.enable(gl.DEPTH_TEST);
    
    
//    collisionManager.init();
//    collisionManager.createOctree(centerPC, XYZlength, vertex);
//    collisionManager.prepareOctreeDraw();
    
    renderManager.init();
    
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
  
    tick();
}

function octreeDraw()
{
}

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}
