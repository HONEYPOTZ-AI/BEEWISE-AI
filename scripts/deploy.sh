#!/bin/bash

# Deployment script for React Template Project
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-staging}
BUILD_DIR="dist"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment to $ENVIRONMENT environment..."

# Function to check if required tools are installed
check_dependencies() {
    local deps=("node" "npm" "curl")
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            echo "❌ Error: $dep is not installed"
            exit 1
        fi
    done
    
    echo "✅ All dependencies are installed"
}

# Function to validate environment variables
validate_env() {
    local env_file="env.$ENVIRONMENT"
    
    if [ ! -f "$env_file" ]; then
        echo "❌ Error: Environment file $env_file not found"
        exit 1
    fi
    
    # Source environment variables
    set -a
    source "$env_file"
    set +a
    
    # Check required variables
    local required_vars=("VITE_API_BASE_URL" "VITE_APP_ENV")
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "❌ Error: Required environment variable $var is not set"
            exit 1
        fi
    done
    
    echo "✅ Environment variables validated"
}

# Function to run tests
run_tests() {
    echo "🧪 Running tests..."
    
    npm run test:run
    
    # Check test coverage
    npm run test:coverage
    
    # Extract coverage percentage
    COVERAGE=$(cat coverage/coverage-summary.json | jq -r '.total.lines.pct')
    
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
        echo "⚠️ Warning: Test coverage is below 80% ($COVERAGE%)"
        if [ "$ENVIRONMENT" == "production" ]; then
            echo "❌ Error: Cannot deploy to production with coverage below 80%"
            exit 1
        fi
    else
        echo "✅ Test coverage: $COVERAGE%"
    fi
}

# Function to build the application
build_app() {
    echo "🔨 Building application for $ENVIRONMENT..."
    
    # Clean previous build
    rm -rf "$BUILD_DIR"
    
    # Build with environment-specific configuration
    if [ "$ENVIRONMENT" == "development" ]; then
        npm run build:dev
    else
        npm run build --mode "$ENVIRONMENT"
    fi
    
    # Verify build output
    if [ ! -d "$BUILD_DIR" ]; then
        echo "❌ Error: Build directory not found"
        exit 1
    fi
    
    # Check build size
    BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
    echo "✅ Build completed successfully (Size: $BUILD_SIZE)"
}

# Function to run security checks
security_checks() {
    echo "🔐 Running security checks..."
    
    # Run npm audit
    npm audit --audit-level=high
    
    # Check for known vulnerabilities
    if command -v snyk &> /dev/null; then
        snyk test --severity-threshold=high
    else
        echo "⚠️ Warning: Snyk not installed, skipping vulnerability scan"
    fi
    
    echo "✅ Security checks passed"
}

# Function to create backup
create_backup() {
    if [ "$ENVIRONMENT" == "production" ]; then
        echo "💾 Creating backup..."
        
        # Create backup directory if it doesn't exist
        mkdir -p "backups"
        
        # Create backup of current deployment (if exists)
        if [ -d "/var/www/html" ]; then
            tar -czf "backups/backup_${TIMESTAMP}.tar.gz" -C "/var/www" html/
            echo "✅ Backup created: backups/backup_${TIMESTAMP}.tar.gz"
        fi
    fi
}

# Function to deploy to staging
deploy_staging() {
    echo "🌟 Deploying to staging environment..."
    
    # Example: Copy files to staging server
    # rsync -avz --delete "$BUILD_DIR/" user@staging.example.com:/var/www/html/
    
    # For demonstration, we'll just copy to a local directory
    STAGING_DIR="deployments/staging"
    mkdir -p "$STAGING_DIR"
    cp -r "$BUILD_DIR"/* "$STAGING_DIR"/
    
    echo "✅ Staging deployment completed"
    
    # Health check
    health_check "http://staging.example.com"
}

# Function to deploy to production
deploy_production() {
    echo "🚀 Deploying to production environment..."
    
    # Additional production checks
    if [ ! -f "production-deployment.approved" ]; then
        echo "❌ Error: Production deployment not approved"
        echo "Please create 'production-deployment.approved' file to proceed"
        exit 1
    fi
    
    # Example: Copy files to production server
    # rsync -avz --delete "$BUILD_DIR/" user@production.example.com:/var/www/html/
    
    # For demonstration, we'll just copy to a local directory
    PROD_DIR="deployments/production"
    mkdir -p "$PROD_DIR"
    cp -r "$BUILD_DIR"/* "$PROD_DIR"/
    
    echo "✅ Production deployment completed"
    
    # Health check
    health_check "https://example.com"
    
    # Clean up approval file
    rm -f "production-deployment.approved"
}

# Function to perform health check
health_check() {
    local url=$1
    echo "🏥 Performing health check on $url..."
    
    # Wait a moment for deployment to settle
    sleep 10
    
    # Check if the application is responding
    if curl -f -s "$url/health" > /dev/null; then
        echo "✅ Health check passed"
    else
        echo "❌ Health check failed"
        
        if [ "$ENVIRONMENT" == "production" ]; then
            echo "🔄 Rolling back deployment..."
            rollback_deployment
            exit 1
        fi
    fi
}

# Function to rollback deployment
rollback_deployment() {
    echo "🔄 Rolling back deployment..."
    
    # Find the latest backup
    LATEST_BACKUP=$(ls -t backups/backup_*.tar.gz 2>/dev/null | head -n1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        echo "📦 Restoring from backup: $LATEST_BACKUP"
        
        # Extract backup to deployment directory
        if [ "$ENVIRONMENT" == "production" ]; then
            tar -xzf "$LATEST_BACKUP" -C "/var/www/"
        else
            tar -xzf "$LATEST_BACKUP" -C "deployments/"
        fi
        
        echo "✅ Rollback completed"
    else
        echo "❌ No backup found for rollback"
        exit 1
    fi
}

# Function to send notification
send_notification() {
    local status=$1
    local message="Deployment to $ENVIRONMENT: $status"
    
    echo "📢 $message"
    
    # Here you can add integrations with Slack, Discord, email, etc.
    # curl -X POST -H 'Content-type: application/json' \
    #   --data "{\"text\":\"$message\"}" \
    #   "$SLACK_WEBHOOK_URL"
}

# Main deployment flow
main() {
    echo "🎯 React Template Project Deployment"
    echo "Environment: $ENVIRONMENT"
    echo "Timestamp: $TIMESTAMP"
    echo "----------------------------------------"
    
    check_dependencies
    validate_env
    
    # Create deployment directories
    mkdir -p deployments/{staging,production}
    
    # Pre-deployment steps
    run_tests
    security_checks
    build_app
    
    # Create backup for production
    create_backup
    
    # Deploy based on environment
    case $ENVIRONMENT in
        "staging")
            deploy_staging
            ;;
        "production")
            deploy_production
            ;;
        *)
            echo "❌ Error: Invalid environment '$ENVIRONMENT'"
            echo "Supported environments: staging, production"
            exit 1
            ;;
    esac
    
    # Post-deployment steps
    send_notification "SUCCESS"
    
    echo "🎉 Deployment completed successfully!"
    echo "Environment: $ENVIRONMENT"
    echo "Build directory: $BUILD_DIR"
    echo "Timestamp: $TIMESTAMP"
}

# Handle script interruption
trap 'echo "❌ Deployment interrupted"; send_notification "FAILED"; exit 1' INT TERM

# Run main function with all arguments
main "$@"
