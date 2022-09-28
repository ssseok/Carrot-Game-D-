"use strict";
import * as sound from "./sound.js";
import Field from "./field.js";

export default class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameBtn = document.querySelector(".play__box");
    this.gameTimer = document.querySelector(".timer__box");
    this.gameCount = document.querySelector(".counter__box");

    this.gameBtn.addEventListener("click", (e) => {
      if (this.started) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.gameField = new Field(this.carrotCount, this.bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false;
    this.count = 0;
    this.timer = undefined;
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === "carrot") {
      this.count++;

      this.updateCount();
      if (this.count === this.carrotCount) {
        this.finish(true);
      }
    } else if (item === "bug") {
      this.finish(false);
    }
  };

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.gameInit();
    this.showStopBtn();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBg();
  }

  stop() {
    this.started = false;
    this.stopGameTimer();
    this.hiedGameBtn();
    sound.playAlert();
    sound.stopBg();
    this.onGameStop && this.onGameStop("cancel");
  }

  finish(win) {
    this.started = false;
    this.hiedGameBtn();
    if (win) {
      sound.playWin();
    } else {
      sound.playBug();
    }
    sound.stopBg();
    this.onGameStop && this.onGameStop(win ? "win" : "lose");

    this.stopGameTimer();
  }

  startGameTimer() {
    let remainingTime = this.gameDuration;
    this.updateTimerText(remainingTime);
    this.timer = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(this.timer);
        this.finish(this.carrotCount === this.count);
        return;
      }
      this.updateTimerText(--remainingTime);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }

  updateCount() {
    this.gameCount.innerText = this.carrotCount - this.count;
  }

  showStopBtn() {
    const icon = this.gameBtn.querySelector(".fa-solid");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
    this.gameBtn.style.visibility = "visible";
  }

  hiedGameBtn() {
    this.gameBtn.style.visibility = "hidden";
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = "visible";
    this.gameCount.style.visibility = "visible";
  }

  gameInit() {
    this.count = 0;
    this.gameCount.innerText = this.carrotCount;
    this.gameField.init();
  }
}
