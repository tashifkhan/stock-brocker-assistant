import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  Upload, 
  FileText, 
  Download, 
  Save,
  Edit,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle
} from "lucide-react"

const previousArticles = [
  {
    id: 1,
    title: "Tech Sector Analysis: AI Revolution Drives Growth",
    reports: 5,
    dateCreated: "2025-07-22",
    status: "published",
    wordCount: 1247
  },
  {
    id: 2,
    title: "Banking Sector Outlook: Interest Rate Impacts",
    reports: 3,
    dateCreated: "2025-07-20",
    status: "draft",
    wordCount: 856
  },
  {
    id: 3,
    title: "Energy Transition: Investment Opportunities",
    reports: 7,
    dateCreated: "2025-07-18",
    status: "published",
    wordCount: 1523
  }
]

const uploadedReports = [
  {
    name: "Goldman_Sachs_AAPL_Analysis.pdf",
    analyst: "Goldman Sachs",
    recommendation: "Buy",
    targetPrice: "$195",
    uploadTime: "2 hours ago"
  },
  {
    name: "Morgan_Stanley_AAPL_Report.pdf",
    analyst: "Morgan Stanley",
    recommendation: "Overweight",
    targetPrice: "$200",
    uploadTime: "2 hours ago"
  },
  {
    name: "JP_Morgan_AAPL_Update.pdf",
    analyst: "JP Morgan",
    recommendation: "Neutral",
    targetPrice: "$180",
    uploadTime: "2 hours ago"
  }
]

const keyTakeaways = [
  {
    point: "Strong consensus on Apple's AI capabilities driving future growth",
    sources: 3,
    sentiment: "positive"
  },
  {
    point: "Services revenue showing consistent 15% YoY growth trajectory",
    sources: 2,
    sentiment: "positive"
  },
  {
    point: "iPhone sales showing seasonal weakness in China market",
    sources: 2,
    sentiment: "negative"
  },
  {
    point: "Supply chain optimization improving margin outlook",
    sources: 3,
    sentiment: "positive"
  }
]

const recommendationChanges = [
  {
    firm: "Goldman Sachs",
    previous: "Neutral",
    current: "Buy",
    change: "upgrade"
  },
  {
    firm: "Morgan Stanley",
    previous: "Overweight",
    current: "Overweight",
    change: "maintained"
  },
  {
    firm: "JP Morgan",
    previous: "Overweight",
    current: "Neutral",
    change: "downgrade"
  }
]

const sampleArticle = `# Apple Inc. (AAPL): Analyst Consensus Points to AI-Driven Growth Potential

## Executive Summary

Following a comprehensive analysis of recent broker reports from Goldman Sachs, Morgan Stanley, and JP Morgan, Apple Inc. (AAPL) emerges as a compelling investment opportunity driven by artificial intelligence capabilities and services growth. Despite some regional headwinds, the consensus view supports a positive outlook for the technology giant.

## Key Investment Highlights

### AI Integration Driving Future Value
Analysts across all three major investment banks emphasize Apple's strategic positioning in the artificial intelligence landscape. The company's integration of AI capabilities across its ecosystem is viewed as a significant competitive advantage that could drive both hardware upgrade cycles and services monetization.

### Services Revenue Momentum
The services segment continues to demonstrate remarkable consistency, with analysts noting a sustained 15% year-over-year growth trajectory. This recurring revenue stream provides stability and higher margins, contributing to overall financial resilience.

### Supply Chain Excellence
Recent supply chain optimizations have positioned Apple for improved margin expansion. Analysts highlight the company's ability to maintain efficient operations while managing global supply chain complexities.

## Regional Market Dynamics

### China Market Considerations
Multiple reports acknowledge seasonal weakness in iPhone sales within the Chinese market. However, this is viewed as a temporary headwind rather than a structural concern, with analysts expecting recovery as new product cycles emerge.

## Analyst Recommendation Summary

- **Goldman Sachs**: Upgraded to Buy with $195 price target
- **Morgan Stanley**: Maintained Overweight rating with $200 price target  
- **JP Morgan**: Downgraded to Neutral with $180 price target

## Investment Conclusion

The preponderance of analyst opinion suggests Apple's strategic investments in artificial intelligence, combined with its robust services business, create a favorable investment environment. While near-term regional challenges exist, the long-term growth trajectory remains compelling.

*This analysis is based on broker reports published between July 20-22, 2025. Past performance does not guarantee future results.*`

