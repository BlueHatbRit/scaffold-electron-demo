$(function() {
    const {ipcRenderer} = require('electron');

    console.log('login.js');

    $('#login-form').submit(function(e) {
        e.preventDefault();

        const credentials = {
            email: $('#email').val(),
            password: $('#password').val()
        };

        ipcRenderer.once('login-response', function(event, err) {
            if (err) {
                // Tell the user they need to try again
                return console.log('oh noes :(');
            }

            // Login was completed, lets move to the next page
            $('#success-msg').show();
            ipcRenderer.send('login-complete');
        });
        
        ipcRenderer.send('login', credentials);
    });
});