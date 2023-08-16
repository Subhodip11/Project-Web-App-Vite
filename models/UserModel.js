const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    followers: [{
        type: String
    }],
    followings: [{
        type: String
    }]
},
    {
        timestamps: true
    }
);

const UserModel = model('Users', UserSchema);

module.exports = UserModel;