const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");

mongoose.set('strictQuery', false);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));

main()
.then(() => {
    console.log("Connection successfull")
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

app.get("/", (req, res) => {
    res.send("root is working")
});

//Index route
app.get("/chats", async (req, res) => {
    let Chats = await Chat.find();
    console.log(Chats);
    res.render("index.ejs", { Chats })
});

//New route
app.get("/chats/new", (req, res) => {
    res.render("new.ejs")
})

//Create route
app.post("/chats", (req, res) => {
    let { from, msg, to } = req.body;
    let newChat = new Chat ({
        from: from,
        msg: msg,
        to: to,
        created_at: new Date(),
    });
    newChat.save()
    .then((res) => {
        console.log("chat saved")
    })
    .catch((err) => {
        console.log(err)
    })
    res.redirect("/chats")
})

//Edit route
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id)
    res.render("edit.ejs", { chat })
})

//Update route
app.put("chats/:id", async (req, res) => {
    let {id} = req.params;
    let { msg: newMsg } = req.body;
    console.log(newMsg)
    let updatedChat = await Chat.findByIdAndUpdate(id,
        { msg: newMsg},
        {runValidators: true, new: true},
        { new: true },
        )
        console.log(updatedChat);
        res.redirect("/chats");
})

app.listen(8080, () => {
    console.log("Server is listening to port 8080")
});

