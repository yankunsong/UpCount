// DynamoDB Schema Definitions for UpCount
// This file documents the table structures, key schemas, and indexes for User, Goal, and Log entities.

/**
 * User Table
 * - PK: userId (string)
 * - Attributes: email, displayName, createdAt, updatedAt
 * - No GSIs or LSIs required for basic user lookup
 */
export const UserTableSchema = {
  TableName: 'Users',
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' }, // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'email', AttributeType: 'S' },
  ],
  BillingMode: 'PAY_PER_REQUEST',
};

/**
 * Goal Table
 * - PK: userId (string)
 * - SK: goalId (string)
 * - Attributes: title, description, targetValue, currentValue, unit, deadline, category, createdAt, updatedAt
 * - GSI: Query all goals by userId
 */
export const GoalTableSchema = {
  TableName: 'Goals',
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' }, // Partition key
    { AttributeName: 'goalId', KeyType: 'RANGE' }, // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'goalId', AttributeType: 'S' },
    { AttributeName: 'category', AttributeType: 'S' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'CategoryIndex',
      KeySchema: [
        { AttributeName: 'category', KeyType: 'HASH' },
        { AttributeName: 'userId', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
    },
  ],
  BillingMode: 'PAY_PER_REQUEST',
};

/**
 * Log Table
 * - PK: goalId (string)
 * - SK: logId (string)
 * - Attributes: userId, value, notes, timestamp, createdAt
 * - GSI: Query logs by userId
 * - LSI: Query logs by timestamp for a goal
 */
export const LogTableSchema = {
  TableName: 'Logs',
  KeySchema: [
    { AttributeName: 'goalId', KeyType: 'HASH' }, // Partition key
    { AttributeName: 'logId', KeyType: 'RANGE' }, // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'goalId', AttributeType: 'S' },
    { AttributeName: 'logId', AttributeType: 'S' },
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'timestamp', AttributeType: 'S' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'UserLogsIndex',
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' },
        { AttributeName: 'timestamp', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
    },
  ],
  LocalSecondaryIndexes: [
    {
      IndexName: 'TimestampIndex',
      KeySchema: [
        { AttributeName: 'goalId', KeyType: 'HASH' },
        { AttributeName: 'timestamp', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
    },
  ],
  BillingMode: 'PAY_PER_REQUEST',
};

// Notes:
// - Composite keys are used for efficient querying (userId+goalId, goalId+logId)
// - GSIs allow querying all goals for a user and all logs for a user
// - LSI allows time-based queries for logs within a goal
