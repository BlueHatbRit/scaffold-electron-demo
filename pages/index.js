$(function() {
    const {ipcRenderer} = require('electron');

    let flags;

    function createButton(name, accessible) {
        let button = '<button id="' + name + '" ';
        if (!accessible) {
            button += 'disabled'
        }
        button += '>' + name + '</button>';
        
        $('.main').append(button);
    }

    ipcRenderer.once('get-flags-response', function(event, response) {
        if (response.error) {
            return console.error(response.error);
        }

        let flags = response.flags;
        console.log(flags);

        flags.forEach(function (flag) {
            createButton(flag.name, flag.accessible);
        });
        
    });

    ipcRenderer.send('get-flags');
});