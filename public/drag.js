let targetToMove = null;
let setWidth;
let oldX = 0;
let direction = false;
let x;
let y;
document.addEventListener('mousedown', function(e) {
  if (e.target.className.includes('task-drag')) {
    targetToMove = e.target.parentElement;
    targetToMove.style = `transition-duration: 200ms;`;
    setWidth = targetToMove.clientWidth;

    let rect = targetToMove.getBoundingClientRect();
    let xCont = e.clientX - rect.left; //x position within the element.
    let yCont = e.clientY - rect.top; //y position within the element.

    x = xCont;
    y = yCont;
  }
});

document.addEventListener(
  'dragover',
  throttle(function(e) {
    try {
      e = e || window.event;
      var dragX = e.pageX - x,
        dragY = e.pageY - y;

      if (e.pageX < oldX) {
        targetToMove.classList.add('left');
        targetToMove.classList.remove('right');
      } else if (e.pageX > oldX) {
        targetToMove.classList.add('right');
        targetToMove.classList.remove('left');
      }
      oldX = e.pageX;
      targetToMove.style = `left: ${dragX}px; top: ${dragY}px; position: fixed; pointer-events:none; transition-duration: 0ms; width: ${setWidth}px;`;
    } catch {
      // Invalid target
    }
  }, 8),
  false
);

function throttle(callback, limit) {
  var wait = false;
  return function() {
    if (!wait) {
      callback.apply(null, arguments);
      wait = true;
      setTimeout(function() {
        wait = false;
      }, limit);
    }
  };
}
