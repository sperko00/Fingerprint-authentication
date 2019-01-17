const JWT = require('jsonwebtoken');
var speakeasy = require('speakeasy');
var QRCode = require('qrcode');

const User = require('../models/user');
const AuthUser = require('../models/authUser');

const { JWT_SECRET } = require('../configuration/config'); 

signToken = user => {
    return token = JWT.sign({
        iss: 'FingerprintAuthentication',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1 ),
    }, JWT_SECRET);
}

module.exports = {
    signUp: async (req, res, next) => {
        const email = req.value.body.email;
        const password = req.value.body.password;
        //check if user exists
        const foundUser = await User.findOne({ email });
        if(foundUser){
            return res.status(403).send({error : "Email is already in use"});
        }
        
        var secret = speakeasy.generateSecret({ length: 30 });
        //create user
        const newUser = new User({ email, password, secret : secret.base32 });
        await newUser.save();

        var data = {
            secret : secret.base32,
            email : newUser.email,
        }
        var data_url = await QRCode.toDataURL(JSON.stringify(data))
        
        
        res.status(200).json({data_url});
    },

    verifyDevice: async(req, res, next) => {
        let data = req.body;
        const foundUser = await User.findOne({ email:data.email });
       
        if(!foundUser){
            return res.status(404).send({error : "User not found"});
        }

        if(foundUser.secret != data.secret)
            return res.status(404).send({error : "User secret is not valid."});
        const foundAuthUser = await AuthUser.findOne({ email : foundUser.email })
        if(foundAuthUser){
            return res.status(403).send({error : "Email already asociated with device."});
        }
        const newAuthUser = new AuthUser({ email : foundUser.email, password:foundUser.password, publicKey : data.publicKey });
        await newAuthUser.save();

        res.status(200).json("User saved succesfully!");
    },

    signIn: async(req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    

    secret: async(req, res, next) => {
        res.json({resource : "secret"});
    }
}