// Get all required packages
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function log(msg)
{
   process.stdout.write(msg);
}

// Initialize window
let window;

// Creates the main program window
function CreateWindow()
{
   // Create browser window
   window = new BrowserWindow(
   {
      width: 1400,
      height: 600,
      minWidth: 1000,
      minHeight: 600,
      center: true,
      icon: __dirname + '\\Assets\\Images\\Icon\\app@256.png',
      frame: false
   });

   // Load index.html
   window.loadURL(url.format(
   {
      pathname: path.join(__dirname, '../../index.html'),
      protocol: 'file',
      slashes: true
   }));

   // Open devtools
   window.webContents.openDevTools();

   window.on('closed', () =>
   {
      window = null;
   });
}

// Run create window function
app.on('ready', CreateWindow);

// Quit when all windows are closed
app.on('window-all-closed', () =>
{
   if (process.platform !== 'darwin')
      app.quit();
});

app.on('window-all-closed', () =>
{
   if (process.platform !== 'darwin')
   {
      app.quit();
   }
});