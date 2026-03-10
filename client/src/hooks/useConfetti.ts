import confetti from "canvas-confetti";

/** Fire a small burst of confetti for a correct answer */
export function fireCorrectConfetti() {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#F5A623", "#4ECDC4", "#2ECC71", "#9B59B6", "#FFD700"],
    startVelocity: 30,
    gravity: 0.8,
    scalar: 0.9,
    ticks: 200,
  });
}

/** Fire a big celebration burst for completing a test or reaching a milestone */
export function fireBigCelebration() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#F5A623", "#4ECDC4", "#2ECC71"],
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#9B59B6", "#FFD700", "#E74C3C"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/** Fire a star burst for a perfect score */
export function firePerfectScore() {
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.5 },
    colors: ["#FFD700", "#F5A623", "#FFF"],
    shapes: ["star"],
    startVelocity: 40,
    gravity: 0.6,
    scalar: 1.2,
    ticks: 300,
  });
}
