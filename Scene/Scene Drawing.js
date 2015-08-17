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
    renderManager.drawRegularScene();
    collisionManager.computeCollision();
    
}