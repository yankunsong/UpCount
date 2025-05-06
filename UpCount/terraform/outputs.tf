// outputs.tf - Outputs for UpCount Terraform infrastructure

// DynamoDB Table Outputs
output "users_table_name" {
  description = "Name of the DynamoDB users table"
  value       = module.dynamodb.users_table_name
}

output "goals_table_name" {
  description = "Name of the DynamoDB goals table"
  value       = module.dynamodb.goals_table_name
}

output "logs_table_name" {
  description = "Name of the DynamoDB logs table"
  value       = module.dynamodb.logs_table_name
}

// S3 Bucket Outputs
output "storage_bucket_name" {
  description = "Name of the S3 storage bucket"
  value       = module.s3.bucket_id
}

output "storage_bucket_domain_name" {
  description = "Domain name of the S3 storage bucket"
  value       = module.s3.bucket_domain_name
}

// Cognito Outputs
output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = module.cognito.user_pool_id
}

output "user_pool_endpoint" {
  description = "Endpoint of the Cognito User Pool"
  value       = module.cognito.user_pool_endpoint
}

output "web_client_id" {
  description = "ID of the Cognito User Pool web client"
  value       = module.cognito.web_client_id
}

output "mobile_client_id" {
  description = "ID of the Cognito User Pool mobile client"
  value       = module.cognito.mobile_client_id
}

output "identity_pool_id" {
  description = "ID of the Cognito Identity Pool"
  value       = module.cognito.identity_pool_id
}

output "authenticated_role_arn" {
  description = "ARN of the IAM role for authenticated users"
  value       = module.cognito.authenticated_role_arn
}

// Lambda Function Outputs
output "lambda_function_names" {
  description = "Names of the Lambda functions"
  value       = module.lambda.function_names
}

output "lambda_function_arns" {
  description = "ARNs of the Lambda functions"
  value       = module.lambda.function_arns
}

output "lambda_invoke_arns" {
  description = "Invoke ARNs of the Lambda functions"
  value       = module.lambda.invoke_arns
}