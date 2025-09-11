import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  Plus, 
  Search, 
  ExternalLink,
  Calendar,
  FileText,
  Trash2,
  Settings,
  Clock
} from "lucide-react"

const watchlistCompanies = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    dateAdded: "2025-07-01",
    lastFiling: "10-K",
    filingDate: "2025-07-20",
    alertsCount: 3
  },
  {
    id: 2,
    symbol: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    dateAdded: "2025-06-15",
    lastFiling: "8-K",
    filingDate: "2025-07-18",
    alertsCount: 2
  },
  {
    id: 3,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Communication Services",
    dateAdded: "2025-06-20",
    lastFiling: "10-Q",
    filingDate: "2025-07-15",
    alertsCount: 4
  },
  {
    id: 4,
    symbol: "TSLA",
    name: "Tesla, Inc.",
    sector: "Consumer Discretionary",
    dateAdded: "2025-07-05",
    lastFiling: "8-K",
    filingDate: "2025-07-22",
    alertsCount: 1
  },
  {
    id: 5,
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer Discretionary",
    dateAdded: "2025-05-30",
    lastFiling: "10-Q",
    filingDate: "2025-07-12",
    alertsCount: 5
  }
]

const recentAlerts = [
  {
    id: 1,
    company: "Apple Inc.",
    symbol: "AAPL",
    filingType: "10-K",
    filingDate: "2025-07-22",
    alertTime: "2 hours ago",
    description: "Annual Report filed with SEC",
    priority: "high",
    read: false
  },
  {
    id: 2,
    company: "Tesla, Inc.",
    symbol: "TSLA",
    filingType: "8-K",
    filingDate: "2025-07-22",
    alertTime: "4 hours ago",
    description: "Current Report - Material Agreement",
    priority: "medium",
    read: false
  },
  {
    id: 3,
    company: "Microsoft Corporation",
    symbol: "MSFT",
    filingType: "DEF 14A",
    filingDate: "2025-07-21",
    alertTime: "1 day ago",
    description: "Proxy Statement filed",
    priority: "low",
    read: true
  },
  {
    id: 4,
    company: "Alphabet Inc.",
    symbol: "GOOGL",
    filingType: "10-Q",
    filingDate: "2025-07-20",
    alertTime: "2 days ago",
    description: "Quarterly Report filed",
    priority: "high",
    read: true
  },
  {
    id: 5,
    company: "Amazon.com Inc.",
    symbol: "AMZN",
    filingType: "8-K",
    filingDate: "2025-07-19",
    alertTime: "3 days ago",
    description: "Current Report - Executive Changes",
    priority: "medium",
    read: true
  }
]

const filingTypes = [
  { type: "10-K", description: "Annual Report", count: 12 },
  { type: "10-Q", description: "Quarterly Report", count: 24 },
  { type: "8-K", description: "Current Report", count: 45 },
  { type: "DEF 14A", description: "Proxy Statement", count: 8 },
  { type: "13F", description: "Holdings Report", count: 6 },
  { type: "SC 13G", description: "Beneficial Ownership", count: 3 }
]

const alertSettings = [
  { type: "Email Notifications", enabled: true, description: "Receive email alerts for new filings" },
  { type: "In-App Notifications", enabled: true, description: "Show notifications within the platform" },
  { type: "Priority Filtering", enabled: false, description: "Only show high-priority filings" },
  { type: "After Hours Alerts", enabled: true, description: "Send alerts outside business hours" }
]

export default function FilingsAlerts() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Corporate Filings Alerts</h1>
        <p className="text-muted-foreground">
          Monitor SEC filings and get real-time notifications for companies on your watchlist.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Companies Watched</p>
                <p className="text-2xl font-bold">{watchlistCompanies.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Alerts Today</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Filings</p>
                <p className="text-2xl font-bold">98</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread Alerts</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Badge className="bg-accent text-accent-foreground">New</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Recent Filing Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 border rounded-lg ${
                    !alert.read ? 'bg-blue-50 border-blue-200' : 'bg-card'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <FileText className="h-5 w-5 text-primary mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{alert.company} ({alert.symbol})</h3>
                            {!alert.read && <Badge variant="destructive" className="text-xs">New</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{alert.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Filing: {alert.filingType}</span>
                            <span>Date: {alert.filingDate}</span>
                            <span>{alert.alertTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          alert.priority === 'high' ? 'destructive' :
                          alert.priority === 'medium' ? 'default' : 'secondary'
                        }>
                          {alert.priority}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Filing
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Company Watchlist</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search companies..." className="pl-9" />
                </div>
              </div>

              {/* Watchlist Table */}
              <div className="space-y-4">
                {watchlistCompanies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 text-primary font-bold rounded-lg">
                        {company.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{company.name} ({company.symbol})</h3>
                        <p className="text-sm text-muted-foreground">{company.sector}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>Added: {company.dateAdded}</span>
                          <span>Last Filing: {company.lastFiling} ({company.filingDate})</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <Badge variant="secondary">{company.alertsCount}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Alerts</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Filing Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filingTypes.map((filing, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{filing.type}</span>
                        <p className="text-sm text-muted-foreground">{filing.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{filing.count}</Badge>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(filing.count / 50) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monday</span>
                    <span className="font-medium">12 filings</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tuesday</span>
                    <span className="font-medium">8 filings</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Wednesday</span>
                    <span className="font-medium">15 filings</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Thursday</span>
                    <span className="font-medium">6 filings</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Friday</span>
                    <span className="font-medium">4 filings</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total This Week</span>
                      <span className="text-lg font-bold">45 filings</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Filing Activity Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Alert Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {alertSettings.map((setting, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{setting.type}</h3>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Button variant={setting.enabled ? "default" : "outline"} size="sm">
                      {setting.enabled ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                ))}
                
                <div className="pt-6 border-t">
                  <h3 className="font-medium mb-4">Filing Type Preferences</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {filingTypes.map((filing, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <span className="font-medium">{filing.type}</span>
                          <p className="text-xs text-muted-foreground">{filing.description}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                      </div>
                    ))}
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