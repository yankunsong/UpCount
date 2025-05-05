import { validateUser, validateGoal, validateLog } from './validators';
import { User, Goal, Log } from '../types';

// Mock Data Generators
const mockUser = (): User => ({
  userId: 'user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const mockGoal = (userId = 'user-123'): Goal => ({
  goalId: 'goal-456',
  userId,
  title: 'Read 10 books',
  description: 'Read 10 books this year',
  targetValue: 10,
  currentValue: 2,
  unit: 'books',
  deadline: '2025-12-31',
  category: 'Personal Development',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const mockLog = (goalId = 'goal-456', userId = 'user-123'): Log => ({
  logId: 'log-789',
  goalId,
  userId,
  value: 1,
  notes: 'Finished first book',
  timestamp: new Date().toISOString(),
  createdAt: new Date().toISOString(),
});

describe('Validators', () => {
  describe('validateUser', () => {
    it('should validate a correct user object', () => {
      const user = mockUser();
      expect(validateUser(user)).toBe(true);
    });

    it('should reject an invalid user object', () => {
      const invalidUser = { ...mockUser(), userId: 123 }; // userId should be string
      expect(validateUser(invalidUser)).toBe(false);
    });
  });

  describe('validateGoal', () => {
    it('should validate a correct goal object', () => {
      const goal = mockGoal();
      expect(validateGoal(goal)).toBe(true);
    });

    it('should reject an invalid goal object', () => {
      const invalidGoal = { ...mockGoal(), targetValue: '10' }; // targetValue should be number
      expect(validateGoal(invalidGoal)).toBe(false);
    });
  });

  describe('validateLog', () => {
    it('should validate a correct log object', () => {
      const log = mockLog();
      expect(validateLog(log)).toBe(true);
    });

    it('should reject an invalid log object', () => {
      const invalidLog = { ...mockLog(), value: '1' }; // value should be number
      expect(validateLog(invalidLog)).toBe(false);
    });
  });
});
