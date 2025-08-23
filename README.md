# React Template Project

A modern, production-ready React application template with TypeScript, comprehensive testing, CI/CD pipeline, and deployment automation.

## 🚀 Features

- **Modern React 18** with TypeScript and Vite
- **Comprehensive UI Library** with shadcn/ui components
- **Robust Testing** with Vitest, Testing Library, and coverage reporting
- **CI/CD Pipeline** with GitHub Actions
- **Security Scanning** with CodeQL and dependency audits
- **Code Quality** with ESLint, Prettier, and SonarCloud integration
- **Performance Monitoring** with Lighthouse CI
- **Docker Support** with multi-stage builds
- **Automated Deployment** scripts for staging and production
- **Developer Tools** with VS Code configuration and Git hooks

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git
- Docker (optional, for containerized deployment)

## 🛠 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/react-template-project.git
   cd react-template-project
   ```

2. **Set up development environment:**
   ```bash
   npm run setup:dev
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## 📚 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run build:staging` - Build for staging
- `npm run preview` - Preview production build locally

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:all` - Run all checks (lint, type-check, test, build)

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript compiler checks

### Deployment
- `npm run deploy:staging` - Deploy to staging environment
- `npm run deploy:production` - Deploy to production environment
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container

### Security & Maintenance
- `npm run security:audit` - Run security audit
- `npm run security:fix` - Fix security issues
- `npm run analyze` - Analyze bundle size
- `npm run clean` - Clean build artifacts and cache

## 🏗 Project Structure

```
react-template-project/
├── .github/                 # GitHub workflows and templates
│   ├── workflows/           # CI/CD workflows
│   ├── ISSUE_TEMPLATE/      # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── docker/                  # Docker configuration
├── scripts/                 # Build and deployment scripts
├── src/                     # Source code
│   ├── components/          # React components
│   │   └── ui/             # Base UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── test/               # Test utilities and setup
├── public/                 # Static assets
└── dist/                   # Build output (generated)
```

## 🌍 Environment Configuration

The project supports multiple environments with different configurations:

- **Development** (`.env.development`)
- **Staging** (`.env.staging`)
- **Production** (`.env.production`)

Copy `.env.example` to `.env` and update the values for your environment.

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_ENV` | Current environment | `production` |
| `VITE_APP_NAME` | Application name | `React Template Project` |
| `VITE_API_BASE_URL` | API base URL | `https://api.example.com` |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | `https://...@sentry.io/...` |

## 🧪 Testing

The project includes comprehensive testing setup:

### Unit & Integration Tests
- **Framework**: Vitest with Testing Library
- **Coverage**: Configured for 80%+ coverage requirement
- **Location**: Tests are co-located with source files

### End-to-End Tests
- **Framework**: Playwright (configurable)
- **Purpose**: Full user workflow testing

### Running Tests
```bash
# Watch mode (development)
npm run test

# Single run with coverage
npm run test:coverage

# Visual test runner
npm run test:ui

# All quality checks
npm run test:all
```

## 🚀 Deployment

### Staging Deployment
```bash
npm run deploy:staging
```

### Production Deployment
```bash
npm run deploy:production
```

### Docker Deployment
```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# Or using docker-compose
docker-compose up -d
```

## 📊 CI/CD Pipeline

The project includes a comprehensive CI/CD pipeline with:

### Continuous Integration
- **Linting & Type Checking**
- **Unit & Integration Tests**
- **Security Scanning** (CodeQL, dependency audit)
- **Build Verification**
- **Coverage Reports**

### Continuous Deployment
- **Automated staging deployment** on `develop` branch
- **Production deployment** on `main` branch
- **Docker image building** and registry push
- **Health checks** and rollback capabilities

### Quality Gates
- **Test Coverage**: Minimum 80%
- **Bundle Size**: Maximum 5MB
- **Performance**: Lighthouse CI integration
- **Security**: Vulnerability scanning
- **Accessibility**: Automated a11y testing

## 🔒 Security

This project implements multiple security measures:

- **Content Security Policy (CSP)** headers
- **HTTPS Strict Transport Security (HSTS)**
- **Dependency vulnerability scanning**
- **Static code analysis with CodeQL**
- **Secrets scanning with TruffleHog**
- **Regular security audits**

For security issues, please see our [Security Policy](SECURITY.md).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `npm run test:all`
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a pull request

## 📈 Performance

### Bundle Optimization
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Dead code elimination
- **Asset Optimization**: Image and font optimization
- **Compression**: Brotli and Gzip compression

### Monitoring
- **Performance Budgets**: Bundle size monitoring
- **Lighthouse CI**: Automated performance testing
- **Error Tracking**: Sentry integration
- **Analytics**: Google Analytics integration (optional)

## 🛡 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile
- **Target**: ES2015+ (configurable in build process)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vitest](https://vitest.dev/) - Testing framework
- [GitHub Actions](https://github.com/features/actions) - CI/CD platform

## 📞 Support

- **Documentation**: Check the docs in this repository
- **Issues**: [GitHub Issues](https://github.com/your-username/react-template-project/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/react-template-project/discussions)
- **Email**: support@example.com

---

**Happy coding!** 🎉

Built with ❤️ by the React Template Project team
