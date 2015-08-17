function initStuff()
{
    window.onkeydown=function(event){
        camera.keyDown(event.which || event.keyCode);
    };
    
    window.onkeyup=function(event){
        camera.keyUp();
    };
    
    window.onmousemove=function(event)
    {
        camera.mouseMove(event);
    };
    
    window.onmousedown=function(event)
    {
        camera.mouseDown(event.button);
    };
    
    window.onmouseup=function(event)
    {
        camera.mouseUp(event.button);
    };
    
    var canvas = document.getElementById("MyTest");
    
    var MouseWheelHandler = function(event)
    {
	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        camera.mouseWheel(delta);
    };
    
    canvas.addEventListener("mousewheel", MouseWheelHandler, false);
    
    
};

function initGL(canvas) {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
            var msg = "Error creating WebGL context: " + e.toString();
            throw Error(msg);
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}