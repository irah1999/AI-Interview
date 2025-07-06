
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Users, 
  AlertTriangle, 
  Camera, 
  Clock, 
  Monitor,
  ArrowLeft 
} from "lucide-react";

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const [interviewDuration, setInterviewDuration] = useState(30);
  const [warningThreshold, setWarningThreshold] = useState(3);

  // Mock data for demonstration
  const activeInterviews = [
    {
      id: "INT-001",
      candidate: "John Doe",
      position: "Senior Developer",
      startTime: "14:30",
      warnings: 1,
      status: "active"
    },
    {
      id: "INT-002", 
      candidate: "Jane Smith",
      position: "Product Manager",
      startTime: "15:00",
      warnings: 0,
      status: "active"
    }
  ];

  const recentWarnings = [
    {
      id: "W-001",
      candidate: "John Doe",
      type: "Looking away from screen",
      time: "14:45",
      severity: "medium"
    },
    {
      id: "W-002",
      candidate: "Alice Johnson",
      type: "Multiple faces detected",
      time: "13:20",
      severity: "high"
    },
    {
      id: "W-003",
      candidate: "Bob Wilson",
      type: "Excessive head movement",
      time: "12:15",
      severity: "low"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-slate-800 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-300">Monitor and configure interview sessions</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="settings" className="text-white">Settings</TabsTrigger>
            <TabsTrigger value="monitoring" className="text-white">Live Monitoring</TabsTrigger>
            <TabsTrigger value="reports" className="text-white">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Interviews</p>
                      <p className="text-2xl font-bold text-white">2</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Warnings</p>
                      <p className="text-2xl font-bold text-white">7</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Recordings</p>
                      <p className="text-2xl font-bold text-white">15</p>
                    </div>
                    <Camera className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg Duration</p>
                      <p className="text-2xl font-bold text-white">28m</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Interviews */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Active Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeInterviews.map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse" />
                        <div>
                          <p className="text-white font-semibold">{interview.candidate}</p>
                          <p className="text-gray-400 text-sm">{interview.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={interview.warnings > 0 ? "destructive" : "secondary"}>
                          {interview.warnings} warnings
                        </Badge>
                        <span className="text-gray-400 text-sm">Started {interview.startTime}</span>
                        <Button size="sm" variant="outline" className="text-white border-slate-600">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Interview Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-white">Interview Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={interviewDuration}
                      onChange={(e) => setInterviewDuration(Number(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="threshold" className="text-white">Warning Threshold</Label>
                    <Input
                      id="threshold"
                      type="number"
                      value={warningThreshold}
                      onChange={(e) => setWarningThreshold(Number(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Monitor className="h-5 w-5 mr-2" />
                  Live Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Live monitoring interface would be implemented here</p>
                  <p className="text-gray-500 text-sm mt-2">Real-time video feeds and AI analysis</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Warning Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentWarnings.map((warning) => (
                    <div key={warning.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`h-3 w-3 rounded-full ${getSeverityColor(warning.severity)}`} />
                        <div>
                          <p className="text-white font-semibold">{warning.candidate}</p>
                          <p className="text-gray-400 text-sm">{warning.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-white border-slate-600">
                          {warning.severity}
                        </Badge>
                        <span className="text-gray-400 text-sm">{warning.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
