const express = require('express');
const db = require('./config/db');



const app = express();
app.use(express.json());

app.use("/", require('./router/userRouter'));

app.listen(3000, () => {
    console.log("server connect")
});
