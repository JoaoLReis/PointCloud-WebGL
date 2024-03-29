var maxVAngle = 85.0;

var mouse =
{
    x : 0,
    y : 0
};

var Camera = function(){ 
    this.position = [0.0, 0.0, -5.0];
    this.hAngle = 0.0;
    this.vAngle = 0.0;
    this.FOV = 80;
    this.nearPlane = 0.01;
    this.farPlane = 100.0;
    this.viewportAspectRatio = 16.0/9.0;
    
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
    var vectorTrans = vec4.transformMat4(out,[0,0,-document.getElementById("cameraSpeed").value,1], mat4.create());
    f = matrixVectorMultiply(inverted, vectorTrans);
    return [f[0], f[1], f[2]];
};

Camera.prototype.right = function()
{
    var r = vec4.create();
    var aux = mat4.create();
    var out = vec4.create();
    r = matrixVectorMultiply(mat4.invert(aux, camera.orientation()), vec4.transformMat4(out,[document.getElementById("cameraSpeed").value,0,0,1], mat4.create()));
    return [r[0], r[1], r[2]];
};

Camera.prototype.up = function()
{
    var u = vec4.create();
    var aux = mat4.create();
    var out = vec4.create();
    u = matrixVectorMultiply(mat4.invert(aux, camera.orientation()), vec4.transformMat4(out,[0,document.getElementById("cameraSpeed").value,0,1], mat4.create()));
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

Camera.prototype.updateCamera = function()
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

        case 38: //arrow up
            var dir = 0.1;
            currentPointClouds["Avatar"].updateMoveDirection(0, 0, dir);
            break;

        case 37: //arrow left
            var dir = 0.1;
            currentPointClouds["Avatar"].updateMoveDirection(dir, 0, 0);
            break;

        case 40: //arrow down
            var dir = -0.1;
            currentPointClouds["Avatar"].updateMoveDirection(0, 0, dir);
            break;

        case 39: //arrow right
            var dir = -0.1;
            currentPointClouds["Avatar"].updateMoveDirection(dir, 0, 0);
            break;

        case 32: //SpaceBar
          var dir = camera.up();
          var out = vec3.create();
          camera.offsetPosition(vec3.scale(out,dir, camera.cameraMoveSensivity));
          break;

        case 88: //X
          var dir = camera.up();
          var out = vec3.create();
          camera.offsetPosition(vec3.scale(out,vec3.negate(vec3.create(), dir), camera.cameraMoveSensivity));
          break;

        case 89: //Y
            var dir = 0.1;
            currentPointClouds["Avatar"].updateMoveDirection(0, dir, 0);
          break;
        case 85: //U
            var dir = -0.1;
            currentPointClouds["Avatar"].updateMoveDirection(0, dir, 0);
        break;

        case 72: //H
            currentPointClouds["Avatar"].rotX += 0.1;
          break;

        case 71: //G
            currentPointClouds["Avatar"].rotY += 0.1;
          break;

        case 74: //J
            currentPointClouds["Avatar"].rotZ += 0.1;
          break;

        case 79: //O
            showOctree = !showOctree;
            break;
            
        case 80: //P
            var keysPC = Object.keys(currentPointClouds);
            for(var i = 0; i < keysPC.length; i++)
            {
                currentPointClouds[keysPC[i]].resetColor();
            }
            break;
  }
};

Camera.prototype.keyDown=function(key) 
{
    camera.keyPressed = key;
};

Camera.prototype.keyUp=function() 
{
    camera.keyPressed = 0;
};

Camera.prototype.mouseDown = function(button)
{
    if(camera.buttonPressed === -1)
    {
        camera.buttonPressed = button;
        camera.startMouseX = mouse.x;
        camera.startMouseY = mouse.y;
    }
};

Camera.prototype.mouseUp = function(button)
{
    if(camera.buttonPressed === button)
    {
        camera.buttonPressed = -1;
    }
};

Camera.prototype.mouseMove = function(event)
{
    mouse.x = event.clientX || event.pageX;
    mouse.y = event.clientY || event.pageY;
};

Camera.prototype.mouseWheel = function(delta)
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