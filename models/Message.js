const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: String,
    from: String,
    to: String,
    timeStamp: String,
    date: String
});

const Message = new mongoose.model("Message", messageSchema);
module.exports = Message;