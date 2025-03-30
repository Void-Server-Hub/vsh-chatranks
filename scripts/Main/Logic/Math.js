import { world, system } from "@minecraft/server";

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function setTickTimeout(callback, tick) {
  new TickTimeout(callback, tick);
}

export function setTickInterval(callback, tick) {
  new TickTimeout(callback, tick, true);
}

class TickTimeout {
  constructor(callback, tick, loop = false) {
    let callbackTick = 0;
    let finish = false;

    system.run(function tick(data) {
      if (finish) return;
      if (callbackTick === 0) callbackTick = data.currentTick + tick;
      
      if (callbackTick <= data.currentTick) {
        try {
          callback();
        } catch (error) {
          console.warn(`Error during callback execution: ${error}`);
        }

        if (loop) {
          callbackTick = data.currentTick + tick;
        } else {
          finish = true;
        }
      }
    });
  }
}

export function dhm(ms) {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  ms %= 24 * 60 * 60 * 1000;
  const hours = Math.floor(ms / (60 * 60 * 1000));
  ms %= 60 * 60 * 1000;
  const minutes = Math.floor(ms / (60 * 1000));
  const seconds = Math.floor((ms % (60 * 1000)) / 1000);
  return [days, hours, minutes, seconds];
}

export function removeItemOnce(arr, value) {
  const index = arr.indexOf(value);
  if (index !== -1) arr.splice(index, 1);
  return arr;
}
