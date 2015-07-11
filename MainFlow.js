var renderManager = new RenderEnhanceManager();
var collisionManager = new CollisionDetectionManager();

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
    
    renderManager.init();
    
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
  
    tick();
}

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}
