// main.tf - Entry point for UpCount Terraform infrastructure

// Define local variables for resource naming and tagging
locals {
  # Construct name prefix with environment for consistent resource naming
  name_prefix = "${var.project_name}-${var.environment}"
  
  # Common tags to be applied to all resources
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

// DynamoDB Tables Module
module "dynamodb" {
  source = "./modules/dynamodb"

  users_table_name = "${local.name_prefix}-Users"
  goals_table_name = "${local.name_prefix}-Goals"
  logs_table_name  = "${local.name_prefix}-Logs"
  
  billing_mode = "PAY_PER_REQUEST" // Use on-demand pricing for development
  
  // For production, consider provisioned capacity
  read_capacity  = 5
  write_capacity = 5
  
  point_in_time_recovery_enabled = var.environment == "prod" ? true : false
  
  common_tags = local.common_tags
}

// S3 Bucket Module
module "s3" {
  source = "./modules/s3"

  bucket_name = "${lower(local.name_prefix)}-storage-${random_id.bucket_suffix.hex}"
  
  // Public access configuration - restrict public access
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
  
  // Enable CORS for the frontend application
  enable_cors = true
  cors_allowed_origins = ["*"]  // TEMP: Allow all origins for testing
  
  // Enable versioning for production only
  enable_versioning = var.environment == "prod" ? true : false
  
  common_tags = local.common_tags
}

// Cognito Module for Authentication
module "cognito" {
  source = "./modules/cognito"

  user_pool_name     = "${local.name_prefix}-UserPool"
  identity_pool_name = "${local.name_prefix}-IdentityPool"
  aws_region         = var.aws_region
  
  // User Pool Configuration
  mfa_configuration              = var.environment == "prod" ? "OPTIONAL" : "OFF"
  password_minimum_length        = 8
  auto_verify_attributes         = ["email"]
  temporary_password_validity_days = 7
  
  // App Client Configuration
  web_client_generate_secret     = false
  mobile_client_generate_secret  = false
  refresh_token_validity         = 30
  access_token_validity          = 60
  id_token_validity              = 60
  
  // Callback URLs based on environment
  callback_urls = ["http://localhost:3000/callback", "https://localhost:3000/callback"] // TEMP
  
  // Logout URLs based on environment
  logout_urls = ["http://localhost:3000/logout", "https://localhost:3000/logout"] // TEMP
  
  mobile_callback_urls = ["upcount://callback"]
  
  // Identity Pool Configuration
  allow_unauthenticated_identities = var.environment != "prod"
  
  // IAM Policy Configuration
  user_files_s3_bucket_arn = module.s3.bucket_arn
  
  // Custom attributes for the User Pool
  custom_attributes = [
    {
      name                     = "preferred_theme"
      attribute_data_type      = "String"
      developer_only_attribute = false
      mutable                  = true
      required                 = false
      min_length               = 1
      max_length               = 255
    }
  ]
  
  common_tags = local.common_tags
}

// Lambda Functions Module
module "lambda" {
  source = "./modules/lambda"

  name_prefix = local.name_prefix
  
  // Common environment variables for all functions
  common_environment_variables = {
    ENVIRONMENT     = var.environment
    USERS_TABLE_NAME = module.dynamodb.users_table_name
    GOALS_TABLE_NAME = module.dynamodb.goals_table_name
    LOGS_TABLE_NAME  = module.dynamodb.logs_table_name
    USER_POOL_ID     = module.cognito.user_pool_id
    WEB_CLIENT_ID    = module.cognito.web_client_id
    MOBILE_CLIENT_ID = module.cognito.mobile_client_id
    STORAGE_BUCKET   = module.s3.bucket_id
  }
  
  // Define Lambda functions
  lambda_functions = {
    getUser = {
      function_name    = "${local.name_prefix}-GetUser"
      description      = "Get user information"
      handler          = "getUser.handler"
      runtime          = "nodejs14.x"
      timeout          = 30
      memory_size      = 256
      source_dir       = "${path.module}/../backend/functions/getUser"
      environment_variables = {
        USERS_TABLE = module.dynamodb.users_table_name
      }
      api_gateway_integration = true
      additional_policies = []
      managed_policies = []
    },
    createGoal = {
      function_name    = "${local.name_prefix}-CreateGoal"
      description      = "Create a new goal"
      handler          = "createGoal.handler"
      runtime          = "nodejs14.x"
      timeout          = 30
      memory_size      = 256
      source_dir       = "${path.module}/../backend/functions/createGoal"
      environment_variables = {
        GOALS_TABLE = module.dynamodb.goals_table_name
      }
      api_gateway_integration = true
      additional_policies = []
      managed_policies = []
    },
    // Add other Lambda functions as needed
  }
  
  log_retention_days = var.environment == "prod" ? 30 : 7
  
  // For the first apply, this will be null to avoid circular dependency
  // After applying, API Gateway output will exist and can be used with terraform apply again
  api_gateway_execution_arn = null # module.api_gateway.execution_arn 
  
  common_tags = local.common_tags
}

// Generate a random suffix for globally unique S3 bucket names
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

// API Gateway Module
module "api_gateway" {
  source = "./modules/apigateway"
  
  depends_on = [module.lambda] // Ensure Lambda is created first

  api_name     = "${local.name_prefix}-API"
  description  = "API Gateway for UpCount application"
  stage_name   = var.environment
  environment  = var.environment
  
  // Set up Lambda integrations with API Gateway
  lambda_functions = {
    getUser = {
      function_name = module.lambda.function_names["getUser"]
      invoke_arn    = module.lambda.invoke_arns["getUser"]
      http_method   = "GET"
      path          = "/users/{id}"
      authorization = "NONE"  // Use Cognito authorizer
    },
    createGoal = {
      function_name = module.lambda.function_names["createGoal"]
      invoke_arn    = module.lambda.invoke_arns["createGoal"]
      http_method   = "POST"
      path          = "/goals"
      authorization = "NONE"  // Use Cognito authorizer
    }
    // Add other API routes as needed
  }

  // Configure CORS for the API
  cors_configuration = {
    allow_origins     = var.environment == "prod" ? ["https://${var.project_name}.com"] : ["*"]
    allow_methods     = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers     = ["Content-Type", "Authorization", "x-amz-date", "x-api-key", "x-amz-security-token"]
    allow_credentials = true
    max_age           = 300
  }

  // Use Cognito authorizer ID once it's available
  //   authorizer_id = module.cognito.web_client_id

  // Apply common tags
  tags = local.common_tags
}

// Output the API Gateway endpoint for frontend configuration
output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = module.api_gateway.api_endpoint
}