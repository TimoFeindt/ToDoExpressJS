const express = require('express');
const app = express()
const pool = require('./dbConnection')

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }))

app.post('/tasks', async (req, res ) => {
    const newTaskTitle = req.body.inputNewTask;   
    if(newTaskTitle) {
        const taskCompleted = req.body.taskCompleted;
        const query = "INSERT INTO task (title, done) VALUES ('"+ newTaskTitle +"', " + taskCompleted + ")"

        try {
            result = await pool.query(query);        
        } catch (err) {
            console.error('Error executing query', err);
            res.status(500).send('Internal Server Error');
        }
    }
    
    res.redirect('/tasks') 
});

app.get('/tasks', async (req, res) => {
    const query = "SELECT * FROM task ORDER BY id ASC;"
    let result = '';
    try {
        result = await pool.query(query);        
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }

    await res.render('showTask', { result })  
})

app.put('/tasks/:taskId/:completed', async (req, res) => {
    const taskId = req.params.taskId;
    const completed = req.params.completed;
    const query = 'UPDATE task SET done = '+ completed +' WHERE id = ' + taskId + ';';
    try {
        result = await pool.query(query);        
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
}) 

app.delete('/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const query = 'DELETE FROM task WHERE id = ' + taskId + ';';
    try {
        result = await pool.query(query);        
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(3000)