const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema;

const userSchema = Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: false,
    },
    phoneNumber: {
        type: Number,
        require: true,
    },
    otp: { type: String, default: '' },
    status: { type: Boolean, default: true },
    createdOn: {
        type: Date,
        default: new Date().toISOString()
    },
    modifiedOn: {
        type: Date,
        default: new Date().toISOString()
    },
});

// encrypt the password before storing
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

userSchema.methods.validPassword = function (candidatePassword) {
    if (this.password != null) {
        return bcrypt.compareSync(candidatePassword, this.password);
    } else {
        return false;
    }
};


const User = mongoose.model('User', userSchema);

module.exports = User;