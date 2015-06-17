var lastTime = 0;

function animate() {
	var timeNow = new Date().getTime();
	if (lastTime != 0) {
		var elapsed = timeNow - lastTime;
	}
	lastTime = timeNow;
}