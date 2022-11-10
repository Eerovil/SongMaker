import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import AudioPlayer from "osmd-audio-player";


const loadPlayer = async (scoreXml: string, autoplay: boolean) => {
  if (!document) {
    return;
  }
  let el = document.getElementById("score");
  if (!el) {
    return;
  }
  el.innerHTML = "";
  const osmd = new OpenSheetMusicDisplay(el);
  if (!(window as any).audioPlayer) {
    (window as any).audioPlayer = new AudioPlayer();
  }
  const audioPlayer = (window as any).audioPlayer;
  audioPlayer.playbackSettings.masterVolume = 40;

  await osmd.load(scoreXml);
  await osmd.render();
  await audioPlayer.loadScore(osmd as any);

  hideLoadingMessage();
  registerButtonEvents(audioPlayer);
  setTimeout(() => {
    if (audioPlayer.state === "STOPPED" && autoplay) {
      audioPlayer.play();
    }
  }, 500)
}

function hideLoadingMessage() {
  if (!document) {
    return;
  }
  const el = document.getElementById("loading");
  if (!el) {
    return;
  }
  el.style.display = "none";
}

function registerButtonEvents(audioPlayer: AudioPlayer) {
  if (!document) {
    return;
  }
  let el = document.getElementById("btn-play");
  if (el) {
    el.addEventListener("click", () => {
      if (audioPlayer.state === "STOPPED" || audioPlayer.state === "PAUSED") {
        audioPlayer.play();
      }
    });
  }
  el = document.getElementById("btn-pause");
  if (el) {
    el.addEventListener("click", () => {
      if (audioPlayer.state === "PLAYING") {
        audioPlayer.pause();
      }
    });
  }
  el = document.getElementById("btn-stop");
  if (el) {
    el.addEventListener("click", () => {
      if (audioPlayer.state === "PLAYING" || audioPlayer.state === "PAUSED") {
        audioPlayer.stop();
      }
    });
  }
}

export { loadPlayer };