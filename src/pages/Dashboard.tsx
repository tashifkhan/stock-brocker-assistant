import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  FileText, 
  PenTool, 
  TrendingUp, 
  Bell,
  ArrowRight,
  Activity,
  DollarSign,
  Users,
  FileBarChart
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const quickAccessCards = [
  {
    title: "Financial Data Analysis",
    description: "Upload and analyze financial documents with AI-powered insights",
    icon: BarChart3,
    url: "/financial-data",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600"
  },
  {
    title: "Editorial Assistant",
    description: "AI-powered writing assistance for Google Docs integration",
    icon: PenTool,
    url: "/editorial",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600"
  },
  {
    title: "Broker Report Articles",
    description: "Generate synthesized articles from multiple broker reports",
    icon: FileText,
    url: "/broker-reports",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600"
  },
  {
    title: "Market Summary",
    description: "Automated daily financial market summaries and insights",
    icon: TrendingUp,
    url: "/market-summary",
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-600"
  },
  {
    title: "Corporate Filings Alerts",
    description: "Real-time notifications for corporate filing updates",
    icon: Bell,
    url: "/filings-alerts",
    color: "bg-red-50 border-red-200",
    iconColor: "text-red-600"
  }
]

const recentActivity = [
  {
    action: "Market Summary for July 23, 2025 generated",
    time: "2 hours ago",
    type: "success"
  },
  {
    action: "New filing detected for AAPL - Form 10-K",
    time: "4 hours ago",
    type: "alert"
  },
  {
    action: "Financial analysis completed for Q2 Report",
    time: "6 hours ago",
    type: "info"
  },
  {
    action: "Broker report article published: Tech Sector Analysis",
    time: "1 day ago",
    type: "success"
  },
  {
    action: "Editorial suggestions applied to 5 documents",
    time: "1 day ago",
    type: "info"
  }
]

const keyMetrics = [
  {
    title: "Documents Analyzed",
    value: "1,247",
    change: "+12%",
    icon: FileBarChart,
    color: "text-blue-600"
  },
  {
    title: "Articles Generated",
    value: "89",
    change: "+5%",
    icon: FileText,
    color: "text-green-600"
  },
  {
    title: "Active Alerts",
    value: "156",
    change: "+8%",
    icon: Bell,
    color: "text-orange-600"
  },
  {
    title: "Total Users",
    value: "45",
    change: "+3%",
    icon: Users,
    color: "text-purple-600"
  }
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your financial AI tools and recent activity.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{metric.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Quick Access</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickAccessCards.map((card) => (
            <Card key={card.title} className={`${card.color} hover:shadow-md transition-shadow cursor-pointer`}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{card.description}</p>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between"
                  onClick={() => navigate(card.url)}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'alert' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Documents Processed</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">New Alerts</span>
                <Badge variant="destructive">5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Articles Generated</span>
                <Badge variant="default">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Market Updates</span>
                <Badge className="bg-accent text-accent-foreground">1</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}