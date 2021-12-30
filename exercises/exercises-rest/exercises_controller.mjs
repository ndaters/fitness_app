import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = 3000;

const app = express();

app.use(express.json());

/**
 * Create a new exercise with the name, reps, weight, unit, date provided in the body
 */
 app.post('/exercises', (req, res) => {
    exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error(error);
            // In case of an error, send back status code 500 in case of an error.
            // A better approach will be to examine the error and send an
            // error status code corresponding to the error.
            res.status(500).json({ Error: 'Request failed' });
        });
});


/**
 * Retrive the exercise corresponding to the ID provided in the URL.
 */
 app.get('/exercises/:id', (req, res) => {
    const exerciseId = req.params.id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => { 
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }         
         })
        .catch(error => {
            res.status(500).json({ Error: 'Request failed' });
            // Updated response code to 500 per assignment
        });

});

/**
 * Retrieve exercises. 
 * If the query parameters include a reps, then only the exercises for that number of reps are returned.
 * Otherwise, all exercises are returned.
 */
 app.get('/exercises', (req, res) => {
    let filter = {};
    // Is there a query parameter named reps? If so add a filter based on its value.
    if(req.query.reps !== undefined){
        filter = { reps: req.query.reps };
    }
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ Error: 'Request failed' });
            // Updated response code to 500 per assignment
        });

});

/**
 * Update the exercise whose id is provided in the path parameter and set
 * its name, reps, weight, unit, date to the values provided in the body.
 */
 app.put('/exercises/:_id', (req, res) => {
    exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date })
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ Error: 'Request failed' });
            // Updated response code to 500 per assignment
        });
});

/**
 * Delete the exercise whose id is provided in the query parameters
 */
 app.delete('/exercises/:id', (req, res) => {
    exercises.deleteById(req.params.id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ Error: 'Request failed' });
            // Updated response code to 500 per assignment
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});