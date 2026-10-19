export function wrapSlide(index, count) {
  return ((index % count) + count) % count;
}

// Keep vertical page scrolling and pinch-to-zoom available to the browser.
export function horizontalWheelDelta(event, direction = "ltr") {
  if (event.ctrlKey) return 0;
  const horizontal = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
  if (!horizontal || (!event.shiftKey && Math.abs(horizontal) <= Math.abs(event.deltaY))) return 0;
  const pixels = horizontal * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 600 : 1);
  return direction === "rtl" ? -pixels : pixels;
}
