class BackgroundMusicPlayer {
  constructor() {
    this.playlist = [
      "/src/audio/music/middle-age-song-1.mp3",
      "/src/audio/music/middle-age-song-2.mp3",
      "/src/audio/music/middle-age-song-3.mp3",
    ];
    this.currentTrackIndex = 0;
    this.audio = new Audio();
    this.audio.volume = 0.25;
    this.isPlaying = false;
    this.isStarted = false;

    this.setupAutoplay();
    this.setupControls();
    this.updateUI();
  }

  setupAutoplay() {
    this.audio.addEventListener("ended", () => {
      this.playNext();
    });

    // Skip if the error in next song
    this.audio.addEventListener("error", () => {
      console.warn("Audio error, skipping track");
      this.playNext();
    });

    // Following state play/pause
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.updateUI();
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.updateUI();
    });
    // END Following state play/pause
  }

  setupControls() {
    document.addEventListener("DOMContentLoaded", () => {
      const playPauseBtn = document.getElementById("setMusic");
      if (playPauseBtn) {
        playPauseBtn.addEventListener("click", () => {
          if (!this.isStarted) {
            // Якщо музика ще не запускалась — запустити
            this.start();
          } else if (this.isPlaying) {
            this.pause();
          } else {
            this.resume();
          }
        });
      }
    });
  }

  playNext() {
    this.currentTrackIndex =
      (this.currentTrackIndex + 1) % this.playlist.length;
    this.audio.src = this.playlist[this.currentTrackIndex];
    this.audio.play().catch(() => {});
  }

  start() {
    this.audio.src = this.playlist[this.currentTrackIndex];
    this.audio.play().catch(() => {
      console.log(
        "'Autoplay blocked - music will start after user interaction'"
      );
    });
    this.isStarted = true;
    this.updateUI();
  }

  getPlayingStatus() {
    return this.isPlaying;
  }

  updateUI() {
    const statusElement = document.getElementById("musicStatusValue");
    if (statusElement) {
      let iconName, statusClass;

      if (!this.isStarted) {
        iconName = "music_off";
        statusClass = "music-not-started";
      } else if (this.isPlaying) {
        iconName = "music_note";
        statusClass = "music-playing";
      } else {
        iconName = "music_off";
        statusClass = "music-paused";
      }

      statusElement.textContent = iconName;
      statusElement.className = `music_status_value material-symbols-outlined ${statusClass}`;
    }
  }

  pause() {
    this.audio.pause();
  }

  resume() {
    this.audio.play().catch(() => {
      console.log("Cannot resume playback");
    });
  }
}

// Create and start Player
const bgMusic = new BackgroundMusicPlayer();

// Start after first user click
document.addEventListener(
  "click",
  () => {
    bgMusic.start();
  },
  { once: true }
);

export default bgMusic;
