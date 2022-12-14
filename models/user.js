const   mongoose = require('mongoose');
const  crypto = require('crypto')
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email : { 
        type : String, 
        required : true
    }, 
    hash : String, 
    salt : String
})

UserSchema.methods.setPassword = function(password) { 
    
       this.salt = crypto.randomBytes(16).toString('hex'); 
     
       this.hash = crypto.pbkdf2Sync(password, this.salt,  
       1000, 64, `sha512`).toString(`hex`); 
   }; 
    
   UserSchema.methods.validPassword = function(password) { 
       var hash = crypto.pbkdf2Sync(password,  
       this.salt, 1000, 64, `sha512`).toString(`hex`); 
       return this.hash === hash; 
   }; 
     
   // Exporting module to allow it to be imported in other files 
   const User = module.exports = mongoose.model('User', UserSchema);