(() => {
  const controlSelector =
    "button:not(:disabled), a[href], [role='button']:not([aria-disabled='true'])";
  const publicSurfaceSelector =
    ".portfolio-main, .portfolio-navigation, .mobile-bubble-trigger, .mobile-bubble-nav, .mobile-bubble-backdrop, footer";
  let audioContext;
  let resumePromise;
  let warnedAboutAudio = false;

  function getAudioContext() {
    if (!("AudioContext" in window)) return null;
    if (!audioContext || audioContext.state === "closed") {
      audioContext = new window.AudioContext();
    }
    return audioContext;
  }

  function resumeAudioContext(context) {
    if (context.state === "running") return Promise.resolve();
    resumePromise ??= context.resume().finally(() => {
      resumePromise = undefined;
    });
    return resumePromise;
  }

  function playTone(context, isHover) {
    if (context.state !== "running") return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    const duration = isHover ? 0.04 : 0.06;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(isHover ? 880 : 620, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      isHover ? 740 : 460,
      now + (isHover ? 0.025 : 0.045),
    );
    gain.gain.setValueAtTime(isHover ? 0.018 : 0.028, now);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + (isHover ? 0.035 : 0.055),
    );
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  function getPublicControl(target) {
    if (!(target instanceof Element)) return null;
    const control = target.closest(controlSelector);
    return control?.closest(publicSurfaceSelector) ? control : null;
  }

  function playAfterResume(context, isHover) {
    return resumeAudioContext(context)
      .then(() => playTone(context, isHover))
      .catch((error) => {
        if (!warnedAboutAudio) {
          warnedAboutAudio = true;
          console.warn("Portfolio interaction sound could not be enabled.", error);
        }
      });
  }

  document.addEventListener(
    "pointerover",
    (event) => {
      if (event.pointerType !== "mouse") return;
      const control = getPublicControl(event.target);
      if (!control) return;
      if (event.relatedTarget instanceof Node && control.contains(event.relatedTarget)) {
        return;
      }

      const context = getAudioContext();
      if (context) void playAfterResume(context, true);
    },
    true,
  );

  document.addEventListener(
    "click",
    (event) => {
      if (!getPublicControl(event.target)) return;
      const context = getAudioContext();
      if (!context) return;
      if (context.state === "running") {
        playTone(context, false);
      } else {
        void playAfterResume(context, false);
      }
    },
    true,
  );
})();
