const marked = require("marked");
const path = require("path");
let filePath = null;
let originalContent = "";
const { remote, ipcRenderer } = require("electron");
const { openFileDialog } = remote.require("./main.js");
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
  upDateUI(currentContent !== originalContent);
});
openFileButton.addEventListener("click", () => {
  openFileDialog();
});
ipcRenderer.on("file-opened", (e, file, content) => {
  filePath = file;
  originalContent = content;
  markdownView.value = content;
  renderMarkdownToHtml(content);
  upDateUI();
});
const upDateUI = (isEdited) => {
  let title = "Fire Sale";
  if (filePath) {
    title = `${path.basename(filePath)}-${title}`;
    if (isEdited) {
      title = "• " + title;
    }
  }
  currentWindow.setTitle(title);
};
