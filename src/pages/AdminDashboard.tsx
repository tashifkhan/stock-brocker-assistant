import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  FileBarChart, 
  Activity, 
  TrendingUp,
  Shield,
  Settings,
  Download,
  Edit,
  Eye,
  Trash2
} from "lucide-react"

const systemStats = [
  {
    title: "Total Users",
    value: "45",
    change: "+3 this month",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "Documents Processed",
    value: "1,247",
    change: "+156 this week",
    icon: FileBarChart,
    color: "text-green-600"
  },
  {
    title: "API Requests",
    value: "23,456",
    change: "+12% from last month",
    icon: Activity,
    color: "text-purple-600"
  },
  {
    title: "System Uptime",
    value: "99.9%",
    change: "Last 30 days",
    icon: TrendingUp,
    color: "text-orange-600"
  }
]

const userData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Admin",
    lastActive: "2025-07-23",
    documentsProcessed: 89,
    status: "active"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "Analyst",
    lastActive: "2025-07-23",
    documentsProcessed: 156,
    status: "active"
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@company.com",
    role: "Editor",
    lastActive: "2025-07-22",
    documentsProcessed: 67,
    status: "active"
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.r@company.com",
    role: "Analyst",
    lastActive: "2025-07-20",
    documentsProcessed: 234,
    status: "inactive"
  },
  {
    id: 5,
    name: "David Park",
    email: "d.park@company.com",
    role: "Viewer",
    lastActive: "2025-07-19",
    documentsProcessed: 12,
    status: "active"
  }
]

const toolUsageStats = [
  {
    tool: "Financial Data Analysis",
    users: 28,
    documents: 456,
    avgTime: "8.5 min",
    satisfaction: "94%"
  },
  {
    tool: "Editorial Assistant",
    users: 15,
    documents: 234,
    avgTime: "12.3 min",
    satisfaction: "89%"
  },
  {
    tool: "Broker Report Articles",
    users: 12,
    documents: 89,
    avgTime: "15.7 min",
    satisfaction: "92%"
  },
  {
    tool: "Market Summary",
    users: 35,
    documents: 156,
    avgTime: "3.2 min",
    satisfaction: "96%"
  },
  {
    tool: "Corporate Filings Alerts",
    users: 22,
    documents: 312,
    avgTime: "2.1 min",
    satisfaction: "91%"
  }
]

const systemHealth = [
  { service: "API Gateway", status: "healthy", uptime: "99.9%", response: "145ms" },
  { service: "Document Processing", status: "healthy", uptime: "99.8%", response: "2.3s" },
  { service: "AI Analysis Engine", status: "warning", uptime: "98.5%", response: "3.7s" },
  { service: "Database", status: "healthy", uptime: "100%", response: "12ms" },
  { service: "File Storage", status: "healthy", uptime: "99.9%", response: "89ms" }
]

const recentActivity = [
  {
    user: "Sarah Johnson",
    action: "Generated market summary report",
    timestamp: "2025-07-23 14:30",
    tool: "Market Summary"
  },
  {
    user: "Michael Chen",
    action: "Processed financial document",
    timestamp: "2025-07-23 14:15",
    tool: "Financial Data Analysis"
  },
  {
    user: "Emily Rodriguez",
    action: "Created broker report article",
    timestamp: "2025-07-23 13:45",
    tool: "Broker Report Articles"
  },
  {
    user: "John Doe",
    action: "Added 3 companies to watchlist",
    timestamp: "2025-07-23 13:20",
    tool: "Corporate Filings Alerts"
  },
  {
    user: "David Park",
    action: "Used editorial suggestions",
    timestamp: "2025-07-23 12:55",
    tool: "Editorial Assistant"
  }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span>Admin Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            System overview and user management for the Financial AI Suite
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Analytics
        </Button>
      </div>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="usage">Tool Usage</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>{user.documentsProcessed}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Tool Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool</TableHead>
                    <TableHead>Active Users</TableHead>
                    <TableHead>Documents Processed</TableHead>
                    <TableHead>Avg. Processing Time</TableHead>
                    <TableHead>User Satisfaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {toolUsageStats.map((tool, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{tool.tool}</TableCell>
                      <TableCell>{tool.users}</TableCell>
                      <TableCell>{tool.documents}</TableCell>
                      <TableCell>{tool.avgTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{tool.satisfaction}</span>
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: tool.satisfaction }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Usage Trends</h3>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Usage Analytics Chart</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Health Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemHealth.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{service.service}</TableCell>
                      <TableCell>
                        <Badge variant={
                          service.status === 'healthy' ? 'default' :
                          service.status === 'warning' ? 'secondary' : 'destructive'
                        } className={
                          service.status === 'healthy' ? 'bg-green-100 text-green-800' :
                          service.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {service.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{service.uptime}</TableCell>
                      <TableCell>{service.response}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">System Performance</h4>
                  <p className="text-sm text-green-700">
                    All critical services operating normally. Average response time: 1.2s
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Performance Alert</h4>
                  <p className="text-sm text-yellow-700">
                    AI Analysis Engine showing slower response times. Monitoring in progress.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Activity className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{activity.tool}</Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Activity Heatmap</h3>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">User Activity Heatmap</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}