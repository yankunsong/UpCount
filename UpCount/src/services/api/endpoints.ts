import { User, Goal, Log } from '../../types';
import api from './api';

// User endpoints
export const userApi = {
  getCurrentUser: () => api.get<User>('/user'),
  updateUser: (userData: Partial<User>) => api.put<User>('/user', userData),
};

// Goals endpoints
export const goalsApi = {
  getAllGoals: () => api.get<Goal[]>('/goals'),
  getGoalById: (goalId: string) => api.get<Goal>(`/goals/${goalId}`),
  createGoal: (goal: Omit<Goal, 'goalId' | 'createdAt' | 'updatedAt'>) =>
    api.post<Goal>('/goals', goal),
  updateGoal: (goalId: string, goal: Partial<Goal>) => api.put<Goal>(`/goals/${goalId}`, goal),
  deleteGoal: (goalId: string) => api.delete(`/goals/${goalId}`),
};

// Logs endpoints
export const logsApi = {
  getLogsByGoal: (goalId: string) => api.get<Log[]>(`/goals/${goalId}/logs`),
  createLog: (goalId: string, log: Omit<Log, 'logId' | 'createdAt'>) =>
    api.post<Log>(`/goals/${goalId}/logs`, log),
  updateLog: (goalId: string, logId: string, log: Partial<Log>) =>
    api.put<Log>(`/goals/${goalId}/logs/${logId}`, log),
  deleteLog: (goalId: string, logId: string) => api.delete(`/goals/${goalId}/logs/${logId}`),
};
