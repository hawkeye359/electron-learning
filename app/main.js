const { app, BrowserWindow, dialog } = require("electron");
const fs = require("fs").promises;
let mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({ show: false });
  mainWindow.loadFile(`${__dirname}/index.html`);
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
});

exports.openFileDialog = () => {
  const files = dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      { name: "TextFile", extensions: ["txt"] },
      { name: "MarkdownFiles", extensions: ["md"] },
    ],
    buttonLabel: "Unveil",
    title: "FireSale",
  });
  if (!files) return;
  openFileContent(files[0]);
};
const openFileContent = async (file) => {
  const content = await fs.readFile(file);
  const contentString = content.toString();
  mainWindow.webContents.send("file-opened", file, contentString);
};
