variable "users_table_name" {
  description = "Name of the DynamoDB table for users"
  type        = string
  default     = "UpCount-Users"
}

variable "goals_table_name" {
  description = "Name of the DynamoDB table for goals"
  type        = string
  default     = "UpCount-Goals"
}

variable "logs_table_name" {
  description = "Name of the DynamoDB table for log entries"
  type        = string
  default     = "UpCount-Logs"
}

variable "billing_mode" {
  description = "DynamoDB billing mode (PAY_PER_REQUEST or PROVISIONED)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "read_capacity" {
  description = "DynamoDB table read capacity (used only if billing_mode is PROVISIONED)"
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "DynamoDB table write capacity (used only if billing_mode is PROVISIONED)"
  type        = number
  default     = 5
}

variable "gsi_read_capacity" {
  description = "DynamoDB GSI read capacity (used only if billing_mode is PROVISIONED)"
  type        = number
  default     = 5
}

variable "gsi_write_capacity" {
  description = "DynamoDB GSI write capacity (used only if billing_mode is PROVISIONED)"
  type        = number
  default     = 5
}

variable "point_in_time_recovery_enabled" {
  description = "Whether to enable point-in-time recovery for DynamoDB tables"
  type        = bool
  default     = true
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}