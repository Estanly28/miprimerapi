const express = require('express');
const app = express();


app.use(express.json());

const students = [
    { id: 1, name: 'LUIS FERNANDO BARILLAS OROZCO', Age: 20 , enroll: true},
    { id: 2, name: 'Bob', Age: 22 , enroll: false},
    { id: 3, name: 'Charlie', Age: 23 , enroll: true},
    { id: 4, name: 'Dayane', Age: 26 , enroll: true},
    { id: 5, name: 'Eve', Age: 21 , enroll: false},
    { id: 6, name: 'Frank', Age: 24 , enroll: true},
    { id: 7, name: 'Grace', Age: 25 , enroll: false},
    { id: 8, name: 'Hannah', Age: 22 , enroll: true},
    { id: 9, name: 'Ian', Age: 23 , enroll: false},
    { id: 10, name: 'Jack', Age: 24 , enroll: true}
];


app.get('/', (req, res) => {
    res.send('Bienvenido a la API de estudiantes');
});

app.get('/api/students', (req, res) => {
    res.send(students);
});

app.get('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('El estudiante con el ID dado no fue encontrado.');
    else res.send(student);
});

app.post('/api/students', (req, res) => {
    const student = {
        id: students.length + 1,
        name: req.body.name,
        age: req.body.age,
        enroll: (req.body.enroll === 'true')
    };
    students.push(student);
    res.send(student);
});

app.delete('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('El estudiante con el ID dado no fue encontrado.');

    const index = students.indexOf(student);
    students.splice(index, 1);
    res.send(student);
});

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Escuchando en el puerto ${port}...`));

