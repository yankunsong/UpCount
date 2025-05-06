// Lambda module - Provisions Lambda functions for the UpCount application

// Archive Lambda function code
data "archive_file" "function_archives" {
  for_each = var.lambda_functions

  type        = "zip"
  source_dir  = each.value.source_dir
  output_path = "${path.module}/archives/${each.key}.zip"

  # Explicitly add the source directory content
  # This ensures the zip isn't empty even if index.js is empty
  # Note: Terraform might still complain if the dir is truly empty, 
  # but the empty index.js should prevent this.
}

// IAM Role for Lambda Functions
resource "aws_iam_role" "lambda_role" {
  for_each = var.lambda_functions

  name = "${var.name_prefix}-${each.key}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name = "${var.name_prefix}-${each.key}-role"
    }
  )
}

// Lambda Execution Policy
resource "aws_iam_policy" "lambda_execution_policy" {
  for_each = var.lambda_functions

  name        = "${var.name_prefix}-${each.key}-execution-policy"
  description = "IAM policy for Lambda function ${each.key} execution"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat([
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ], each.value.additional_policies)
  })
}

// Attach Lambda Execution Policy
resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  for_each = var.lambda_functions

  role       = aws_iam_role.lambda_role[each.key].name
  policy_arn = aws_iam_policy.lambda_execution_policy[each.key].arn
}

// Attach AWS Managed Policies
resource "aws_iam_role_policy_attachment" "lambda_managed_policy_attachment" {
  for_each = {
    for i in flatten([
      for fn_key, fn in var.lambda_functions : [
        for policy in fn.managed_policies : {
          fn_key = fn_key
          policy = policy
        }
      ]
    ]) : "${i.fn_key}-${i.policy}" => i
  }

  role       = aws_iam_role.lambda_role[each.value.fn_key].name
  policy_arn = "arn:aws:iam::aws:policy/${each.value.policy}"
}

// Lambda Function
resource "aws_lambda_function" "function" {
  for_each = var.lambda_functions

  function_name = "${var.name_prefix}-${each.key}"
  description   = each.value.description
  handler       = each.value.handler
  runtime       = each.value.runtime
  timeout       = each.value.timeout
  memory_size   = each.value.memory_size

  filename         = data.archive_file.function_archives[each.key].output_path
  source_code_hash = data.archive_file.function_archives[each.key].output_base64sha256

  role = aws_iam_role.lambda_role[each.key].arn

  environment {
    variables = merge(
      var.common_environment_variables,
      each.value.environment_variables
    )
  }

  // Conditionally add dead_letter_config only if an ARN is provided
  dynamic "dead_letter_config" {
    for_each = try(each.value.dead_letter_arn, var.default_dead_letter_arn) != null ? [1] : []
    content {
      target_arn = try(each.value.dead_letter_arn, var.default_dead_letter_arn)
    }
  }

  dynamic "vpc_config" {
    for_each = each.value.vpc_config != null ? [each.value.vpc_config] : []
    content {
      subnet_ids         = vpc_config.value.subnet_ids
      security_group_ids = vpc_config.value.security_group_ids
    }
  }

  tags = merge(
    var.common_tags,
    {
      Name = "${var.name_prefix}-${each.key}"
    }
  )
}

// CloudWatch Log Group for each Lambda function (with explicit retention)
resource "aws_cloudwatch_log_group" "lambda_log_group" {
  for_each = var.lambda_functions

  name              = "/aws/lambda/${aws_lambda_function.function[each.key].function_name}"
  retention_in_days = var.log_retention_days

  tags = merge(
    var.common_tags,
    {
      Name = "/aws/lambda/${aws_lambda_function.function[each.key].function_name}"
    }
  )
}

// Lambda permissions for API Gateway (Only if ARN is provided)
resource "aws_lambda_permission" "api_gateway_permission" {
  # Only create these permissions if the API Gateway ARN is known
  for_each = var.api_gateway_execution_arn != null ? {
    for key, fn in var.lambda_functions : key => fn
    if fn.api_gateway_integration
  } : {}

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.function[each.key].function_name
  principal     = "apigateway.amazonaws.com"

  # Allow API Gateway to invoke this lambda
  source_arn = "${var.api_gateway_execution_arn}/*/*"
}