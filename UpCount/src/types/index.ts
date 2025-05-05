// Common Types

// User entity: Represents an application user
// Relationships:
//   - One User can have many Goals (userId in Goal)
//   - One User can have many Logs (userId in Log)
export interface User {
  userId: string; // Unique user identifier (was 'id')
  email: string;
  displayName?: string; // Optional display name (was 'username')
  createdAt: string;
  updatedAt: string;
}

// Goal entity: Represents a user's goal
// Relationships:
//   - Each Goal belongs to one User (userId)
//   - One Goal can have many Logs (goalId in Log)
export interface Goal {
  goalId: string; // Unique goal identifier (was 'id')
  userId: string; // Owner of the goal
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// Log entity: Represents a log entry for a goal
// Relationships:
//   - Each Log belongs to one Goal (goalId)
//   - Each Log belongs to one User (userId)
export interface Log {
  logId: string; // Unique log identifier (was 'id')
  goalId: string;
  userId: string; // Owner of the log (added for relationship)
  value: number;
  notes?: string;
  timestamp: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Goals: undefined;
  GoalDetail: { goalId: string };
  LogEntry: { goalId: string };
  Profile: undefined;
  Settings: undefined;
};
