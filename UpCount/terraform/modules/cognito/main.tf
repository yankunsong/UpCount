// Cognito module - Creates authentication resources for UpCount app

// AWS Cognito User Pool
resource "aws_cognito_user_pool" "user_pool" {
  name = var.user_pool_name

  // Username configuration
  username_attributes      = var.username_attributes
  auto_verified_attributes = var.auto_verify_attributes
  username_configuration {
    case_sensitive = false
  }

  // MFA configuration
  mfa_configuration = var.mfa_configuration
  dynamic "software_token_mfa_configuration" {
    for_each = var.mfa_configuration != "OFF" ? [1] : []
    content {
      enabled = true
    }
  }

  // Password policy
  password_policy {
    minimum_length                   = var.password_minimum_length
    require_lowercase                = var.password_require_lowercase
    require_uppercase                = var.password_require_uppercase
    require_numbers                  = var.password_require_numbers
    require_symbols                  = var.password_require_symbols
    temporary_password_validity_days = var.temporary_password_validity_days
  }

  // Email configuration
  email_configuration {
    email_sending_account = var.email_sending_account
    from_email_address    = var.from_email_address
    source_arn            = var.ses_email_source_arn
  }

  // Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
    dynamic "recovery_mechanism" {
      for_each = var.enable_sms_recovery ? [1] : []
      content {
        name     = "verified_phone_number"
        priority = 2
      }
    }
  }

  // Verification messages
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Your UpCount verification code"
    email_message        = "Your verification code is {####}"
    sms_message          = "Your verification code is {####}"
  }

  // User schema attributes
  schema {
    name                     = "email"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true
    string_attribute_constraints {
      min_length = 3
      max_length = 100
    }
  }

  schema {
    name                     = "name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true
    string_attribute_constraints {
      min_length = 1
      max_length = 100
    }
  }

  dynamic "schema" {
    for_each = var.custom_attributes
    content {
      name                     = schema.value.name
      attribute_data_type      = schema.value.attribute_data_type
      developer_only_attribute = schema.value.developer_only_attribute
      mutable                  = schema.value.mutable
      required                 = schema.value.required
      
      dynamic "string_attribute_constraints" {
        for_each = schema.value.attribute_data_type == "String" ? [schema.value] : []
        content {
          min_length = string_attribute_constraints.value.min_length
          max_length = string_attribute_constraints.value.max_length
        }
      }
      
      dynamic "number_attribute_constraints" {
        for_each = schema.value.attribute_data_type == "Number" ? [schema.value] : []
        content {
          min_value = number_attribute_constraints.value.min_value
          max_value = number_attribute_constraints.value.max_value
        }
      }
    }
  }

  tags = merge(
    var.common_tags,
    {
      Name = var.user_pool_name
    }
  )
}

// AWS Cognito User Pool Client for Web
resource "aws_cognito_user_pool_client" "web_client" {
  name                         = "${var.user_pool_name}-web-client"
  user_pool_id                 = aws_cognito_user_pool.user_pool.id
  generate_secret              = var.web_client_generate_secret
  refresh_token_validity       = var.refresh_token_validity
  access_token_validity        = var.access_token_validity
  id_token_validity            = var.id_token_validity
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  allowed_oauth_flows                  = var.allowed_oauth_flows
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = var.allowed_oauth_scopes
  callback_urls                        = var.callback_urls
  logout_urls                          = var.logout_urls
  supported_identity_providers         = ["COGNITO"]

  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  prevent_user_existence_errors = "ENABLED"
}

// AWS Cognito User Pool Client for Mobile
resource "aws_cognito_user_pool_client" "mobile_client" {
  name                         = "${var.user_pool_name}-mobile-client"
  user_pool_id                 = aws_cognito_user_pool.user_pool.id
  generate_secret              = var.mobile_client_generate_secret
  refresh_token_validity       = var.refresh_token_validity
  access_token_validity        = var.access_token_validity
  id_token_validity            = var.id_token_validity
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  allowed_oauth_flows                  = var.allowed_oauth_flows
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = var.allowed_oauth_scopes
  callback_urls                        = var.mobile_callback_urls
  logout_urls                          = var.mobile_logout_urls
  supported_identity_providers         = ["COGNITO"]

  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  prevent_user_existence_errors = "ENABLED"
}

