import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ExternalLink, 
  Download, 
  PenTool, 
  Settings,
  CheckCircle,
  Lightbulb,
  BookOpen,
  FileText
} from "lucide-react"

const styleGuides = [
  {
    name: "Financial News Style",
    description: "Professional tone for market reports and financial articles",
    status: "active",
    lastUpdated: "2025-07-20"
  },
  {
    name: "Research Reports",
    description: "Academic and analytical writing style for research publications",
    status: "active",
    lastUpdated: "2025-07-18"
  },
  {
    name: "Client Communications",
    description: "Clear and accessible language for client-facing documents",
    status: "draft",
    lastUpdated: "2025-07-15"
  }
]

const recentSuggestions = [
  {
    document: "Q2 Market Analysis Report",
    suggestions: 15,
    accepted: 12,
    type: "tone",
    time: "2 hours ago"
  },
  {
    document: "Client Investment Strategy",
    suggestions: 8,
    accepted: 7,
    type: "clarity",
    time: "4 hours ago"
  },
  {
    document: "Earnings Call Summary",
    suggestions: 22,
    accepted: 18,
    type: "conciseness",
    time: "6 hours ago"
  },
  {
    document: "Risk Assessment Report",
    suggestions: 11,
    accepted: 9,
    type: "formatting",
    time: "1 day ago"
  }
]

const features = [
  {
    title: "Smart Headlines",
    description: "Generate compelling headlines from your content",
    icon: FileText,
    examples: ["Market Volatility Signals New Opportunities", "Tech Stocks Rally Despite Economic Uncertainty"]
  },
  {
    title: "Tone Enhancement",
    description: "Adjust writing tone for different audiences",
    icon: PenTool,
    examples: ["Professional → Conversational", "Technical → Accessible"]
  },
  {
    title: "Clarity Improvements",
    description: "Simplify complex financial concepts",
    icon: Lightbulb,
    examples: ["Reduce sentence length", "Define technical terms"]
  },
  {
    title: "Style Consistency",
    description: "Maintain consistent style across documents",
    icon: BookOpen,
    examples: ["Apply house style", "Consistent terminology"]
  }
]

export default function Editorial() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AI-Powered Editorial Assistant</h1>
        <p className="text-muted-foreground">
          Enhance your writing with AI-powered suggestions and maintain consistent style across all documents.
        </p>
      </div>

      {/* Google Docs Integration */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ExternalLink className="h-5 w-5" />
            <span>Google Docs Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Install our Google Docs Add-on to get real-time AI writing assistance directly in your documents.
          </p>
          
          <div className="flex items-center space-x-4">
            <Button className="bg-primary text-primary-foreground">
              <Download className="h-4 w-4 mr-2" />
              Install Add-on
            </Button>
            <Button variant="outline">
              View Installation Guide
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-4 bg-card rounded-lg border">
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                <div className="space-y-1">
                  {feature.examples.map((example, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="style-guides">Style Guides</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Editorial Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSuggestions.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <PenTool className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">{item.document}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.suggestions} suggestions • {item.accepted} accepted
                        </p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {item.type}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style-guides">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Style Guides Management</CardTitle>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Create New Guide
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {styleGuides.map((guide, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">{guide.name}</h3>
                        <p className="text-sm text-muted-foreground">{guide.description}</p>
                        <p className="text-xs text-muted-foreground">Last updated: {guide.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={guide.status === 'active' ? 'default' : 'secondary'}>
                        {guide.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {guide.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Documents Reviewed</p>
                    <p className="text-2xl font-bold">247</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Suggestions Made</p>
                    <p className="text-2xl font-bold">1,423</p>
                  </div>
                  <Lightbulb className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                    <p className="text-2xl font-bold">89%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600">+3%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Time Saved</p>
                    <p className="text-2xl font-bold">156h</p>
                  </div>
                  <PenTool className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600">+15%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed">
                <div className="text-center">
                  <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Editorial Analytics Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}