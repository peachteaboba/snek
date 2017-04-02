/**
 * Created by peachteaboba on 4/02/17.
 */

// Require Mongoose
var mongoose = require('mongoose');

// Require the model and save it in a variable
var User = mongoose.model('User');



module.exports = (function() {
    return {

        loginPlayer: function(req, res) {
          console.log(req.body);

          User.findOne({name: req.body.name}).exec(function(err, result){
            if(err){
              console.log(err);
              res.status(400).send({error_message: "SERVER ERROR - loginPlayer"});
            } else {

              if(result){
                console.log("user found".yellow);
                res.json(result)
              } else {
                console.log("new user".yellow);

                var user = new User({name: req.body.name});
                user.save(function(err){
                  if(err){
                    console.log(err);
                    res.status(400).send({error_message: "SERVER ERROR - loginPlayer - save"});
                  } else {
                    console.log("===== successfully registered a new user =====".green);
                    res.json(user);
                  }
                })
              }
            }
          }); // end findOne
        },

        saveScore: function(req, res){
          console.log(req.body);
          User.findOne({_id: req.body._id}).exec(function(err, result){

            if(err){
              console.log(err);
              res.status(400).send({error_message: "SERVER ERROR - saveScore"});
            } else {

              console.log(result);
              result.gamesPlayed++;
              result.totalScore+=req.body.score;

              if(result.maxScore < req.body.score){
                result.maxScore = req.body.score;
              }

              result.save(function(err){
                if(err){
                  console.log(err);
                  res.status(400).send({error_message: "SERVER ERROR - saveScore - save"});
                } else {
                  console.log("===== successfully saved a new score =====".green);
                  res.json(result);
                }
              });

            }

          }); // end findOne
        },

        getLeader: function(req, res){
          // Get the leaderboard data
          User.find({}).select('name maxScore').sort({maxScore: -1}).limit(10).exec(function(err, leadArr){
            if(err){
              console.log(err);
              res.status(400).send({error_message: "SERVER ERROR - saveScore - leader"});
            } else {
              console.log("===== successfully got the leaderboard =====".green);
              res.json(leadArr);
            }
          });
        }



    }
})();









// end
