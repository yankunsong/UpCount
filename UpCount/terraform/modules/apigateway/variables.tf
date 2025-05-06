variable "api_name" {
  description = "Name of the API Gateway"
  type        = string
}

variable "description" {
  description = "Description of the API Gateway"
  type        = string
  default     = "API Gateway for UpCount application"
}

variable "stage_name" {
  description = "Name of the API Gateway stage to deploy"
  type        = string
  default     = "dev"
}

variable "lambda_functions" {
  description = "Map of Lambda functions to integrate with API Gateway"
  type = map(object({
    function_name = string
    invoke_arn    = string
    http_method   = string
    path          = string
    authorization = optional(string, "NONE")
  }))
}

variable "authorizer_id" {
  description = "ID of the Cognito user pool authorizer (if using)"
  type        = string
  default     = null
}

variable "cors_configuration" {
  description = "CORS configuration for the API Gateway"
  type = object({
    allow_origins     = list(string)
    allow_methods     = list(string)
    allow_headers     = list(string)
    allow_credentials = bool
    max_age           = number
  })
  default = {
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers     = ["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key", "X-Amz-Security-Token"]
    allow_credentials = true
    max_age           = 300
  }
}

variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Tags to apply to API Gateway resources"
  type        = map(string)
  default     = {}
}
