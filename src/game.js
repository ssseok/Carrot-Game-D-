"use strict";
import * as sound from "./sound.js";
import Field from "./field.js";
import { ItemType } from "./field.js";

export const Reason = Object.freeze({
  win: "win",
  cancel: "cancel",
  lose: "lose",
});

export default class GameBulder {
  withGameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    console.log(this);
    return new Game(
      this.gameDuration, //
      this.carrotCount, //
      this.bugCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameBtn = document.querySelector(".play__box");
    this.gameTimer = document.querySelector(".timer__box");
    this.gameCount = document.querySelector(".counter__box");

    this.gameBtn.addEventListener("click", (e) => {
      if (this.started) {
        this.stop(Reason.cancel);
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
    if (item === ItemType.carrot) {
      this.count++;

      this.updateCount();
      if (this.count === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
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

  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hiedGameBtn();
    sound.stopBg();
    this.onGameStop && this.onGameStop(reason);
  }

  startGameTimer() {
    let remainingTime = this.gameDuration;
    this.updateTimerText(remainingTime);
    this.timer = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.count ? Reason.win : Reason.lose);
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
