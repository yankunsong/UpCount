variable "user_pool_name" {
  description = "Name of the Cognito User Pool"
  type        = string
}

variable "identity_pool_name" {
  description = "Name of the Cognito Identity Pool"
  type        = string
}

variable "username_attributes" {
  description = "Attributes that can be used as a username for signing in to the User Pool"
  type        = list(string)
  default     = ["email"]
}

variable "auto_verify_attributes" {
  description = "Attributes that should be auto-verified"
  type        = list(string)
  default     = ["email"]
}

variable "alias_attributes" {
  description = "Attributes supported as an alias for signing in"
  type        = list(string)
  default     = []
}

variable "mfa_configuration" {
  description = "MFA configuration for the User Pool"
  type        = string
  default     = "OPTIONAL"
  validation {
    condition     = contains(["OFF", "OPTIONAL", "REQUIRED"], var.mfa_configuration)
    error_message = "MFA configuration must be one of: OFF, OPTIONAL, REQUIRED"
  }
}

variable "password_minimum_length" {
  description = "Minimum length for password"
  type        = number
  default     = 8
}

variable "password_require_lowercase" {
  description = "Whether password requires lowercase"
  type        = bool
  default     = true
}

variable "password_require_uppercase" {
  description = "Whether password requires uppercase"
  type        = bool
  default     = true
}

variable "password_require_numbers" {
  description = "Whether password requires numbers"
  type        = bool
  default     = true
}

variable "password_require_symbols" {
  description = "Whether password requires symbols"
  type        = bool
  default     = true
}

variable "temporary_password_validity_days" {
  description = "Days that temporary passwords are valid"
  type        = number
  default     = 7
}

variable "email_sending_account" {
  description = "Email sending account type"
  type        = string
  default     = "COGNITO_DEFAULT"
  validation {
    condition     = contains(["COGNITO_DEFAULT", "DEVELOPER"], var.email_sending_account)
    error_message = "Email sending account must be either COGNITO_DEFAULT or DEVELOPER"
  }
}

variable "from_email_address" {
  description = "Email address used for sending emails"
  type        = string
  default     = null
}

variable "ses_email_source_arn" {
  description = "ARN of the SES verified email identity to use"
  type        = string
  default     = null
}

variable "enable_sms_recovery" {
  description = "Whether to enable phone number recovery"
  type        = bool
  default     = false
}

variable "refresh_token_validity" {
  description = "Refresh token validity in days"
  type        = number
  default     = 30
}

variable "access_token_validity" {
  description = "Access token validity in minutes"
  type        = number
  default     = 60
}

variable "id_token_validity" {
  description = "ID token validity in minutes"
  type        = number
  default     = 60
}

variable "web_client_generate_secret" {
  description = "Generate client secret for web client"
  type        = bool
  default     = false
}

variable "mobile_client_generate_secret" {
  description = "Generate client secret for mobile client"
  type        = bool
  default     = false
}

variable "allowed_oauth_flows" {
  description = "Allowed OAuth flows"
  type        = list(string)
  default     = ["code", "implicit"]
}

variable "allowed_oauth_scopes" {
  description = "Allowed OAuth scopes"
  type        = list(string)
  default     = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
}

variable "callback_urls" {
  description = "Callback URLs for web client"
  type        = list(string)
  default     = ["http://localhost:3000/callback", "https://localhost:3000/callback"]
}

variable "logout_urls" {
  description = "Logout URLs for web client"
  type        = list(string)
  default     = ["http://localhost:3000/logout", "https://localhost:3000/logout"]
}

variable "mobile_callback_urls" {
  description = "Callback URLs for mobile client"
  type        = list(string)
  default     = ["upcount://callback"]
}

variable "mobile_logout_urls" {
  description = "Logout URLs for mobile client"
  type        = list(string)
  default     = ["upcount://logout"]
}

variable "allow_unauthenticated_identities" {
  description = "Whether to allow unauthenticated identities"
  type        = bool
  default     = false
}

variable "api_gateway_arn" {
  description = "ARN of the API Gateway to grant access to"
  type        = string
  default     = "*"
}

variable "user_files_s3_bucket_arn" {
  description = "ARN of the S3 bucket for user files"
  type        = string
  default     = "*"
}

variable "additional_authenticated_policy_statements" {
  description = "Additional IAM policy statements for authenticated users"
  type        = list(any)
  default     = []
}

variable "additional_unauthenticated_policy_statements" {
  description = "Additional IAM policy statements for unauthenticated users"
  type        = list(any)
  default     = []
}

variable "custom_attributes" {
  description = "Custom attributes for the User Pool"
  type = list(object({
    name                     = string
    attribute_data_type      = string
    developer_only_attribute = bool
    mutable                  = bool
    required                 = bool
    min_length               = optional(number)
    max_length               = optional(number)
    min_value                = optional(number)
    max_value                = optional(number)
  }))
  default = []
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "aws_region" {
  description = "AWS region for constructing ARNs"
  type        = string
}