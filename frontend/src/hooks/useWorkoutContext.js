import { useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext.js';

function useWorkoutContext() {
  const context = useContext(WorkoutContext);

  if (!context) {
    throw new Error(
      'useWorkoutContext must be used in a WorkoutContextProvider.',
    );
  }

  return context;
}

export { useWorkoutContext };
