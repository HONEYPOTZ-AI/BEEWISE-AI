import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import OrchestrationDashboard from '@/components/orchestration/OrchestrationDashboard';

const OrchestrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <nav className="flex items-center space-x-6">
                <Link to="/api-config" className="text-sm text-gray-600 hover:text-gray-900">
                  API Config
                </Link>
                <Link to="/api-testing" className="text-sm text-gray-600 hover:text-gray-900">
                  API Testing
                </Link>
                <Link to="/testing" className="text-sm text-gray-600 hover:text-gray-900">
                  Testing
                </Link>
                <Link to="/documentation" className="text-sm text-gray-600 hover:text-gray-900">
                  Documentation
                </Link>
                <Link to="/agent-marketplace" className="text-sm text-gray-600 hover:text-gray-900">
                  Agent Marketplace
                </Link>
                <span className="text-sm font-medium text-gray-900">
                  Agent Orchestration
                </span>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <OrchestrationDashboard />
      </main>
    </div>
  );
};

export default OrchestrationPage;