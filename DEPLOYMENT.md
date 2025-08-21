# Deployment Guide

This document provides instructions for deploying the application to different environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Build Process](#build-process)
4. [Deployment Options](#deployment-options)
5. [Environment Setup](#environment-setup)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Access to deployment target (server, hosting platform, etc.)
- Proper access credentials for each environment

## Environment Configuration

The application uses environment variables for configuration. There are three environment files:

- `.env.development` - Used for local development
- `.env.staging` - Used for the staging environment
- `.env.production` - Used for the production environment

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_APP_ENV | Current environment | `production` |
| VITE_APP_NAME | Application name | `React Template Project` |
| VITE_APP_VERSION | Application version | `0.1.0` |
| VITE_API_BASE_URL | Base URL for API requests | `https://api.example.com` |
| VITE_ENABLE_LOGGING | Enable application logging | `true` |
| VITE_LOG_LEVEL | Minimum log level to capture | `error` |
| VITE_ENABLE_PERFORMANCE_MONITORING | Enable performance tracking | `true` |
| VITE_SENTRY_DSN | Sentry error tracking DSN | `https://...@sentry.io/...` |
| VITE_GOOGLE_ANALYTICS_ID | Google Analytics measurement ID | `G-XXXXXXXXXX` |

## Build Process

The application uses Vite for building. The build process is optimized for production, including code splitting, minification, and tree shaking.

### Build Commands

```bash
# Development build
npm run build:dev

# Staging build
npm run build --mode staging

# Production build
npm run build
```

### Build Output

The build output is generated in the `dist` directory. This contains all the static files needed to deploy the application.

## Deployment Options

### Option 1: Static Hosting (Recommended)

The application can be deployed to any static hosting service:

1. Build the application using the appropriate build command
2. Upload the contents of the `dist` directory to your hosting provider
3. Configure the hosting provider to redirect all routes to `index.html` for client-side routing

#### Example: Nginx Configuration

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    # Serve static files directly
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|eot)$ {
        expires max;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # For client-side routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.example.com;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

### Option 2: Docker Deployment

The application can also be deployed using Docker:

1. Create a Dockerfile in the project root:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Create an nginx.conf file:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|eot)$ {
        expires max;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.example.com;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

3. Build and run the Docker container:

```bash
docker build -t react-app .
docker run -p 80:80 react-app
```

## Environment Setup

### Development Environment

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.development` file with the necessary environment variables
4. Start the development server: `npm run dev`

### Staging Environment

The staging environment should mirror the production environment as closely as possible, but with non-production data.

1. Set up the hosting environment (server, cloud service, etc.)
2. Configure environment variables for staging
3. Deploy the application using the staging build
4. Set up monitoring and logging services

### Production Environment

1. Set up the production hosting environment
2. Configure environment variables for production
3. Deploy the application using the production build
4. Set up monitoring, logging, and alerting services
5. Configure CDN if applicable
6. Set up SSL certificates and ensure HTTPS is enforced

## Monitoring and Maintenance

### Health Checks

The application provides a health check endpoint at `/health` that returns the current status of the application and its dependencies. This endpoint can be used for monitoring and alerting.

### Performance Monitoring

Performance monitoring is set up through:

1. Built-in performance tracking (if enabled via `VITE_ENABLE_PERFORMANCE_MONITORING`)
2. Google Analytics (if configured)
3. Sentry Performance Monitoring (if configured)

### Error Tracking

Error tracking is configured through:

1. Application logging (based on `VITE_LOG_LEVEL`)
2. Sentry error tracking (if configured via `VITE_SENTRY_DSN`)

### Regular Maintenance

1. Regularly update dependencies to address security vulnerabilities
2. Monitor application performance and errors
3. Review and rotate access credentials periodically
4. Test backup and recovery procedures

## Troubleshooting

### Common Issues

#### Application Shows Blank Screen

1. Check the browser console for JavaScript errors
2. Verify that the API endpoints are accessible
3. Check that environment variables are correctly set
4. Verify that client-side routing is properly configured on the hosting server

#### Performance Issues

1. Check the performance monitoring data
2. Review server resources (CPU, memory, etc.)
3. Analyze network requests for slow responses
4. Consider enabling additional caching mechanisms

#### API Connection Issues

1. Verify that the `VITE_API_BASE_URL` is correctly set
2. Check for CORS issues in the browser console
3. Verify that the API is running and accessible
4. Check for network issues or firewall restrictions

### Getting Help

For additional assistance, contact the development team or refer to the internal documentation.
