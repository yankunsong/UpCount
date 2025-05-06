// DynamoDB module - Creates tables for UpCount app

// Users Table
resource "aws_dynamodb_table" "users_table" {
  name           = var.users_table_name
  billing_mode   = var.billing_mode
  read_capacity  = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
  write_capacity = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
  hash_key       = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "EmailIndex"
    hash_key        = "email"
    projection_type = "ALL"
    read_capacity   = var.billing_mode == "PROVISIONED" ? var.gsi_read_capacity : null
    write_capacity  = var.billing_mode == "PROVISIONED" ? var.gsi_write_capacity : null
  }

  point_in_time_recovery {
    enabled = var.point_in_time_recovery_enabled
  }

  tags = merge(
    var.common_tags,
    {
      Name = var.users_table_name
    }
  )
}

// Goals Table
resource "aws_dynamodb_table" "goals_table" {
  name           = var.goals_table_name
  billing_mode   = var.billing_mode
  read_capacity  = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
  write_capacity = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
  hash_key       = "userId"
  range_key      = "goalId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "goalId"
    type = "S"
  }

  attribute {
    name = "category"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  // GSI for getting goals by category
  global_secondary_index {
    name            = "CategoryIndex"
    hash_key        = "userId"
    range_key       = "category"
    projection_type = "ALL"
    read_capacity   = var.billing_mode == "PROVISIONED" ? var.gsi_read_capacity : null
    write_capacity  = var.billing_mode == "PROVISIONED" ? var.gsi_write_capacity : null
  }

  // GSI for getting goals by creation date
  global_secondary_index {
    name            = "CreatedAtIndex"
    hash_key        = "userId"
    range_key       = "createdAt"
    projection_type = "ALL"
    read_capacity   = var.billing_mode == "PROVISIONED" ? var.gsi_read_capacity : null
    write_capacity  = var.billing_mode == "PROVISIONED" ? var.gsi_write_capacity : null
  }

  point_in_time_recovery {
    enabled = var.point_in_time_recovery_enabled
  }

  tags = merge(
    var.common_tags,
    {
      Name = var.goals_table_name
    }
  )
}

// LogEntries Table
resource "aws_dynamodb_table" "logs_table" {
  name           = var.logs_table_name
  billing_mode   = var.billing_mode
  read_capacity  = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
  write_capacity = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
  hash_key       = "goalId"
  range_key      = "logId"

  attribute {
    name = "goalId"
    type = "S"
  }

  attribute {
    name = "logId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "date"
    type = "S"
  }

  // GSI for getting all logs for a user
  global_secondary_index {
    name            = "UserLogsIndex"
    hash_key        = "userId"
    range_key       = "date"
    projection_type = "ALL"
    read_capacity   = var.billing_mode == "PROVISIONED" ? var.gsi_read_capacity : null
    write_capacity  = var.billing_mode == "PROVISIONED" ? var.gsi_write_capacity : null
  }

  point_in_time_recovery {
    enabled = var.point_in_time_recovery_enabled
  }

  tags = merge(
    var.common_tags,
    {
      Name = var.logs_table_name
    }
  )
}