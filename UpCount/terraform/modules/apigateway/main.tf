resource "aws_apigatewayv2_api" "api" {
  name          = var.api_name
  protocol_type = "HTTP"
  description   = var.description

  cors_configuration {
    allow_origins     = var.cors_configuration.allow_origins
    allow_methods     = var.cors_configuration.allow_methods
    allow_headers     = var.cors_configuration.allow_headers
    allow_credentials = !contains(var.cors_configuration.allow_origins, "*")
    max_age           = var.cors_configuration.max_age
  }

  tags = merge(
    var.tags,
    {
      Name        = var.api_name
      Environment = var.environment
    }
  )
}

# Stage for the API
resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = var.stage_name
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      path           = "$context.path"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
      integrationError = "$context.integrationErrorMessage"
      integrationLatency = "$context.integrationLatency"
    })
  }

  tags = merge(
    var.tags,
    {
      Name        = "${var.api_name}-${var.stage_name}"
      Environment = var.environment
    }
  )

  depends_on = [aws_cloudwatch_log_group.api_gw]
}

# CloudWatch Log Group for API Gateway logs
resource "aws_cloudwatch_log_group" "api_gw" {
  name              = "/aws/apigateway/${var.api_name}"
  retention_in_days = 30

  tags = merge(
    var.tags,
    {
      Name        = "/aws/apigateway/${var.api_name}"
      Environment = var.environment
    }
  )
}

# Create routes and integrations for each Lambda function
resource "aws_apigatewayv2_integration" "lambda_integration" {
  for_each = var.lambda_functions

  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = each.value.invoke_arn
  payload_format_version = "2.0"
  integration_method     = "POST"
}

resource "aws_apigatewayv2_route" "lambda_route" {
  for_each = var.lambda_functions

  api_id             = aws_apigatewayv2_api.api.id
  route_key          = "${each.value.http_method} ${each.value.path}"
  target             = "integrations/${aws_apigatewayv2_integration.lambda_integration[each.key].id}"
  authorization_type = each.value.authorization != null ? each.value.authorization : "NONE"
  authorizer_id      = null
}

# Lambda permissions for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  for_each = var.lambda_functions

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"

  # More specific ARN for security best practices
  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*${each.value.path}"
}
