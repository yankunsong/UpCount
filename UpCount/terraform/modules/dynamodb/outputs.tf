output "users_table_name" {
  description = "Name of the DynamoDB users table"
  value       = aws_dynamodb_table.users_table.name
}

output "users_table_arn" {
  description = "ARN of the DynamoDB users table"
  value       = aws_dynamodb_table.users_table.arn
}

output "goals_table_name" {
  description = "Name of the DynamoDB goals table"
  value       = aws_dynamodb_table.goals_table.name
}

output "goals_table_arn" {
  description = "ARN of the DynamoDB goals table"
  value       = aws_dynamodb_table.goals_table.arn
}

output "logs_table_name" {
  description = "Name of the DynamoDB logs table"
  value       = aws_dynamodb_table.logs_table.name
}

output "logs_table_arn" {
  description = "ARN of the DynamoDB logs table"
  value       = aws_dynamodb_table.logs_table.arn
}