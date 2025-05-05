// Data validation utilities for UpCount models
import { User, Goal, Log } from '../types';

/**
 * Validates a User object against the expected schema
 * @param user The user object to validate
 * @returns boolean indicating if the user object is valid
 */
export const validateUser = (user: any): user is User => {
  if (!user || typeof user !== 'object') return false;

  const requiredFields: (keyof User)[] = ['userId', 'email', 'createdAt'];
  const stringFields: (keyof User)[] = ['userId', 'email', 'displayName', 'createdAt', 'updatedAt'];

  // Check required fields exist
  if (!requiredFields.every((field) => field in user)) return false;

  // Check field types
  if (!stringFields.every((field) => !user[field] || typeof user[field] === 'string')) return false;

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) return false;

  // Validate timestamps
  try {
    new Date(user.createdAt);
    if (user.updatedAt) new Date(user.updatedAt);
  } catch {
    return false;
  }

  return true;
};

/**
 * Validates a Goal object against the expected schema
 * @param goal The goal object to validate
 * @returns boolean indicating if the goal object is valid
 */
export const validateGoal = (goal: any): goal is Goal => {
  if (!goal || typeof goal !== 'object') return false;

  const requiredFields: (keyof Goal)[] = [
    'goalId',
    'userId',
    'title',
    'targetValue',
    'currentValue',
    'unit',
    'createdAt',
    'updatedAt',
  ];
  const stringFields: (keyof Goal)[] = [
    'goalId',
    'userId',
    'title',
    'description',
    'unit',
    'deadline',
    'category',
    'createdAt',
    'updatedAt',
  ];
  const numberFields: (keyof Goal)[] = ['targetValue', 'currentValue'];

  // Check required fields exist
  if (!requiredFields.every((field) => field in goal)) return false;

  // Check field types
  if (!stringFields.every((field) => !goal[field] || typeof goal[field] === 'string')) return false;
  if (!numberFields.every((field) => typeof goal[field] === 'number')) return false;

  // Validate timestamps
  try {
    new Date(goal.createdAt);
    new Date(goal.updatedAt);
    if (goal.deadline) new Date(goal.deadline);
  } catch {
    return false;
  }

  return true;
};

/**
 * Validates a Log object against the expected schema
 * @param log The log object to validate
 * @returns boolean indicating if the log object is valid
 */
export const validateLog = (log: any): log is Log => {
  if (!log || typeof log !== 'object') return false;

  const requiredFields: (keyof Log)[] = [
    'logId',
    'goalId',
    'userId',
    'value',
    'timestamp',
    'createdAt',
  ];
  const stringFields: (keyof Log)[] = [
    'logId',
    'goalId',
    'userId',
    'notes',
    'timestamp',
    'createdAt',
  ];
  const numberFields: (keyof Log)[] = ['value'];

  // Check required fields exist
  if (!requiredFields.every((field) => field in log)) return false;

  // Check field types
  if (!stringFields.every((field) => !log[field] || typeof log[field] === 'string')) return false;
  if (!numberFields.every((field) => typeof log[field] === 'number')) return false;

  // Validate timestamps
  try {
    new Date(log.timestamp);
    new Date(log.createdAt);
  } catch {
    return false;
  }

  return true;
};
