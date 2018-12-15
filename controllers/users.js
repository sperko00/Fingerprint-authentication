const JWT = require('jsonwebtoken');

const User = require('../models/user');
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
        const { email, password } = req.value.body;
        //check if user exists
        const foundUser = await User.findOne({ email });
        if(foundUser){
            return res.status(403).send({error : "Email is already in use"});
        }
        //create user
        const newUser = new User({ email, password, });
        await newUser.save();
        
        //Generate token
        const token = signToken(newUser);
        
        //respond with token
        res.status(200).json({ token });
    },

    signIn: async(req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({token });
    },

    secret: async(req, res, next) => {
        res.json({resource : "secret"});
    }
}