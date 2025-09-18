const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Conexión a MongoDB
const mongoUri = 'mongodb+srv://estanlyfabian_db_user:Seguridad28%2A@cluster0.offj4qh.mongodb.net/estudiantes?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Esquema del estudiante
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  enroll: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Modelo del estudiante
const Student = mongoose.model('Student', studentSchema);

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de estudiantes con MongoDB');
});

// GET - Obtener todos los estudiantes
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estudiantes: ' + error.message });
    }
});

// GET - Obtener estudiante por ID
app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estudiante: ' + error.message });
    }
});

// POST - Crear nuevo estudiante
app.post('/api/students', async (req, res) => {
    try {
        const student = new Student({
            name: req.body.name,
            age: req.body.age,
            enroll: req.body.enroll === 'true' || req.body.enroll === true
        });
        
        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear estudiante: ' + error.message });
    }
});

// PUT - Actualizar estudiante
app.put('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                age: req.body.age,
                enroll: req.body.enroll === 'true' || req.body.enroll === true
            },
            { new: true, runValidators: true }
        );
        
        if (!student) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar estudiante: ' + error.message });
    }
});

// DELETE - Eliminar estudiante
app.delete('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        res.json({ message: 'Estudiante eliminado correctamente', student });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar estudiante: ' + error.message });
    }
});

// Ruta para poblar la base de datos con datos iniciales
app.post('/api/populate', async (req, res) => {
    try {
        // Verificar si ya hay datos
        const count = await Student.countDocuments();
        if (count > 0) {
            return res.json({ message: 'La base de datos ya tiene datos' });
        }

        const initialStudents = [
            { name: 'Alice', age: 20, enroll: true },
            { name: 'Bob', age: 22, enroll: false },
            { name: 'Charlie', age: 23, enroll: true },
            { name: 'Dayane', age: 26, enroll: true },
            { name: 'Eve', age: 21, enroll: false },
            { name: 'Frank', age: 24, enroll: true },
            { name: 'Grace', age: 25, enroll: false },
            { name: 'Hannah', age: 22, enroll: true },
            { name: 'Ian', age: 23, enroll: false },
            { name: 'Jack', age: 24, enroll: true }
        ];

        const students = await Student.insertMany(initialStudents);
        res.json({ message: 'Base de datos poblada correctamente', students });
    } catch (error) {
        res.status(500).json({ error: 'Error al poblar la base de datos: ' + error.message });
    }
});

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}...`));

