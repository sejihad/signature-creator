const canvas = document.getElementById("signature-pad");
const context = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let isDrawing = false;
let strokes = []; // Array to store each stroke
let currentStroke = [];

// Function to start drawing
function startDrawing(x, y) {
  isDrawing = true;
  currentStroke = [{ x, y }];
  context.beginPath();
  context.moveTo(x, y);
}

// Function to continue drawing
function draw(x, y) {
  if (isDrawing) {
    const point = { x, y };
    currentStroke.push(point);
    context.lineTo(point.x, point.y);
    context.strokeStyle = "#000";
    context.lineWidth = 2;
    context.stroke();
  }
}

// Function to stop drawing
function stopDrawing() {
  if (isDrawing) {
    strokes.push(currentStroke); // Save the current stroke
    isDrawing = false;
  }
  context.closePath();
}

// Mouse Events
canvas.addEventListener("mousedown", (event) =>
  startDrawing(event.offsetX, event.offsetY)
);
canvas.addEventListener("mousemove", (event) =>
  draw(event.offsetX, event.offsetY)
);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Touch Events to prevent "+" icon on long-press
canvas.addEventListener(
  "touchstart",
  (event) => {
    event.preventDefault(); // Prevent default long-press behavior
    const touch = event.touches[0];
    const x = touch.clientX - canvas.getBoundingClientRect().left;
    const y = touch.clientY - canvas.getBoundingClientRect().top;
    startDrawing(x, y);
  },
  { passive: false }
);

canvas.addEventListener(
  "touchmove",
  (event) => {
    event.preventDefault(); // Prevent scrolling
    const touch = event.touches[0];
    const x = touch.clientX - canvas.getBoundingClientRect().left;
    const y = touch.clientY - canvas.getBoundingClientRect().top;
    draw(x, y);
  },
  { passive: false }
);

canvas.addEventListener("touchend", (event) => {
  event.preventDefault(); // Prevent default behavior on touch end
  stopDrawing();
});

// Undo the last stroke
function undoLastStroke() {
  strokes.pop(); // Remove the last stroke
  redrawCanvas();
}

// Clear the canvas completely
function clearCanvas() {
  strokes = []; // Clear all saved strokes
  redrawCanvas();
}

// Redraw all strokes
function redrawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  for (let stroke of strokes) {
    drawStroke(stroke, context); // Redraw each saved stroke
  }
}

// Helper function to draw a stroke
function drawStroke(stroke, ctx) {
  ctx.beginPath();
  ctx.moveTo(stroke[0].x, stroke[0].y);
  for (let i = 1; i < stroke.length; i++) {
    ctx.lineTo(stroke[i].x, stroke[i].y);
  }
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}
