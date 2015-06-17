function initStuff()
{
    window.onkeydown=function(event){
        keyDown(event.which || event.keyCode);
    };
    
    window.onkeyup=function(event){
        keyUp();
    };
    
    window.onmousemove=function(event)
    {
        mouseMove(event);
    };
    
    window.onmousedown=function(event)
    {
        mouseDown(event.button);
    };
    
    window.onmouseup=function(event)
    {
        mouseUp(event.button);
    };
    
    var canvas = document.getElementById("MyTest");
    
    var MouseWheelHandler = function(event)
    {
	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        mouseWheel(delta);
    };
    
    canvas.addEventListener("mousewheel", MouseWheelHandler, false);
    
    
};

function initGL(canvas) {
	try {
		gl = canvas.getContext("webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}