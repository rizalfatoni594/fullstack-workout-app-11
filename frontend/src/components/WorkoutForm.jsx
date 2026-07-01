import { useRef, useState } from 'react';
import { useWorkoutContext } from '../hooks/useWorkoutContext.js';

const API_URL = import.meta.env.VITE_API_URL;

export default function WorkoutForm() {
  const { dispatch } = useWorkoutContext();
  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const inputRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const workout = { title, load, reps };

      const res = await fetch(`${API_URL}/api/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields);
        return;
      }

      // Reset all states
      setTitle('');
      setLoad('');
      setReps('');
      setError(null);
      setEmptyFields([]);

      dispatch({ type: 'CREATE_WORKOUT', payload: json });
      inputRef.current.focus();
    } catch (error) {
      console.error(`Failed to add workout.`, error);
    }
  }

  return (
    <form className='create' onSubmit={handleSubmit}>
      <h3>Add New Workout</h3>

      <label>Exercise Title:</label>
      <input
        type='text'
        required
        placeholder='Your exercise name'
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        ref={inputRef}
        className={
          title.trim() === '' && emptyFields.includes('title') ? 'error' : ''
        }
      />
      <label>Load (in kg):</label>
      <input
        type='number'
        required
        min='0'
        placeholder='The weight (at least 0)'
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={
          load.trim() === '' && emptyFields.includes('load') ? 'error' : ''
        }
      />
      <label>Exercise Title:</label>
      <input
        type='number'
        required
        min='1'
        placeholder='The reps (at least 1)'
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={
          reps.trim() === '' && emptyFields.includes('load') ? 'error' : ''
        }
      />

      <button>Add Workout</button>
      {error && (title.trim() === '' || load < 0 || reps < 1) && (
        <div className='error'>{error}</div>
      )}
    </form>
  );
}
