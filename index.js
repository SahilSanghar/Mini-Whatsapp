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

app.get("/chats", async (req, res) => {
    let Chats = await Chat.find();
    console.log(Chats);
    res.render("index.ejs", { Chats })
});
app.listen(8080, () => {
    console.log("Server is listening to port 8080")
});

