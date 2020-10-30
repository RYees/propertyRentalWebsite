var admin = require("firebase-admin");
const serviceAccount = require('./firebase.json');
//const firebaseToken = 'abcdeabcdeabcde';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://PRW.firebaseio.com"
});



const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24, // 1 day
};

const notification = (message) => {
    try {
        admin
            .messaging()
            .sendMulticast(message)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });

    } catch(error ) 
    {
        console.log(error);
    };

}
module.exports = { notification }