// AWS Cognito Identity Pool
resource "aws_cognito_identity_pool" "identity_pool" {
  identity_pool_name               = var.identity_pool_name
  allow_unauthenticated_identities = var.allow_unauthenticated_identities
  allow_classic_flow               = true

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.web_client.id
    provider_name           = aws_cognito_user_pool.user_pool.endpoint
    server_side_token_check = false
  }

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.mobile_client.id
    provider_name           = aws_cognito_user_pool.user_pool.endpoint
    server_side_token_check = false
  }

  tags = merge(
    var.common_tags,
    {
      Name = var.identity_pool_name
    }
  )
}

// IAM Role for Authenticated Users
resource "aws_iam_role" "authenticated_role" {
  name = "${var.identity_pool_name}-authenticated-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.identity_pool.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name = "${var.identity_pool_name}-authenticated-role"
    }
  )
}

// IAM Role for Unauthenticated Users
resource "aws_iam_role" "unauthenticated_role" {
  count = var.allow_unauthenticated_identities ? 1 : 0
  name  = "${var.identity_pool_name}-unauthenticated-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.identity_pool.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "unauthenticated"
          }
        }
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name = "${var.identity_pool_name}-unauthenticated-role"
    }
  )
}

// IAM Policy for Authenticated Users
resource "aws_iam_policy" "authenticated_policy" {
  name        = "${var.identity_pool_name}-authenticated-policy"
  description = "IAM policy for Cognito authenticated users"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat([
      {
        Effect = "Allow"
        Action = [
          "mobileanalytics:PutEvents",
          "cognito-sync:*",
          "cognito-identity:*"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "${var.user_files_s3_bucket_arn}/private/$${cognito-identity.amazonaws.com:sub}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "execute-api:Invoke"
        ]
        Resource = var.api_gateway_arn
      }
    ], var.additional_authenticated_policy_statements)
  })
}

// IAM Policy for Unauthenticated Users
resource "aws_iam_policy" "unauthenticated_policy" {
  count       = var.allow_unauthenticated_identities ? 1 : 0
  name        = "${var.identity_pool_name}-unauthenticated-policy"
  description = "IAM policy for Cognito unauthenticated users"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat([
      {
        Effect = "Allow"
        Action = [
          "mobileanalytics:PutEvents",
          "cognito-sync:*"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "execute-api:Invoke"
        ]
        Resource = [
          "arn:aws:execute-api:${var.aws_region}:*:*/*/GET/public/*" 
        ]
      }
    ], var.additional_unauthenticated_policy_statements)
  })
}

// Attach Policy to Authenticated Role
resource "aws_iam_role_policy_attachment" "authenticated_policy_attachment" {
  role       = aws_iam_role.authenticated_role.name
  policy_arn = aws_iam_policy.authenticated_policy.arn
}

// Attach Policy to Unauthenticated Role
resource "aws_iam_role_policy_attachment" "unauthenticated_policy_attachment" {
  count      = var.allow_unauthenticated_identities ? 1 : 0
  role       = aws_iam_role.unauthenticated_role[0].name
  policy_arn = aws_iam_policy.unauthenticated_policy[0].arn
}

// Identity Pool Role Attachment
resource "aws_cognito_identity_pool_roles_attachment" "identity_pool_role_attachment" {
  identity_pool_id = aws_cognito_identity_pool.identity_pool.id

  roles = {
    "authenticated" = aws_iam_role.authenticated_role.arn
  }

  dynamic "role_mapping" {
    for_each = var.allow_unauthenticated_identities ? [1] : []
    content {
      identity_provider         = "${aws_cognito_user_pool.user_pool.endpoint}:${aws_cognito_user_pool_client.web_client.id}"
      ambiguous_role_resolution = "AuthenticatedRole"
      type                      = "Token"
    }
  }

  depends_on = [
    aws_iam_role.authenticated_role,
    aws_iam_role.unauthenticated_role
  ]
}