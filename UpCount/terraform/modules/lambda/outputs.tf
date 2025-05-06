output "function_names" {
  description = "Map of Lambda function names"
  value = {
    for key, function in aws_lambda_function.function : key => function.function_name
  }
}

output "function_arns" {
  description = "Map of Lambda function ARNs"
  value = {
    for key, function in aws_lambda_function.function : key => function.arn
  }
}

output "invoke_arns" {
  description = "Map of Lambda function invoke ARNs"
  value = {
    for key, function in aws_lambda_function.function : key => function.invoke_arn
  }
}

output "role_names" {
  description = "Map of Lambda function role names"
  value = {
    for key, role in aws_iam_role.lambda_role : key => role.name
  }
}

output "role_arns" {
  description = "Map of Lambda function role ARNs"
  value = {
    for key, role in aws_iam_role.lambda_role : key => role.arn
  }
}