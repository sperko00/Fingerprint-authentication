const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

//schema
const authUserSchema = new Schema({
    email : {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
    },
    password : {
        type: String,
        required : true,
    },
    publicKey : {
        type: String,
    },
});


authUserSchema.methods.isValidPassword = async function(newPassword) {
    try{
        return await bcrypt.compare(newPassword,this.password);
    }catch(error){
        throw new Error(error);
    }
}

//Create model
const AuthUser = mongoose.model('authUser',authUserSchema);

//export model
module.exports = AuthUser;
