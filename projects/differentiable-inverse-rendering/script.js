function fallbackCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "absolute";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(area);
  return copied;
}

async function copyBibtex() {
  const block = document.getElementById("bibtex-block");
  const status = document.getElementById("copy-status");
  const text = block.innerText.trim();
  let copied = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (error) {
      copied = fallbackCopy(text);
    }
  } else {
    copied = fallbackCopy(text);
  }
  status.textContent = copied ? "BibTeX copied." : "Copy failed.";
  window.setTimeout(() => {
    status.textContent = "";
  }, 1800);
}

function resetVideo(video) {
  video.pause();
  video.currentTime = 0;
}

function setupVideo(video) {
  video.addEventListener("ended", () => {
    resetVideo(video);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("copy-bibtex");
  const videos = document.querySelectorAll(".inline-video");
  if (button) {
    button.addEventListener("click", copyBibtex);
  }
  videos.forEach(setupVideo);
});
