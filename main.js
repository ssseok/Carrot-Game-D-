"use strict";

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector(".field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".play__box");
const gameTimer = document.querySelector(".timer__box");
const gameCount = document.querySelector(".counter__box");
const popUp = document.querySelector(".pop-up");
const popUpText = document.querySelector(".pop-up__text");
const popUpRefresh = document.querySelector(".pop-up__refresh");

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const alertSound = new Audio("./sound/alert.wav");
const bgSound = new Audio("./sound/bg.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const winSound = new Audio("./sound/game_win.mp3");
let started = false;
let count = 0;
let timer = undefined;

popUpRefresh.addEventListener("click", (e) => {
  startGame();
  hidePopUp();
});

field.addEventListener("click", onFieldClick);

gameBtn.addEventListener("click", (e) => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

function startGame() {
  started = true;
  gameInit();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}
function stopGame() {
  started = false;
  stopGameTimer();
  hiedGameBtn();
  showPopUpWithText("REPLAY?");
  playSound(alertSound);
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
  hiedGameBtn();
  win ? playSound(winSound) : playSound(bugSound);
  stopSound(bgSound);
  showPopUpWithText(win ? "YOU WON😊" : "YOU LOST🥹");
  stopGameTimer();
}

function startGameTimer() {
  let remainingTime = GAME_DURATION_SEC;
  updateTimerText(remainingTime);
  timer = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(timer);
      finishGame(CARROT_COUNT === count);
      return;
    }
    updateTimerText(--remainingTime);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}

function updateCount() {
  gameCount.innerText = CARROT_COUNT - count;
}

function showStopBtn() {
  const icon = document.querySelector(".fa-solid");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
  gameBtn.style.visibility = "visible";
}

function hiedGameBtn() {
  gameBtn.style.visibility = "hidden";
}

function hidePopUp() {
  popUp.classList.add("pop-up__hide");
}

function showTimerAndScore() {
  gameTimer.style.visibility = "visible";
  gameCount.style.visibility = "visible";
}

function showPopUpWithText(text) {
  popUpText.innerText = text;
  popUp.classList.remove("pop-up__hide");
}

function gameInit() {
  count = 0;
  field.innerHTML = ``;
  gameCount.innerText = CARROT_COUNT;
  addItem("carrot", CARROT_COUNT, "img/carrot.png");
  addItem("bug", BUG_COUNT, "img/bug.png");
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.top = `${y}px`;
    item.style.left = `${x}px`;
    field.append(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function playSound(sound) {
  sound.currenTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.currenTime = 0;

  sound.pause();
}

function onFieldClick(e) {
  if (!started) {
    return;
  }
  const target = e.target;
  if (target.matches(".carrot")) {
    target.remove();
    count++;
    playSound(carrotSound);
    updateCount();
    if (count === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
}
