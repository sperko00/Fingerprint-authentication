const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const {JWT_SECRET} = require('./configuration/config');
const User = require('./models/user');


passport.use(new JwtStrategy({
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : JWT_SECRET,
}, async(payload,done) => {
    try{
        //Find user specified in token
        const user = await User.findById(payload.sub);
        if(!user) {
            return done(null,false);
        }
        done(null,user);
    }
    catch{
        done(error,false);
    }
}));

//LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField : 'email',
}, async (email, password, done) => {
    try{
        const user = await User.findOne({email});
        if(!user) {
            return done(null,false);
        }
    
        const isPasswordValid = await user.isValidPassword(password);
        if(!isPasswordValid){
            return done(null,false);
        }
        done(null, user);
    }
    catch(error){
        done(error,false);
    }
   
}))