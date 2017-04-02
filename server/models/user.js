/**
 * Created by peachteaboba on 4/02/17.
 */

// Require Mongoose
var mongoose = require('mongoose');

// Create the user schema
var UserSchema = new mongoose.Schema({
    name: {type:String, required: true, minlength: 4},
    maxScore: {type:Number, required: true, default: 0},
    totalScore: {type:Number, required: true, default: 0},
    gamesPlayed: {type:Number, required: true, default: 0}
}, {timestamps: true});

mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'Users'
