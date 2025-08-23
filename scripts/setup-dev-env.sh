#!/bin/bash

# Development environment setup script
# This script prepares the development environment for the React Template Project

set -e

echo "🚀 Setting up development environment for React Template Project..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js via nvm
install_nodejs() {
    if ! command_exists node; then
        echo "📦 Installing Node.js..."
        
        # Install nvm if not present
        if ! command_exists nvm; then
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
            source ~/.bashrc
        fi
        
        # Install and use Node.js 18
        nvm install 18
        nvm use 18
        nvm alias default 18
    else
        NODE_VERSION=$(node --version)
        echo "✅ Node.js is already installed: $NODE_VERSION"
    fi
}

# Function to install Git if not present
install_git() {
    if ! command_exists git; then
        echo "📦 Installing Git..."
        
        if command_exists apt-get; then
            sudo apt-get update && sudo apt-get install -y git
        elif command_exists brew; then
            brew install git
        elif command_exists yum; then
            sudo yum install -y git
        else
            echo "❌ Please install Git manually"
            exit 1
        fi
    else
        GIT_VERSION=$(git --version)
        echo "✅ Git is already installed: $GIT_VERSION"
    fi
}

# Function to setup Git configuration
setup_git_config() {
    echo "⚙️ Setting up Git configuration..."
    
    # Check if Git user is configured
    if ! git config user.name >/dev/null 2>&1; then
        echo "Please enter your Git user name:"
        read -r git_user_name
        git config --global user.name "$git_user_name"
    fi
    
    if ! git config user.email >/dev/null 2>&1; then
        echo "Please enter your Git email:"
        read -r git_user_email
        git config --global user.email "$git_user_email"
    fi
    
    # Set up Git aliases for productivity
    git config --global alias.st status
    git config --global alias.co checkout
    git config --global alias.br branch
    git config --global alias.ci commit
    git config --global alias.lg "log --oneline --graph --decorate --all"
    
    echo "✅ Git configuration completed"
}

# Function to install dependencies
install_dependencies() {
    echo "📦 Installing project dependencies..."
    
    if [ ! -f "package.json" ]; then
        echo "❌ package.json not found. Are you in the project root?"
        exit 1
    fi
    
    npm ci
    echo "✅ Dependencies installed"
}

# Function to setup environment files
setup_environment_files() {
    echo "⚙️ Setting up environment files..."
    
    # Copy environment templates if they don't exist
    local env_files=("development" "staging" "production")
    
    for env in "${env_files[@]}"; do
        if [ ! -f ".env.$env" ] && [ -f "env.$env" ]; then
            cp "env.$env" ".env.$env"
            echo "✅ Created .env.$env from template"
        fi
    done
    
    if [ ! -f ".env" ]; then
        cp "env.development" ".env"
        echo "✅ Created .env from development template"
    fi
}

# Function to setup Git hooks
setup_git_hooks() {
    echo "🪝 Setting up Git hooks..."
    
    # Create pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
# Pre-commit hook for React Template Project

set -e

echo "🔍 Running pre-commit checks..."

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Run tests
npm run test:run

echo "✅ Pre-commit checks passed"
EOF

    chmod +x .git/hooks/pre-commit
    
    # Create pre-push hook
    cat > .git/hooks/pre-push << 'EOF'
#!/bin/sh
# Pre-push hook for React Template Project

set -e

echo "🚀 Running pre-push checks..."

# Run full test suite
npm run test:run

# Run build to ensure it works
npm run build:dev

echo "✅ Pre-push checks passed"
EOF

    chmod +x .git/hooks/pre-push
    
    echo "✅ Git hooks installed"
}

# Function to install recommended VS Code extensions
setup_vscode_extensions() {
    if command_exists code; then
        echo "🔧 Installing recommended VS Code extensions..."
        
        local extensions=(
            "bradlc.vscode-tailwindcss"
            "esbenp.prettier-vscode"
            "ms-vscode.vscode-eslint"
            "ms-vscode.vscode-typescript-next"
            "formulahendry.auto-rename-tag"
            "christian-kohler.path-intellisense"
            "ms-vscode.vscode-json"
            "redhat.vscode-yaml"
            "ms-vscode.vscode-react-refactor"
            "github.vscode-pull-request-github"
        )
        
        for extension in "${extensions[@]}"; do
            code --install-extension "$extension" --force
        done
        
        echo "✅ VS Code extensions installed"
    else
        echo "ℹ️ VS Code not found, skipping extension installation"
    fi
}

# Function to create VS Code workspace settings
setup_vscode_settings() {
    echo "⚙️ Setting up VS Code workspace settings..."
    
    mkdir -p .vscode
    
    cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}
EOF

    cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-react-refactor",
    "github.vscode-pull-request-github"
  ]
}
EOF

    echo "✅ VS Code settings configured"
}

# Function to verify setup
verify_setup() {
    echo "🔍 Verifying development environment setup..."
    
    # Check Node.js version
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    echo "Node.js: $NODE_VERSION"
    echo "npm: $NPM_VERSION"
    
    # Try to run the development server
    echo "Testing development server..."
    timeout 10 npm run dev &>/dev/null &
    sleep 5
    
    if curl -f -s http://localhost:5173 > /dev/null; then
        echo "✅ Development server is working"
        pkill -f vite || true
    else
        echo "⚠️ Could not verify development server (this might be normal)"
        pkill -f vite || true
    fi
    
    # Run linting
    echo "Testing linter..."
    npm run lint
    
    # Run type checking
    echo "Testing type checking..."
    npx tsc --noEmit
    
    echo "✅ Environment verification completed"
}

# Function to display next steps
show_next_steps() {
    echo ""
    echo "🎉 Development environment setup completed!"
    echo ""
    echo "Next steps:"
    echo "  1. Start the development server: npm run dev"
    echo "  2. Open http://localhost:5173 in your browser"
    echo "  3. Start coding! 🚀"
    echo ""
    echo "Useful commands:"
    echo "  npm run dev          - Start development server"
    echo "  npm run build        - Build for production"
    echo "  npm run test         - Run tests"
    echo "  npm run lint         - Run linter"
    echo "  npm run test:ui      - Run tests with UI"
    echo ""
    echo "Happy coding! 💻"
}

# Main setup function
main() {
    echo "🎯 React Template Project - Development Environment Setup"
    echo "========================================================"
    
    install_git
    setup_git_config
    install_nodejs
    install_dependencies
    setup_environment_files
    setup_git_hooks
    setup_vscode_extensions
    setup_vscode_settings
    verify_setup
    show_next_steps
}

# Run main function
main "$@"
