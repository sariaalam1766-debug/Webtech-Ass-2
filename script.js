var slides = [];
var current = 0;

var input = document.getElementById("md-input");
var previewSlide = document.getElementById("preview-slide");
var presentSlide = document.getElementById("present-slide");
var previewPane = document.getElementById("preview-pane");
var editorScreen = document.getElementById("editor-screen");
var presentScreen = document.getElementById("present-screen");
var message = document.getElementById("message");

var defaultText = "# Slide 01\n## This is heading 02\n\nThis is your content\n\n---\n# Slide 02\n## Features\n\n- Create slides\n- Edit slides\n- Save slides\n- Present slides\n\n---\n# Slide 03\n## Thank You\n\nThis is **bold** and this is *italic*";

function convertLine(line) {
  line = line.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  line = line.replace(/\*(.+?)\*/g, "<i>$1</i>");

  if (line.startsWith("### ")) {
    return "<h3>" + line.slice(4) + "</h3>";
  }
  if (line.startsWith("## ")) {
    return "<h2>" + line.slice(3) + "</h2>";
  }
  if (line.startsWith("# ")) {
    return "<h1>" + line.slice(2) + "</h1>";
  }
  if (line.startsWith("- ")) {
    return "<ul><li>" + line.slice(2) + "</li></ul>";
  }
  if (line.trim() === "") {
    return "";
  }
  return "<p>" + line + "</p>";
}

function makeSlides() {
  var parts = input.value.split("---");
  slides = [];

  for (var i = 0; i < parts.length; i++) {
    if (parts[i].trim() !== "") {
      var lines = parts[i].split("\n");
      var html = "";
      for (var j = 0; j < lines.length; j++) {
        html = html + convertLine(lines[j]);
      }
      slides.push(html);
    }
  }

  if (slides.length === 0) {
    slides.push("<p>Empty slide</p>");
  }
}

function showSlide() {
  makeSlides();

  if (current > slides.length - 1) {
    current = slides.length - 1;
  }

  previewSlide.innerHTML = slides[current];
  presentSlide.innerHTML = slides[current];

  var counts = document.querySelectorAll(".slide-count");
  var prevButtons = document.querySelectorAll(".prev-btn");
  var nextButtons = document.querySelectorAll(".next-btn");

  for (var i = 0; i < counts.length; i++) {
    counts[i].textContent = (current + 1) + " / " + slides.length;
    prevButtons[i].disabled = (current === 0);
    nextButtons[i].disabled = (current === slides.length - 1);
  }
}

function nextSlide() {
  if (current < slides.length - 1) {
    current = current + 1;
    showSlide();
  }
}

function prevSlide() {
  if (current > 0) {
    current = current - 1;
    showSlide();
  }
}

function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (presentScreen.classList.contains("hidden")) {
    previewPane.requestFullscreen();
  } else {
    presentScreen.requestFullscreen();
  }
}

function updateFullScreenText() {
  var buttons = document.querySelectorAll(".fs-btn");
  for (var i = 0; i < buttons.length; i++) {
    if (document.fullscreenElement) {
      buttons[i].textContent = "Exit Full Screen";
    } else {
      buttons[i].textContent = "Full Screen";
    }
  }
}

function saveSlides() {
  localStorage.setItem("slides", input.value);
  message.textContent = "Slides saved!";
  setTimeout(function () {
    message.textContent = "";
  }, 2000);
}

function newSlides() {
  input.value = "# New Slide\n\nWrite here";
  current = 0;
  showSlide();
}

function startPresent() {
  editorScreen.classList.add("hidden");
  presentScreen.classList.remove("hidden");
  showSlide();
  presentScreen.requestFullscreen();
}

function backToEditor() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  presentScreen.classList.add("hidden");
  editorScreen.classList.remove("hidden");
}

document.getElementById("save-btn").onclick = saveSlides;
document.getElementById("new-btn").onclick = newSlides;
document.getElementById("present-btn").onclick = startPresent;
document.getElementById("back-btn").onclick = backToEditor;
input.oninput = showSlide;
document.onfullscreenchange = updateFullScreenText;

var prevButtons = document.querySelectorAll(".prev-btn");
var nextButtons = document.querySelectorAll(".next-btn");
var fsButtons = document.querySelectorAll(".fs-btn");

for (var i = 0; i < prevButtons.length; i++) {
  prevButtons[i].onclick = prevSlide;
  nextButtons[i].onclick = nextSlide;
  fsButtons[i].onclick = toggleFullScreen;
}

document.onkeydown = function (event) {
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault();
    saveSlides();
  }
  if (event.key === "F11") {
    event.preventDefault();
    toggleFullScreen();
  }
  if (event.target !== input) {
    if (event.key === "ArrowRight") {
      nextSlide();
    }
    if (event.key === "ArrowLeft") {
      prevSlide();
    }
  }
};

var saved = localStorage.getItem("slides");
if (saved !== null) {
  input.value = saved;
} else {
  input.value = defaultText;
}
showSlide();
