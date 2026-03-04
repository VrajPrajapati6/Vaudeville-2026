import Lenis from "@studio-freight/lenis";

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}