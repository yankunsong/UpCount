import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Goal } from '../types';
import { goalsApi } from '../services/api/endpoints';

// Types
type GoalsState = {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  selectedGoal: Goal | null;
};

type GoalsAction =
  | { type: 'FETCH_GOALS_START' | 'CLEAR_ERROR' | 'CLEAR_SELECTED_GOAL' }
  | { type: 'FETCH_GOALS_SUCCESS'; payload: Goal[] }
  | { type: 'FETCH_GOALS_ERROR'; payload: string }
  | { type: 'SELECT_GOAL'; payload: Goal }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string };

type GoalsContextType = {
  state: GoalsState;
  fetchGoals: () => Promise<void>;
  selectGoal: (goal: Goal) => void;
  clearSelectedGoal: () => void;
  addGoal: (goal: Omit<Goal, 'goalId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGoal: (goalId: string, goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  clearError: () => void;
};

// Initial state
const initialState: GoalsState = {
  goals: [],
  isLoading: false,
  error: null,
  selectedGoal: null,
};

// Create context
const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

// Reducer
function goalsReducer(state: GoalsState, action: GoalsAction): GoalsState {
  switch (action.type) {
    case 'FETCH_GOALS_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_GOALS_SUCCESS':
      return { ...state, isLoading: false, goals: action.payload };
    case 'FETCH_GOALS_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SELECT_GOAL':
      return { ...state, selectedGoal: action.payload };
    case 'CLEAR_SELECTED_GOAL':
      return { ...state, selectedGoal: null };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.goalId === action.payload.goalId ? action.payload : goal,
        ),
        selectedGoal:
          state.selectedGoal?.goalId === action.payload.goalId
            ? action.payload
            : state.selectedGoal,
      };
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.goalId !== action.payload),
        selectedGoal: state.selectedGoal?.goalId === action.payload ? null : state.selectedGoal,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// Provider component
export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(goalsReducer, initialState);

  const fetchGoals = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_GOALS_START' });
      const response = await goalsApi.getAllGoals();
      dispatch({ type: 'FETCH_GOALS_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({
        type: 'FETCH_GOALS_ERROR',
        payload: 'Failed to fetch goals. Please try again.',
      });
    }
  }, []);

  const selectGoal = useCallback((goal: Goal) => {
    dispatch({ type: 'SELECT_GOAL', payload: goal });
  }, []);

  const clearSelectedGoal = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTED_GOAL' });
  }, []);

  const addGoal = useCallback(async (goal: Omit<Goal, 'goalId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await goalsApi.createGoal(goal);
      dispatch({ type: 'ADD_GOAL', payload: response.data });
    } catch (error) {
      dispatch({
        type: 'FETCH_GOALS_ERROR',
        payload: 'Failed to create goal. Please try again.',
      });
    }
  }, []);

  const updateGoal = useCallback(async (goalId: string, goal: Partial<Goal>) => {
    try {
      const response = await goalsApi.updateGoal(goalId, goal);
      dispatch({ type: 'UPDATE_GOAL', payload: response.data });
    } catch (error) {
      dispatch({
        type: 'FETCH_GOALS_ERROR',
        payload: 'Failed to update goal. Please try again.',
      });
    }
  }, []);

  const deleteGoal = useCallback(async (goalId: string) => {
    try {
      await goalsApi.deleteGoal(goalId);
      dispatch({ type: 'DELETE_GOAL', payload: goalId });
    } catch (error) {
      dispatch({
        type: 'FETCH_GOALS_ERROR',
        payload: 'Failed to delete goal. Please try again.',
      });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    state,
    fetchGoals,
    selectGoal,
    clearSelectedGoal,
    addGoal,
    updateGoal,
    deleteGoal,
    clearError,
  };

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

// Custom hook to use goals context
export function useGoals() {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}
