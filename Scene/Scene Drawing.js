function drawScene() {
   
   fpsCounter();
   
    //drawLaptopScreen();    
    //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    camera.setViewportAspectRatio(gl.viewportWidth/gl.viewportHeight);
    
    updateCamera();
    
    var model = mat4.create();
    model = mat4.translate(mat4.create(), model, [0, 0.0, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pointVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, pointVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniform1f(shaderProgram.pointSizeUniform, document.getElementById("pointSize").value);
    gl.uniform1f(shaderProgram.red, document.getElementById("red").value);
    gl.uniform1f(shaderProgram.green, document.getElementById("green").value);
    gl.uniform1f(shaderProgram.blue, document.getElementById("blue").value);
    
    var m = camera.matrix();
    
    gl.uniformMatrix4fv(shaderProgram.cameraUniform, false, camera.matrix());
    gl.uniformMatrix4fv(shaderProgram.modelUniform, false, model);
    
    gl.drawArrays(gl.POINTS, 0, pointVertexPositionBuffer.numItems);


    
}

function drawLaptopScreen()
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    camera.setViewportAspectRatio(gl.viewportWidth/gl.viewportHeight);
    
    updateCamera();
    
    var model = mat4.create();
    model = mat4.translate(mat4.create(), model, [0, 0.0, 0]);
    
    gl.uniform1i(shaderProgram.useTexturesUniform, true);

    gl.bindBuffer(gl.ARRAY_BUFFER, laptopScreenVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, laptopScreenVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, laptopScreenVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, laptopScreenVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, laptopScreenVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, laptopScreenVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    
    gl.uniformMatrix4fv(shaderProgram.cameraUniform, false, camera.matrix());
    gl.uniformMatrix4fv(shaderProgram.modelUniform, false, model);
    
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, laptopScreenVertexPositionBuffer.numItems);
}
