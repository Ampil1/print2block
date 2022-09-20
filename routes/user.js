const  express =require('express'); 
const router = express.Router(); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); 
const User = require('../models/user'); 
  
// User login api 
router.post('/login', (req, res) => { 
  
    User.findOne({ email : req.body.email }, function(err, user) { 
        if (user === null) { 
            return res.status(400).send({ 
                message : "User not found."
            }); 
        } 
        else { 
            if (user.validPassword(req.body.password)) { 
                let jwtSecretKey = process.env.JWT_SECRET_KEY; 
            let data = { 
                time: Date(), 
                userId: user._id, 
            } 
            const userDetail = user.email;
            const token = jwt.sign(data, jwtSecretKey);
                return res.status(201).send({ 
                    token:token,
                    userdetails:userDetail,
                    message : "User Logged In successfully", 
                }) 
            } 
            else { 
                return res.status(400).send({ 
                    message : "email or  Password invalid"
                }); 
            } 
        } 
    }); 
}); 
  
// User signup api 
router.post('/signup', (req, res, next) => { 
    let newUser = new User(); 
    newUser.name = req.body.name, 
    newUser.email = req.body.email 
    newUser.setPassword(req.body.password); 
    newUser.save((err, User) => { 
        if (err) { 
            return res.status(400).send({ 
                message : "Failed to add user."
            }); 
        } 
        else { 
            return res.status(201).send({ 
                message : "User added successfully."
            }); 
        } 
    }); 
}); 

router.get('/validateToken', (req, res) => { 
  
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY; 
    let jwtSecretKey = process.env.JWT_SECRET_KEY; 
  
    try { 
        const token = req.header(tokenHeaderKey); 
  
        const verified = jwt.verify(token, jwtSecretKey); 
        if(verified){ 
            return res.status(200).send("Successfully Verified"); 
        }else{ 
            return res.status(401).send(error); 
        } 
    } catch (error) { 
        return res.status(401).send(error); 
    } 
});
module.exports = router; 