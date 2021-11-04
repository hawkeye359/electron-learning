const marked = require("marked");
const path = require("path");
let filePath = null;
let originalContent = "";
let isEdited = false;
const { remote, ipcRenderer } = require("electron");
const { openFileDialog, saveMarkDown, saveHtml, openFileContent } =
  remote.require("./main.js");
const currentWindow = remote.getCurrentWindow();
const markdownView = document.querySelector("#markdown");
const htmlView = document.querySelector("#html");
const newFileButton = document.querySelector("#new-file");
const openFileButton = document.querySelector("#open-file");
const saveMarkdownButton = document.querySelector("#save-markdown");
const revertButton = document.querySelector("#revert");
const saveHtmlButton = document.querySelector("#save-html");
const showFileButton = document.querySelector("#show-file");
const openInDefaultButton = document.querySelector("#open-in-default");

const renderMarkdownToHtml = (markdown) => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

markdownView.addEventListener("keyup", (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent);
  isEdited = currentContent !== originalContent;
  upDateUI(isEdited);
});
openFileButton.addEventListener("click", () => {
  openFileDialog();
});
saveMarkdownButton.addEventListener("click", () => {
  saveMarkDown(filePath, markdownView.value);
});
saveHtmlButton.addEventListener("click", () => {
  saveHtml(htmlView.innerHTML);
});
ipcRenderer.on("file-opened", (e, file, content) => {
  filePath = file;
  originalContent = content;
  markdownView.value = content;
  renderMarkdownToHtml(content);
  upDateUI();
});
const upDateUI = (edited) => {
  let title = "Fire Sale";
  if (filePath) {
    title = `${path.basename(filePath)}-${title}`;
  }
  if (edited) {
    title = "• " + title;
  }
  saveMarkdownButton.disabled = !edited;
  currentWindow.setTitle(title);
};
// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   e.returnValue = "";
//   window.close();
// });
document.addEventListener("dragstart", (e) => {
  e.preventDefault();
  console.log("dragstart");
});
document.addEventListener("dragleave", (e) => {
  e.preventDefault();
  console.log("dragleave");
});
document.addEventListener("dragover", (e) => {
  e.preventDefault();
  console.log("dragover");
});
document.addEventListener("drop", (e) => {
  e.preventDefault();
  console.log("drop");
});

const getDraggedFile = (e) => {
  const file = e.dataTransfer.items[0];
  return file;
};
const getDroppedFile = (e) => {
  const file = e.dataTransfer.files[0];
  return file;
};
const fileTypeisSupported = (file) => {
  return ["text/plain", "text/markdown"].includes(file.type);
};
markdownView.addEventListener("dragover", (e) => {
  const file = getDraggedFile(e);
  if (fileTypeisSupported(file)) {
    markdownView.classList.add("drag-over");
  } else {
    markdownView.classList.add("drag-error");
  }
  console.log("dragover");
});
markdownView.addEventListener("dragleave", (e) => {
  markdownView.classList.remove("drag-over");
  markdownView.classList.remove("drag-error");
});
markdownView.addEventListener("drop", (e) => {
  const file = getDroppedFile(e);
  if (fileTypeisSupported(file)) {
    openFileContent(file.path);
  } else {
    alert("that file type is not supported");
  }
  markdownView.classList.remove("drag-over");
  markdownView.classList.remove("drag-error");
});
