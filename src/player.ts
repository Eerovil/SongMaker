import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import AudioPlayer from "osmd-audio-player";

const loadPlayer = async (scoreXml) => {
  if (!document) {
    return;
  }
  let el = document.getElementById("score");
  if (!el) {
    return;
  }
  const osmd = new OpenSheetMusicDisplay(el);
  const audioPlayer = new AudioPlayer();

  await osmd.load(scoreXml.data);
  await osmd.render();
  await audioPlayer.loadScore(osmd as any);

  hideLoadingMessage();
  registerButtonEvents(audioPlayer);
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

function registerButtonEvents(audioPlayer) {
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