export default function BrokerReports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Broker Report Articles</h1>
        <p className="text-muted-foreground">
          Upload multiple broker reports and generate synthesized articles with AI-powered analysis.
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Broker Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center space-y-4">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-medium">Upload multiple broker reports for synthesis</p>
              <p className="text-muted-foreground">Supports PDF files up to 10MB each</p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Button>Choose Files</Button>
              <span className="text-muted-foreground">or</span>
              <Button variant="outline">Browse</Button>
            </div>
          </div>

          {uploadedReports.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium">Uploaded Reports (3)</h3>
              {uploadedReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.analyst} • {report.uploadTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{report.recommendation}</Badge>
                    <span className="text-sm font-medium">{report.targetPrice}</span>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end mt-4">
                <Button className="bg-accent text-accent-foreground">
                  Generate Article
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Previous Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previousArticles.map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {article.reports} reports • {article.wordCount} words • {article.dateCreated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {article.status === 'published' ? (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Draft
                    </Badge>
                  )}
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Generated Article */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Generated Article - Apple Inc. Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="article" className="space-y-4">
            <TabsList>
              <TabsTrigger value="article">Article</TabsTrigger>
              <TabsTrigger value="takeaways">Key Takeaways</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="targets">Price Targets</TabsTrigger>
            </TabsList>

            <TabsContent value="article">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Draft</Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={sampleArticle}
                  className="min-h-[600px] font-mono text-sm"
                  readOnly
                />
              </div>
            </TabsContent>

            <TabsContent value="takeaways">
              <Card>
                <CardHeader>
                  <CardTitle>Key Takeaways from Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {keyTakeaways.map((takeaway, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          takeaway.sentiment === 'positive' ? 'bg-green-500' :
                          takeaway.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{takeaway.point}</p>
                          <p className="text-sm text-muted-foreground">
                            Mentioned in {takeaway.sources} reports
                          </p>
                        </div>
                        {takeaway.sentiment === 'positive' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : takeaway.sentiment === 'negative' ? (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        ) : (
                          <Minus className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle>Recommendation Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendationChanges.map((rec, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-medium">{rec.firm}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{rec.previous}</span>
                              <span>→</span>
                              <span>{rec.current}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          rec.change === 'upgrade' ? 'default' :
                          rec.change === 'downgrade' ? 'destructive' : 'secondary'
                        }>
                          {rec.change === 'upgrade' && <TrendingUp className="h-3 w-3 mr-1" />}
                          {rec.change === 'downgrade' && <TrendingDown className="h-3 w-3 mr-1" />}
                          {rec.change === 'maintained' && <Minus className="h-3 w-3 mr-1" />}
                          {rec.change}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="targets">
              <Card>
                <CardHeader>
                  <CardTitle>Price Target Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">$200</p>
                      <p className="text-sm text-muted-foreground">Highest Target</p>
                      <p className="text-xs text-muted-foreground">Morgan Stanley</p>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-2xl font-bold">$192</p>
                      <p className="text-sm text-muted-foreground">Average Target</p>
                      <p className="text-xs text-muted-foreground">3 Analysts</p>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">$180</p>
                      <p className="text-sm text-muted-foreground">Lowest Target</p>
                      <p className="text-xs text-muted-foreground">JP Morgan</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium mb-2">Target Price Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current Price: $185</span>
                        <span>Avg. Upside: +3.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}