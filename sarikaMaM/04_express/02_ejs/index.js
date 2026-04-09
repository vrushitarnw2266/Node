

const express = require('express')

const app = express()
app.set('view engine', 'ejs')


app.get('/',(req,res)=>{
    const users = ["Vrushita", "Sarika", "Pooja", "Rutuja"]
    res.render('home', {items: users})
});
const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`)
});
