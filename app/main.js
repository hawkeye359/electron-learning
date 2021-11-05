const { app, BrowserWindow, dialog, Menu, shell } = require("electron");
const fs = require("fs").promises;
let mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({ show: false });
  Menu.setApplicationMenu(appllicationMenu);
  mainWindow.loadFile(`${__dirname}/index.html`);
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  shell.beep();
  shell.beep();
  shell.beep();
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

const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Open File",
        accelerator: "CommandOrControl+O",
        role: "open",
        click: () => {
          exports.openFileDialog();
        },
      },
      {
        label: "Save File",
        accelerator: "CommandOrControl+S",
        click: () => {
          mainWindow.webContents.send("save-markdown");
        },
      },
      {
        label: "Save Html File",
        accelerator: "CommandOrControl+Shift+H",
        click: () => {
          mainWindow.webContents.send("save-html");
        },
      },
    ],
  },
  {
    label: "View",
    submenu: [
      {
        label: "toggle Developers tools",
        role: "toggleDevTools",
      },
    ],
  },
];
if (process.platform === "darwin") {
  const applicationName = "Fire Sale";
  template.unshift({
    label: applicationName,
    submenu: [
      {
        label: "About " + applicationName,
      },
      {
        label: "Quit",
      },
    ],
  });
}
if (process.platform === "win32" || process.platform === "linux") {
  template.push({
    label: "Quit",
    role: "quit",
  });
}

const appllicationMenu = Menu.buildFromTemplate(template);
