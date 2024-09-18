// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('node:path')
const fs = require('fs')

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (!canceled) {
        return filePaths[0]
    }
}

async function readFile(event, filePath) {
    try {
        // console.log(filePath)
        // console.log(typeof filePath)
        const data = fs.readFileSync(filePath, 'utf8')
        return {success: true, data}
    } catch (err) {
        return { success: false, error: err.message }
    }
}

let  mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    mainWindow.loadFile('web/index.html')
}
app.commandLine.appendSwitch("disable-gpu");

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)
    ipcMain.handle('read_file', readFile)
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

