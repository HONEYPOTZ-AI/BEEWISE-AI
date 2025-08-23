#!/bin/sh

# Health check script for Docker container
# Checks if nginx is running and serving content

set -e

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
    echo "Nginx is not running"
    exit 1
fi

# Check if the application is responding
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health || echo "000")

if [ "$HTTP_STATUS" != "200" ]; then
    echo "Health check failed with status: $HTTP_STATUS"
    exit 1
fi

echo "Health check passed"
exit 0
