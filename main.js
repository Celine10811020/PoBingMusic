const audio = document.getElementById("music");
const startButton = document.getElementById("startGame");
const continueButton = document.getElementById("continueGame");
let timeoutId = null;

// 設定音樂視覺化
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = 200;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);

function visualize() {
  requestAnimationFrame(visualize);
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 2;
  }
}
visualize();

function getRandomTime() {
  const min = parseInt(document.getElementById("minTime").value) * 1000;
  const max = parseInt(document.getElementById("maxTime").value) * 1000;
  return Math.random() * (max - min) + min;
}

function startMusic() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  audio.currentTime = 0;
  audio.play();
  schedulePause();
  startButton.disabled = true;
  continueButton.disabled = true;
}

function schedulePause() {
  timeoutId = setTimeout(() => {
    audio.pause();
    continueButton.disabled = false;
  }, getRandomTime());
}

function continueMusic() {
  audio.play();
  schedulePause();
  continueButton.disabled = true;
}

startButton.addEventListener("click", startMusic);
continueButton.addEventListener("click", continueMusic);
