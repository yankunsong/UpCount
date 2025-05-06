output "api_id" {
  description = "ID of the API Gateway"
  value       = aws_apigatewayv2_api.api.id
}

output "api_endpoint" {
  description = "The HTTP API endpoint URL"
  value       = aws_apigatewayv2_stage.stage.invoke_url
}

output "execution_arn" {
  description = "The execution ARN to be used for Lambda permissions"
  value       = aws_apigatewayv2_api.api.execution_arn
}

output "stage_name" {
  description = "The name of the deployed stage"
  value       = aws_apigatewayv2_stage.stage.name
}

output "api_mapping" {
  description = "Map of the API routes and their configurations"
  value = {
    for k, v in aws_apigatewayv2_route.lambda_route : k => {
      route_key = v.route_key
      route_id  = v.id
    }
  }
}
