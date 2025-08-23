# Contributing to React Template Project

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Security](#security)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git
- A GitHub account

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/react-template-project.git
   cd react-template-project
   ```

3. Run the setup script:
   ```bash
   npm run setup:dev
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Process

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/description` - Feature development
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical production fixes

### Workflow

1. Create a feature branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards
3. Write or update tests as necessary
4. Run the test suite:
   ```bash
   npm run test:all
   ```

5. Commit your changes using conventional commits:
   ```bash
   git commit -m "feat: add new feature description"
   ```

6. Push to your fork and create a pull request

### Commit Message Convention

We use [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Prefer interfaces over types for object shapes
- Use strict type checking
- Document complex types with JSDoc

### React

- Use functional components with hooks
- Follow the hooks rules
- Use proper prop validation
- Implement error boundaries where appropriate

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use semantic HTML elements
- Ensure accessibility compliance (WCAG 2.1 AA)

### Code Quality

- Follow ESLint and Prettier configurations
- Maintain test coverage above 80%
- Use meaningful variable and function names
- Keep functions small and focused
- Comment complex logic

### File Structure

```
src/
  components/     # Reusable UI components
    ui/          # Base UI components (from shadcn/ui)
  hooks/         # Custom React hooks
  lib/           # Utility libraries
  pages/         # Page components
  types/         # TypeScript type definitions
  utils/         # Utility functions
  test/          # Test files and utilities
```

## Testing

### Testing Strategy

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

### Writing Tests

- Write tests for all new features
- Maintain existing test coverage
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

### Running Tests

```bash
# Run all tests
npm run test:all

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Run linting and fix any issues
3. Update documentation if needed
4. Add or update tests for your changes
5. Verify the build works locally

### PR Requirements

- Clear title and description
- Reference related issues
- Include screenshots for UI changes
- Ensure CI checks pass
- Request review from maintainers

### Review Process

1. Automated checks must pass
2. Code review by maintainers
3. Testing by reviewers
4. Approval required before merging

## Issue Reporting

### Bug Reports

When reporting bugs, include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment information
- Screenshots or error messages
- Minimal reproduction example

### Feature Requests

When requesting features:

- Clear description of the need
- Proposed solution
- Alternative solutions considered
- Use cases and benefits
- Implementation complexity estimate

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority:high` - High priority issues
- `priority:low` - Low priority issues

## Security

- Follow our [Security Policy](SECURITY.md)
- Report security vulnerabilities privately
- Never commit sensitive information
- Use environment variables for configuration

## Style Guide

### JavaScript/TypeScript

```typescript
// Good
interface UserProps {
  name: string;
  email: string;
  isActive: boolean;
}

const UserCard: React.FC<UserProps> = ({ name, email, isActive }) => {
  const handleClick = useCallback(() => {
    // Handle click logic
  }, []);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{email}</p>
    </div>
  );
};
```

### CSS/Tailwind

```tsx
// Good - Mobile first, semantic classes
<div className="
  p-4 
  border border-gray-200 
  rounded-lg 
  shadow-sm
  md:p-6 
  lg:p-8
  hover:shadow-md 
  transition-shadow
">
```

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes
- Project documentation
- Annual contributor appreciation

## Questions?

- Create a discussion on GitHub
- Join our community chat
- Email the maintainers

Thank you for contributing to React Template Project! 🎉
