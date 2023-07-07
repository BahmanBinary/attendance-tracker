const { app, BrowserWindow, nativeImage, Tray, Menu } = require("electron");
const path = require("path");
const { onWindowClose } = require("./kit/utilities/event-listeners");
const { askForMediaAccess } = require("./kit/utilities/permission");

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) app.quit();

if (require("electron-squirrel-startup")) app.quit();

let mainWindow;
let tray;

const state = { quiting: false };

app.whenReady().then(async () => {
  createTray();

  createWindow();

  askForMediaAccess();

  app.on("activate", () => {
    mainWindow.show();
  });
  app.on("before-quit", () => {
    state.quiting = true;
  });
});

function createTray() {
  const platform = process.platform;

  let exten;

  switch (platform) {
    case "win32":
      exten = "ico";
      break;
    default:
      exten = "png";
      break;
  }

  const icon = nativeImage.createFromPath(
    path.join(
      __dirname,
      `assets/images/icons/tray${
        platform === "darwin" ? "Template" : ""
      }.${exten}`
    )
  );
  tray = new Tray(icon);

  tray.on("click", () => {
    mainWindow.show();
  });
  tray.on("right-click", () => {
    tray.popUpContextMenu();
  });

  const menu = Menu.buildFromTemplate([
    {
      label: "Kara",
      click() {
        mainWindow.show();
      },
    },
    {
      type: "separator",
    },
    {
      label: "Quit",
      role: "quit",
    },
  ]);
  tray.setContextMenu(menu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, "assets/images/icons/logo.png"),
  });

  mainWindow.on("close", onWindowClose(mainWindow, state));

  mainWindow.setMenu(null);

  process.env.ELECTRON_MODE === "dev" &&
    mainWindow.webContents.openDevTools({ mode: "detach" });

  mainWindow.loadURL(
    process.env.ELECTRON_MODE === "dev"
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "./build/index.html")}`
  );
}
