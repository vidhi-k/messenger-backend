const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
// const {isEmail} = require("validator");
const { json } = require("express");
require("dotenv").config();

const User = require("./models/User");
const Message = require("./models/Message");
const e = require("express");
const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());


const connection_url = "mongodb+srv://" + process.env.MONGO_USER + ":" + process.env.PASSWORDMONGO + "@cluster0.amkn3fm.mongodb.net/messengerdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, () => {
    console.log("connected to db")
});


// signup
app.post("/", async(req, res) => {
    try {
        const {name, password} = req.body;
        const user = await User.findOne({name});
        if(!user) throw new Error("user already exists");
        else {
            await User.create({name, password});
            res.status(201).json(user);
        }
        // console.log(req.body);
        
    } catch (e){
        let msg;
        if(e.code == 11000){
            msg = "User alrady exists";
        } else {
            msg = e.message;
        }
        console.log(e);
        res.status(400).json(msg);
    }
});


//login
app.post("/login", async(req, res) => {
    try {
        const {name, password} = req.body;
        const user = await User.findOne({name});
        if(!user) throw new Error('invalid name or password')
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) throw new Error('invalid name or password')
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json(error.message);
    }
})

//create new message
app.post("/messages/new", async(req, res) => {
    try{
        const dbMessage = req.body;
        console.log(req.body);
        const message = await Message.create(dbMessage);
        res.status(201).json(message);
    } catch(e){
        console.log(e);
        res.send(400);
    }   
});

//get messages
app.get("/messages/get",  (req, res) => {
    try {
        const sender = req.body.from;
        const receiver = req.body.to;
        const messages =  Message.find({ from: sender, to: receiver}, (err, docs) => {
            res.send(docs);
            console.log(docs);
        });
    } catch (error) {
        console.log(error);
    }
})

app.get("/users/get", (req, res) => {
    const users = User.find({name: { "$ne" : req.body.name}}, (err, docs) => {
        res.send(docs);
        // console.log(docs);
    })
})
app.listen(9000, () => {
    console.log(`server running on port 3000`);
});