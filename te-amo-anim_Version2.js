window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById('center-btn');
  const canvas = document.getElementById('surprise-canvas');
  const ctx = canvas.getContext('2d');

  // Ensure canvas fills the screen
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Minimal test: draw a red circle when button is clicked
  btn.addEventListener("click", () => {
    btn.style.opacity = 0;
    setTimeout(() => { btn.style.display = 'none'; }, 600);
    canvas.style.display = "block";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 50, 0, Math.PI*2);
    ctx.fillStyle = "#ff1361";
    ctx.fill();
  });
});
