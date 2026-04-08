const express = require('express');
const  app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded());

let students = [
        {name: 'Alice', email: 'alice@example.com'},
    {name: 'Bob', email: 'bob@example.com'},
    {name: 'Charlie', email: 'charlie@example.com'},
    {name: 'David', email: 'david@example.com'}
];

app.get('/', (req, res) => {
    res.render('form', {students: students});
});

app.post('/add-student', (req, res) => {
    const {name, email} = req.body;
    let obj = {name, email};
    students.push(obj);
    res.redirect('/');
});

app.get("/delete-student/:name", (req, res) => {
    const name = req.params.name;
    students = students.filter((student) => {
        return student.name !== name;
    });
    res.redirect('/');
});


app.get("/update-student/:name", (req, res) => {
    const name = req.params.name;
    let student = students.find((s) => s.name === name);
    res.render('update', {student: student});
}); 
app.post('/update-student/:name', (req, res) => {
    const name = req.params.name;
    const {email} = req.body;
    students = students.map((student) => {
        if(student.name === name){
            return {...student, email};
        }
        return student;
    });
    res.redirect('/');
}); 

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});