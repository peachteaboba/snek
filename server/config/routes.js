/**
 * Created by peachteaboba on 4/02/17.
 */

// Require the controllers
var users = require('./../controllers/users.js');

// Define the routes
module.exports = function(app) {

    // User routes ===================================================
    app.post('/loginPlayer', function(req, res) {
        users.loginPlayer(req, res);
    });
    app.post('/saveScore', function(req, res) {
        users.saveScore(req, res);
    });
    app.get('/getLeader', function(req, res) {
        users.getLeader(req, res);
    });


};
