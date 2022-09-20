const  express = require('express')
const bodyParser= require ("body-parser");
const mongoose =require ("mongoose")
const dotenv =require('dotenv')
const path =require("path")
const  socket = require("socket.io");
const app = express();
dotenv.config()

const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString,{useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    
    console.log('Database Connected');
})

app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

    next();
});
const  user = require('./routes/user');
app.use('/api/user', user);
const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.log("Listening on port " + port);
});
const io = new socket.Server(server);

io.on("connection", function(socket) {
    console.log("A new socket has joined: " + socket.id)
    //here we can save the data in db also
    socket.on("chat-to-user",async (message)=>{
        console.log("message from user:=>",message)
        io.emit('send-to-grp',message);
    })

    socket.on('disconnect', function () {
        console.log('A user disconnected');
     });
})
// root API
app.get('/',async(req,res) => {
    return res.send("Heloo Print2Block")
})


//socket 

app.get("/chat",async  (req, res) => {
    res.sendFile(path.resolve("client/index.html"));
  });
