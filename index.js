'use strict';
const electron = require('electron');
const {ipcMain} = require('electron');
const scaffold = require('./scaffold');

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function pageURL(page) {
	return `file://${__dirname}/pages/${page}.html`
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	});

	let loggedIn = scaffold.isLoggedIn();
	if (loggedIn) {
		console.log('Index page');
		win.loadURL(pageURL('index'));
	} else {
		console.log('Login page');
		win.loadURL(pageURL('login'));
	}

	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});

// Try to log the user in
ipcMain.on('login', (event, args) => {
	console.log('ipcMain.login');

	scaffold.login(args).then(() => {
		event.sender.send('login-response');
	}).catch(err => {
		event.sender.send('login-response', err);
	});
});

// Login was completed and we now have an auth token
ipcMain.on('login-complete', (events, args) => {
	mainWindow.loadURL(pageURL('index'));
});

ipcMain.on('get-flags', (event) => {
	console.log('ipcMain.get-flags');

	scaffold.getFlags().then(flags => {
		event.sender.send('get-flags-response', {flags: flags});
	}).catch(err => {
		event.sender.send('get-flags-response', {error: err});
	});
})