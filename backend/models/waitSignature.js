const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

//schema
const waitSignatureSchema = new Schema({
    email : {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
    },
    isAuthenticated : {
        type : Boolean,
        required : true,
        default : false,
    },
});


// authUserSchema.methods.isValidPassword = async function(newPassword) {
//     try{
//         return await bcrypt.compare(newPassword,this.password);
//     }catch(error){
//         throw new Error(error);
//     }
// }

//Create model
const WaitSignature = mongoose.model('waitSignature',waitSignatureSchema);

//export model
module.exports = WaitSignature;
