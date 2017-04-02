/**
 * Created by andyf on 4/02/17.
 */

app.factory('loginFactory', function ($http) {
    var factory = {};
    var currentUser;

    // Login method
    factory.login = function(input, callback){
      $http.post('/loginPlayer', input).then(function(output){
        callback(output);
      });
    }

    factory.setUser = function(user, callback){
      // console.log(user);
      currentUser = user;
      callback();
    }

    factory.getUser = function(callback){
      callback(currentUser);
    }

    // Save score method
    factory.saveScore = function(input, callback){
      $http.post('/saveScore', input).then(function(output){
        callback(output);
      });
    }

    factory.getLeader = function(callback){
      $http.get('/getLeader').then(function(output){
        callback(output);
      });
    }



    return factory;
});
