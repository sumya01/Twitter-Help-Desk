const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltingRounds = 10;

//schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true
    },
    userName: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: 'String',
        required: true,
        trim: true
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified || !user.isNew) {
        // don't rehash if it's an old user
        next();
    }
    else {
        bcrypt.hash(user.password, saltingRounds, function(err, hash) {
            if(err){
                console.log('Error hashing password for user', user.name);
                next(err);
            }
            else {
                user.password = hash;
                next();
            }
        });
    }
});

module.exports = mongoose.model('User', userSchema);
