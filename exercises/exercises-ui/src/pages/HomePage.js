import React from 'react';
import { Link } from 'react-router-dom';
import ExerciseList from '../components/ExerciseList';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function HomePage({ setExerciseToEdit }) {

    const [exercises, setExercises] = useState([]);
    const history = useHistory();

    const onDelete = async _id => {
        const response = await fetch(`/exercises/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            const newExercises = exercises.filter(m => m._id !== _id);
            setExercises(newExercises);
        } else {
        console.error(`Failed to delete movie with id = ${_id}, status code = ${response.status}`)
        }
    };	

    const onEdit = exercise => {
        setExerciseToEdit(exercise);
        history.push('/edit-exercise');
    }

    const loadExercises = async () => {
        const response = await fetch('/exercises')
        const data = await response.json();
        setExercises(data);
    }

    useEffect(() => {
        loadExercises();
    }, []);

    return (
        <>
            <h2>Exercises</h2>
            <ExerciseList exercises={exercises} onDelete={onDelete} onEdit={onEdit}></ExerciseList>
            <Link to="/add-exercise">Add an exercise</Link>
            <Link to="/edit-exercise">Edit an exercise</Link>
        </>
    );
}

export default HomePage;