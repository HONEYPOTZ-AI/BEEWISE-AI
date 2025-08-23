
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Brain, MessageSquare, Activity, Settings } from 'lucide-react';
import MemoryAnalytics from '@/components/MemoryAnalytics';
import SessionContinuityMonitor from '@/components/SessionContinuityMonitor';

const MemorySessionsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

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
                <Link to="/memory-management" className="text-sm text-gray-600 hover:text-gray-900">
                  Memory Management
                </Link>
                <Link to="/context-sessions" className="text-sm text-gray-600 hover:text-gray-900">
                  Context Sessions
                </Link>
                <span className="text-sm font-medium text-gray-900">
                  Memory & Sessions Dashboard
                </span>
                <Link to="/orchestration" className="text-sm text-gray-600 hover:text-gray-900">
                  Orchestration
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Memory & Context Management Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive monitoring and management for agent memory and session continuity
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/memory-management">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Brain className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="font-semibold">Memory Management</p>
                    <p className="text-sm text-gray-600">Manage agent memories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/context-sessions">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <MessageSquare className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="font-semibold">Context Sessions</p>
                    <p className="text-sm text-gray-600">Monitor active sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="font-semibold">Session Continuity</p>
                  <p className="text-sm text-gray-600">Real-time monitoring</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Settings className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="font-semibold">Analytics</p>
                  <p className="text-sm text-gray-600">Memory optimization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="memory">Memory Analytics</TabsTrigger>
            <TabsTrigger value="sessions">Session Monitor</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <div className="flex items-center">
                        <Brain className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <div className="font-medium">Memory System</div>
                          <div className="text-sm text-gray-600">Agent memory management</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">Active</div>
                        <div className="text-sm text-gray-500">99.9% uptime</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div className="flex items-center">
                        <MessageSquare className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                          <div className="font-medium">Session Management</div>
                          <div className="text-sm text-gray-600">Context continuity</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">Active</div>
                        <div className="text-sm text-gray-500">12 sessions</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                      <div className="flex items-center">
                        <Activity className="w-5 h-5 text-purple-600 mr-3" />
                        <div>
                          <div className="font-medium">Continuity Monitor</div>
                          <div className="text-sm text-gray-600">Real-time tracking</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">Monitoring</div>
                        <div className="text-sm text-gray-500">5 agents</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm font-medium">Memory created</div>
                          <div className="text-xs text-gray-500">Agent-001 • 2 minutes ago</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm font-medium">Session started</div>
                          <div className="text-xs text-gray-500">Session-789 • 5 minutes ago</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm font-medium">Agent handoff</div>
                          <div className="text-xs text-gray-500">Agent-002 → Agent-003 • 8 minutes ago</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm font-medium">Memory optimized</div>
                          <div className="text-xs text-gray-500">System cleanup • 12 minutes ago</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm font-medium">Session ended</div>
                          <div className="text-xs text-gray-500">Session-456 • 15 minutes ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-gray-600">Total Memories</div>
                    <div className="text-xs text-green-600 mt-1">↑ 5.2% this week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">23</div>
                    <div className="text-sm text-gray-600">Active Sessions</div>
                    <div className="text-xs text-blue-600 mt-1">→ No change</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">98.7%</div>
                    <div className="text-sm text-gray-600">Context Integrity</div>
                    <div className="text-xs text-green-600 mt-1">↑ 1.3% this week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">156ms</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                    <div className="text-xs text-green-600 mt-1">↓ 12ms this week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">$127.43</div>
                    <div className="text-sm text-gray-600">Monthly Cost</div>
                    <div className="text-xs text-yellow-600 mt-1">↑ $15.20 this month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="memory">
            <MemoryAnalytics />
          </TabsContent>
          
          <TabsContent value="sessions">
            <SessionContinuityMonitor />
          </TabsContent>
          
          <TabsContent value="optimization">
            <Card>
              <CardHeader>
                <CardTitle>Memory & Session Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Optimization Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Memory Cleanup</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Remove expired and low-value memories
                          </p>
                          <Button variant="outline" size="sm">
                            Run Cleanup
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <MessageSquare className="w-12 h-12 text-green-500 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Session Optimization</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Optimize session resource allocation
                          </p>
                          <Button variant="outline" size="sm">
                            Optimize Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Activity className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Performance Tuning</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Auto-tune system parameters
                          </p>
                          <Button variant="outline" size="sm">
                            Auto-tune
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Optimization Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>System Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-900">Memory Compression</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Enable compression for memories older than 30 days to reduce storage by ~40%
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Apply</Button>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-green-900">Session Pooling</h4>
                            <p className="text-sm text-green-700 mt-1">
                              Implement session pooling to reduce initialization overhead by ~25%
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-yellow-900">Context Caching</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Enable context caching for frequently accessed sessions
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Enable</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MemorySessionsDashboard;
