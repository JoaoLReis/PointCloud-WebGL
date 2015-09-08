function drawScene() {
   
   fpsCounter();
   
    //drawLaptopScreen();    
    //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    camera.setViewportAspectRatio(gl.viewportWidth/gl.viewportHeight);
    
    camera.updateCamera();
    
//    collisionManager.createOctree();
    
//    renderManager.drawScene();

    var now = new Date().getTime();
    renderManager.drawScene();
    document.getElementById("DebugString1").innerHTML = "Draw Scene Time: " + (new Date().getTime() - now);
    now = new Date().getTime();
    collisionManager.computeCollision();
    document.getElementById("DebugString2").innerHTML = "Collision Computing Time: " + (new Date().getTime() - now);

    now = new Date().getTime();
    var keysPC = Object.keys(currentPointClouds);
    for(var i = 0; i < keysPC.length; i++)
    {
        currentPointClouds[keysPC[i]].resetFrame();
    }
    document.getElementById("DebugString3").innerHTML = "Reset Frame Time: " + (new Date().getTime() - now);
}