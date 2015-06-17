var maxVAngle = 85.0;

var mouse =
{
    x : 0,
    y : 0
};

var Camera = function(){ 
    this.position = [0.0, 0.0, 0.0];
    this.hAngle = 0.0;
    this.vAngle = 0.0;
    this.FOV = 80;
    this.nearPlane = 0.01;
    this.farPlane = 10000.0;
    this.viewportAspectRatio = 4.0/3.0;
    
    this.cameraMoveSensivity = 0.1;
    this.cameraLookSensivity = 0.5;
    this.buttonPressed = -1;
    this.keyPressed = 0;
    this.startMouseX = 0;
    this.startMouseY = 0;
    
};

Camera.prototype.getPosition = function()
{
    return camera.position;
};

Camera.prototype.setPosition = function(position)
{
    camera.position = position;
};

Camera.prototype.offsetPosition = function(offset)
{
    var out = vec3.create();
    camera.position = vec3.add(out, camera.position, offset);
};

Camera.prototype.getFOV = function()
{
    return camera.FOV;
};

Camera.prototype.setFOV = function(fov)
{
    camera.FOV = FOV;
};

Camera.prototype.getNearPlane = function()
{
    return camera.nearPlane;
};

Camera.prototype.getFarPlane = function()
{
    return camera.farPlane;
};

Camera.prototype.setNearAndFar = function(nPlane, fPlane)
{
    camera.nearPlane = nPlane;
    camera.farPlane = fPlane;
};

Camera.prototype.orientation = function()
{
    var out = mat4.create();
    var orient = mat4.create();
    orient = mat4.rotate(out, orient, glMatrix.toRadian(camera.vAngle), [1, 0, 0]);
    out = mat4.create();
    orient = mat4.rotate(out, orient, glMatrix.toRadian(camera.hAngle), [0, 1, 0]);
    return orient;
};

Camera.prototype.offsetOrientation = function(rightAngle, upAngle)
{
    camera.hAngle += rightAngle;
    camera.vAngle += upAngle;
    camera.normalizeAngles();
};

//camera.lookAt = function()
//{

//};

Camera.prototype.getViewportAspectRatio = function()
{
    return camera.viewportAspectRatio;
};

Camera.prototype.setViewportAspectRatio = function(aspectRatio)
{
    camera.viewportAspectRatio = aspectRatio;
};

Camera.prototype.forward = function()
{
    var f = vec4.create();
    var aux = mat4.create();
    var out = vec4.create();
    var inverted = mat4.invert(aux, camera.orientation());
    var vectorTrans = vec4.transformMat4(out,[0,0,-1,1], mat4.create());
    f = matrixVectorMultiply(inverted, vectorTrans);
    return [f[0], f[1], f[2]];
};

Camera.prototype.right = function()
{
    var r = vec4.create();
    var aux = mat4.create();
    var out = vec4.create();
    r = matrixVectorMultiply(mat4.invert(aux, camera.orientation()), vec4.transformMat4(out,[1,0,0,1], mat4.create()));
    return [r[0], r[1], r[2]];
};

Camera.prototype.up = function()
{
    var u = vec4.create();
    var aux = mat4.create();
    var out = vec4.create();
    u = matrixVectorMultiply(mat4.invert(aux, camera.orientation()), vec4.transformMat4(out,[0,1,0,1], mat4.create()));
    return [u[0], u[1], u[2]];
};

Camera.prototype.matrix = function()
{
    var r = mat4.create();
    r = mat4.mul(mat4.create(), camera.projection(), camera.view());
    return r;
};

Camera.prototype.projection = function()
{
    var perspective = mat4.create();
    perspective = mat4.perspective(mat4.create(), glMatrix.toRadian(camera.FOV), camera.viewportAspectRatio, camera.nearPlane, camera.farPlane);
    return perspective;
};

Camera.prototype.view = function()
{
    var aux = mat4.create();
    var translated = mat4.create();
    return mat4.mul(mat4.create(), camera.orientation(), mat4.translate(mat4.create(), mat4.create(), vec3.negate(vec3.create(), camera.position)));
};

