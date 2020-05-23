const LocalStrategy = require('passport-local').Strategy;
function init(passport) {
    const authenticateUser = (email, password, doe) => {
        
    } 

    passport.use(new LocalStrategy({ 
        usernameField: 'udiseno'
    }, authenticateUser))
   
}
module.exports = init;
