// http://expressjs.com/en/4x/api.htm for express features
// npm packages installed npm install 
// for run --> node index.js
// for warnings --> joi package

const Joi = require('joi')
const express = require('express');

const app = express();
app.use(express.json())

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
]

app.get('/', (req, res) => {
    res.send("Hello bulo!");
});


app.get('/api/courses', (req, res) => {
    res.send(courses);
});
// get course with ID
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    //404 error
    if (!course) res.status(404).send('The course with the given ID was not found.')
    res.send(course)
})

// post a course
app.post('/api/courses', (req, res) => {
    // for using Joi
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body, schema)
    console.log(result)
    // before Joi if(!req.body.name || req.body.name.length <3) res.status(404).send('The course name is too short or does not exist')
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course)
    res.send(course)
})



//Port
// for listening dynamic port
const port = process.env.PORT || 3000;
console.log(port)
app.listen(port, () => console.log(`Listening on port ${port}`))


app.put('/api/courses/:id', (req, res) => {
    //look up the course
    // if not existing, retunr 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) res.status(404).send('The course with the given ID was not found.')
    //validate

    const result = validateCourse(req.body)
    const { error } = validateCourse(req.body)
    /* const schema = {
         name: Joi.string().min(3).required()
     }
 
     const result = Joi.validate(req.body, schema) */
    if (error) {
        res.status(400).send(result.error.details[0].message)
        return
    }

    // update course and return

    course.name = req.body.name
    res.send(course)
})

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema)

}

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    // Not exist return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) res.status(404).send('The course with the given ID was not found.')
    // Delete
    const index = courses.indexOf(course)
    courses.splice(index, 1)
    // Return the same course

    res.send(course)
})

