function drawScene() {
   
   fpsCounter();
   
    //drawLaptopScreen();    
    //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    camera.setViewportAspectRatio(gl.viewportWidth/gl.viewportHeight);
    
    camera.updateCamera();
    
    //need to create PC manager to iterate all active PC and draw them
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFrameBuffer);
    
//  gl.colorMask(false, false, false, false);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    currentObject.drawPreparation();
    gl.drawArrays(gl.POINTS, 0, currentObject.vertexPositionBuffer.numItems);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    currentObject.drawPreparation();
    gl.drawArrays(gl.POINTS, 0, currentObject.vertexPositionBuffer.numItems);
    
    currentPolygon.drawPreparation();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.uniform1i(currentPolygon.shaderProgram.samplerUniform, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, currentPolygon.vertexPositionBuffer.numItems);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
}