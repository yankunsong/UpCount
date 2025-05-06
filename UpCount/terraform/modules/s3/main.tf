// S3 module - Creates storage bucket for UpCount app

// S3 bucket for static assets and user uploads
resource "aws_s3_bucket" "app_bucket" {
  bucket = var.bucket_name

  tags = merge(
    var.common_tags,
    {
      Name = var.bucket_name
    }
  )
}

// Configure bucket ownership
resource "aws_s3_bucket_ownership_controls" "app_bucket_ownership" {
  bucket = aws_s3_bucket.app_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

// Configure public access block
resource "aws_s3_bucket_public_access_block" "app_bucket_public_access" {
  bucket = aws_s3_bucket.app_bucket.id

  block_public_acls       = var.block_public_acls
  block_public_policy     = var.block_public_policy
  ignore_public_acls      = var.ignore_public_acls
  restrict_public_buckets = var.restrict_public_buckets
}

// Configure bucket CORS if enabled
resource "aws_s3_bucket_cors_configuration" "app_bucket_cors" {
  count = var.enable_cors ? 1 : 0

  bucket = aws_s3_bucket.app_bucket.id

  cors_rule {
    allowed_headers = var.cors_allowed_headers
    allowed_methods = var.cors_allowed_methods
    allowed_origins = var.cors_allowed_origins
    expose_headers  = var.cors_expose_headers
    max_age_seconds = var.cors_max_age_seconds
  }
}

// Configure bucket versioning if enabled
resource "aws_s3_bucket_versioning" "app_bucket_versioning" {
  count = var.enable_versioning ? 1 : 0

  bucket = aws_s3_bucket.app_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

// Configure server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "app_bucket_encryption" {
  bucket = aws_s3_bucket.app_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

// Create bucket policy if enabled
resource "aws_s3_bucket_policy" "app_bucket_policy" {
  count = var.enable_bucket_policy ? 1 : 0

  bucket = aws_s3_bucket.app_bucket.id
  policy = var.bucket_policy
}