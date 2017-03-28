var sndMusic;
var sndSFX;

function playSound(sound) {
	if (dC["options"]["SFX"] == false) return;

	sndSFX = new Audio("sfx/" + sound + ".mp3");
	sndSFX.play();
}

function playMusic(music) {
	if (dC["options"]["SFX"] == false) return;

	sndMusic = new Audio("../music/" + music + ".mp3");
	sndMusic.volume = 0.4;
	sndMusic.play();
	sndMusic.addEventListener("ended", function() {
		this.currentTime = 0;
		this.play();
	}, false);
}
