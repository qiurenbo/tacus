tacus = new Tacus();
tacus.start();

setTimeout(() => {
  tacus.stop();
  tacus.play();
}, 5000);
