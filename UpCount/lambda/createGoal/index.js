const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Environment variables will be set by Terraform
const goalsTable = process.env.GOALS_TABLE_NAME;

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Get userId from the Cognito identity
    const userId = event.requestContext.authorizer.claims.sub;
    let requestBody;
    
    try {
      requestBody = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'Invalid request body' })
      };
    }
    
    // Validate required fields
    const { title, targetValue, unit, deadline } = requestBody;
    
    if (!title || !targetValue || !unit) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }
    
    // Create a new goal
    const goalId = uuidv4();
    const now = new Date().toISOString();
    
    const goal = {
      userId,
      goalId,
      title,
      targetValue: Number(targetValue),
      currentValue: 0,
      unit,
      createdAt: now,
      updatedAt: now,
      status: 'active'
    };
    
    // Add optional fields if provided
    if (deadline) goal.deadline = deadline;
    if (requestBody.description) goal.description = requestBody.description;
    if (requestBody.category) goal.category = requestBody.category;
    
    const params = {
      TableName: goalsTable,
      Item: goal
    };
    
    await dynamoDB.put(params).promise();
    
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(goal)
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};