Camera.prototype.normalizeAngles = function()
{
    camera.hAngle = camera.hAngle % 360;
    if(camera.hAngle < 0.0)
    {
        camera.hAngle += 360.0;
    }
    if(camera.vAngle > maxVAngle)
    {
        camera.vAngle = maxVAngle;
    }
    else if(camera.vAngle < -maxVAngle)
    {
        camera.vAngle = -maxVAngle; 
    }
};

var updateCamera = function()
{
    
    // LOOK
    if(camera.buttonPressed !== -1)
    {
        if(camera.buttonPressed === 0) //LMB
        {
            var newx = (mouse.x - camera.startMouseX) * camera.cameraLookSensivity;
            var newy = (mouse.y - camera.startMouseY) * camera.cameraLookSensivity;
            camera.offsetOrientation(newx, newy);
            camera.startMouseX = mouse.x;
            camera.startMouseY = mouse.y;
        }
        if(camera.buttonPresed === 1) //MMB
        {
            var newy = mouse.y - camera.startMouseY;

            var out = vec3.create();
            if(newy > 0)
                camera.offsetPosition(vec3.scale(out,[0,-1,0], camera.cameraMoveSensivity));
            if(newy < 0)
                camera.offsetPosition(vec3.scale(out,[0,1,0], camera.cameraMoveSensivity));
          
        }
        
    }
    
    //MOVE
    switch(camera.keyPressed) {

        case 87: //W
          var forward = camera.forward();
          var out = vec3.create();
          camera.offsetPosition(vec3.scale(out, forward, camera.cameraMoveSensivity));
          break;

        case 65: //A
          var right = camera.right();
          var out = vec3.create();
          camera.offsetPosition(vec3.scale(out, vec3.negate(vec3.create(), right), camera.cameraMoveSensivity));
          break;

        case 83: //S
          var dir = camera.forward();
          var out = vec3.create();
          camera.offsetPosition(vec3.scale(out, vec3.negate(vec3.create(), dir), camera.cameraMoveSensivity));
          break;

        case 68: //D
          var dir = camera.right();
          var out = vec3.create();
          camera.offsetPosition(vec3.scale(out, dir, camera.cameraMoveSensivity));
          break;

        case 32: //SpaceBar
          var out = vec3.create();
          camera.offsetPosition(vec3.scale(out,[0,1,0], camera.cameraMoveSensivity));
          break;

        case 88: //X
          var out = vec3.create();
          camera.offsetPosition(vec3.scale(out,[0,-1,0], camera.cameraMoveSensivity));
          break;

        case 89: //Y
          camera.offsetOrientation(0, camera.cameraMoveSensivity*10);
          break;

        case 72: //H
          camera.offsetOrientation(0, -camera.cameraMoveSensivity*10);
          break;

        case 71: //G
          camera.offsetOrientation(-camera.cameraMoveSensivity*10, 0);
          break;

        case 74: //J
          camera.offsetOrientation(camera.cameraMoveSensivity*10, 0);
          break;

  }
};

var keyDown=function(key) 
{
    camera.keyPressed = key;
};

var keyUp=function() 
{
    camera.keyPressed = 0;
};

var mouseDown = function(button)
{
    if(camera.buttonPressed === -1)
    {
        camera.buttonPressed = button;
        camera.startMouseX = mouse.x;
        camera.startMouseY = mouse.y;
    }
};

var mouseUp = function(button)
{
    if(camera.buttonPressed === button)
    {
        camera.buttonPressed = -1;
    }
};

var mouseMove = function(event)
{
    mouse.x = event.clientX || event.pageX;
    mouse.y = event.clientY || event.pageY;
};

var mouseWheel = function(delta)
{
    if(delta < 0)
    {
        if(camera.FOV < 85)
            camera.FOV += 1;
    }
    if(delta > 0)
    {
        if (camera.FOV > 10)
            camera.FOV -= 1;
    }
};