// Navigation toggle
const toggleNav = document.querySelector(".toggle-nav");
const mobileMenu = document.querySelector(".mobile-menu");
const closeNav = document.querySelector(".close-nav");

toggleNav.addEventListener("click", () => {
  mobileMenu.style.display = "flex";
});

closeNav.addEventListener("click", () => {
  mobileMenu.style.display = "none";
});

// Switch button to toggle text signature display
const switchBtn = document.querySelector(".s-checkbox");
const textSignature = document.querySelector(".text-signature");

switchBtn.addEventListener("click", () => {
  if (textSignature.style.display === "grid") {
    textSignature.style.display = "none"; // Hide the text signature
  } else {
    textSignature.style.display = "grid"; // Show the text signature
  }
});

// Font selection
const wFont = document.querySelectorAll(".w-font");
let currentFontFamily = "Arial"; // Default font family

wFont.forEach((div) => {
  div.addEventListener("click", function () {
    // Remove the border from all .w-font divs
    wFont.forEach((d) => (d.style.border = "1px solid transparent"));

    // Apply the border to the clicked div
    this.style.border = "1px solid blue";

    // Set the font family based on data-font attribute and clear canvas
    currentFontFamily = this.getAttribute("data-font");
    clearCanvas();

    // Redraw text if input has content
    if (textInput.value) {
      drawTextOnCanvas(textInput.value);
    }
  });
});

// Mega menu open
const megaList = document.querySelectorAll(".mega-list");

megaList.forEach((singleMega) => {
  singleMega.addEventListener("click", () => {
    // Get the currently open mega-menu
    const currentlyOpenMenu = document.querySelector(
      ".mega-menu[style*='grid']"
    ); // Select the open menu

    // If there is an open menu and it's not the next sibling of the clicked item, hide it
    if (
      currentlyOpenMenu &&
      currentlyOpenMenu !== singleMega.nextElementSibling
    ) {
      currentlyOpenMenu.style.display = "none"; // Hide the currently open menu
    }

    const nextSibling = singleMega.nextElementSibling; // Get the next sibling element

    // Toggle display only for the clicked item's next sibling
    if (nextSibling) {
      nextSibling.style.display =
        nextSibling.style.display === "grid" ? "none" : "grid";
    }
  });
});

// Signature canvas setup
const canvas = document.getElementById("signature-pad");
const context = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let isDrawing = false;
let strokes = [];
let currentStroke = [];
let currentColor = "#000";

// Start drawing
function startDrawing(x, y) {
  isDrawing = true;
  currentStroke = [{ x, y, color: currentColor }];
  context.beginPath();
  context.moveTo(x, y);
}

// Draw function
function draw(x, y) {
  if (isDrawing) {
    const point = { x, y, color: currentColor };
    currentStroke.push(point);
    context.lineTo(point.x, point.y);
    context.strokeStyle = currentColor;
    context.lineWidth = 2;
    context.stroke();
  }
}

// Stop drawing
function stopDrawing() {
  if (isDrawing) {
    strokes.push(currentStroke);
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

// Touch Events
canvas.addEventListener(
  "touchstart",
  (event) => {
    event.preventDefault();
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
    event.preventDefault();
    const touch = event.touches[0];
    const x = touch.clientX - canvas.getBoundingClientRect().left;
    const y = touch.clientY - canvas.getBoundingClientRect().top;
    draw(x, y);
  },
  { passive: false }
);

canvas.addEventListener("touchend", (event) => {
  event.preventDefault();
  stopDrawing();
});

// Undo last stroke
function undoLastStroke() {
  strokes.pop();
  redrawCanvas();
}

// Clear canvas
function clearCanvas() {
  strokes = [];
  redrawCanvas();
}

// Redraw all strokes
function redrawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let stroke of strokes) {
    drawStroke(stroke, context);
  }
}

// Helper to draw each stroke
function drawStroke(stroke, ctx) {
  ctx.beginPath();
  ctx.moveTo(stroke[0].x, stroke[0].y);
  ctx.strokeStyle = stroke[0].color;
  for (let i = 1; i < stroke.length; i++) {
    ctx.lineTo(stroke[i].x, stroke[i].y);
    ctx.strokeStyle = stroke[i].color;
  }
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

// Footer list toggle
document.querySelectorAll(".footer-top h3").forEach((h3) => {
  h3.addEventListener("click", function () {
    const list = this.nextElementSibling;
    const img = this.querySelector("img");
    if (list.style.display === "none" || !list.style.display) {
      list.style.display = "flex";
      img.src = "./assets/img/down-arrow.png";
    } else {
      list.style.display = "none";
      img.src = "./assets/img/right-arrow.png";
    }
  });
});

// Color box selection
document.querySelectorAll(".color-box").forEach((box) => {
  box.addEventListener("click", function () {
    // Remove border from all boxes
    document
      .querySelectorAll(".color-box")
      .forEach((b) => (b.style.border = "none"));
    this.style.border = `2px solid black`;
    currentColor = this.getAttribute("data-color");
  });
});

// Text input for canvas
const textInput = document.querySelector(".w-signature");

textInput.addEventListener("input", () => {
  clearCanvas();
  drawTextOnCanvas(textInput.value);
});

function drawTextOnCanvas(text) {
  context.font = `25px ${currentFontFamily}`;
  context.fillStyle = currentColor;

  const textWidth = context.measureText(text).width;
  const x = (canvas.width - textWidth) / 2;
  const y = canvas.height / 2 + 12.5;

  context.fillText(text, x, y);
}

// Download button functionality
const downloadBtn = document.querySelector(".f-download");

downloadBtn.addEventListener("click", () => {
  const dataURL = canvas.toDataURL("image/png"); // Convert canvas to data URL
  const link = document.createElement("a"); // Create a temporary link element
  link.href = dataURL; // Set the link href to the data URL
  link.download = "signature.png"; // Set the desired file name for the download
  document.body.appendChild(link); // Append link to the body (required for Firefox)
  link.click(); // Programmatically click the link to trigger the download
  document.body.removeChild(link); // Remove the link after download
});
