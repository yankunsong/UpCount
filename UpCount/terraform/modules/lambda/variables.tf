variable "name_prefix" {
  description = "Prefix to be used for resource names"
  type        = string
}

variable "lambda_functions" {
  description = "Map of Lambda functions to create"
  type = map(object({
    description             = string
    source_dir              = string
    handler                 = string
    runtime                 = string
    timeout                 = number
    memory_size             = number
    environment_variables   = map(string)
    additional_policies     = list(any)
    managed_policies        = list(string)
    vpc_config              = optional(object({
      subnet_ids           = list(string)
      security_group_ids   = list(string)
    }))
    dead_letter_arn         = optional(string)
    api_gateway_integration = optional(bool, false)
  }))
}

variable "common_environment_variables" {
  description = "Environment variables common to all Lambda functions"
  type        = map(string)
  default     = {}
}

variable "default_dead_letter_arn" {
  description = "Default ARN for the dead letter queue"
  type        = string
  default     = null
}

variable "api_gateway_execution_arn" {
  description = "ARN of the API Gateway for Lambda permissions"
  type        = string
  default     = null
}

variable "log_retention_days" {
  description = "Number of days to retain Lambda logs"
  type        = number
  default     = 14
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}