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
  const files = dialog.showOpenDialog(mainWindow, {
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
exports.saveMarkDown = async (file, content) => {
  if (!file) {
    file = dialog.showSaveDialog(mainWindow, {
      title: "Save Markdown",
      defaultPath: app.getPath("documents"),
      filters: [
        {
          name: "MarkDown File",
          extensions: ["md"],
        },
      ],
    });
  }
  if (!file) return;
  await fs.writeFile(file, content);
  app.addRecentDocument(file);
  openFileContent(file);
};
exports.saveHtml = async (content) => {
  const file = dialog.showSaveDialog(mainWindow, {
    title: "Save HTML",
    defaultPath: app.getPath("documents"),
    filters: [
      {
        name: "HTML File",
        extensions: ["html"],
      },
    ],
  });
  if (!file) return;
  await fs.writeFile(file, content);
};
const openFileContent = (exports.openFileContent = async (file) => {
  const content = await fs.readFile(file);
  const contentString = content.toString();
  app.addRecentDocument(file);
  mainWindow.webContents.send("file-opened", file, contentString);
});
