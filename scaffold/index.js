const Promise = require('bluebird');
const request = require('request');

const serviceUrl = 'https://bhb-scaffold.herokuapp.com/api/v1.0';
//const serviceUrl = 'http://local.nodeapp.org/api/v1.0';

let authToken;

function isLoggedIn() {
    return !!authToken;
}

function login(object) {
    const options = {
        url: serviceUrl + '/sessions',
        form: object
    };

    return new Promise((resolve, reject) => {
        request.post(options, function(err, res, body) {
            if (err) {
                // Well this could be loads of things but this
                // is just a demo.
                return reject(new Error('incorrect user credentials'));
            }
            
            body = JSON.parse(body);
            authToken = body.token;

            resolve();
        });
    });
}

function getFlags() {
    return new Promise((resolve, reject) => {
        if (!authToken) {
            reject(new Error('user is not logged in'));
        }
        
        const options = {
            url: serviceUrl + '/flags',
            headers: {
                'Authorization': 'Bearer '+ authToken
            }
        };

        request.get(options, function(err, res, body) {
            if (err) {
                return reject(err);
            }

            body = JSON.parse(body);
            resolve(body);
        });
    });
}

module.exports = {
    isLoggedIn: isLoggedIn,
    login: login,
    getFlags: getFlags
};