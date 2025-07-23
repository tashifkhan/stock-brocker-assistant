import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Download,
  Eye,
  CheckCircle,
  Clock
} from "lucide-react"

const previousAnalyses = [
  {
    id: 1,
    fileName: "AAPL_Q2_2025_10K.pdf",
    company: "Apple Inc.",
    uploadDate: "2025-07-20",
    status: "completed",
    kpis: ["Revenue: $94.8B", "Net Income: $23.6B", "EPS: $1.52"]
  },
  {
    id: 2,
    fileName: "MSFT_Annual_Report_2025.pdf",
    company: "Microsoft Corp.",
    uploadDate: "2025-07-18",
    status: "completed",
    kpis: ["Revenue: $211.9B", "Net Income: $72.4B", "ROE: 42.8%"]
  },
  {
    id: 3,
    fileName: "GOOGL_Q1_2025_Earnings.pdf",
    company: "Alphabet Inc.",
    uploadDate: "2025-07-15",
    status: "processing",
    kpis: []
  }
]

const sampleKPIs = [
  { metric: "Total Revenue", value: "$94.8B", change: "+8.2%", trend: "up" },
  { metric: "Net Income", value: "$23.6B", change: "+5.1%", trend: "up" },
  { metric: "Gross Margin", value: "44.1%", change: "-0.3%", trend: "down" },
  { metric: "Operating Margin", value: "27.5%", change: "+1.2%", trend: "up" },
  { metric: "Return on Equity", value: "56.7%", change: "+3.4%", trend: "up" },
  { metric: "Debt-to-Equity", value: "0.85", change: "-0.05", trend: "up" }
]

const extractedData = [
  { category: "Revenue", q1: "$89.5B", q2: "$94.8B", q3: "$90.1B", q4: "$97.3B" },
  { category: "Operating Income", q1: "$24.2B", q2: "$26.3B", q3: "$23.8B", q4: "$28.1B" },
  { category: "Net Income", q1: "$22.4B", q2: "$23.6B", q3: "$21.9B", q4: "$25.2B" },
  { category: "EPS", q1: "$1.44", q2: "$1.52", q3: "$1.41", q4: "$1.63" },
  { category: "Free Cash Flow", q1: "$20.1B", q2: "$21.8B", q3: "$19.5B", q4: "$23.4B" }
]

export default function FinancialData() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Financial Data Analysis</h1>
        <p className="text-muted-foreground">
          Upload financial documents and extract key insights with AI-powered analysis.
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Document</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center space-y-4">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-medium">Drag and drop your financial document here</p>
              <p className="text-muted-foreground">Supports PDF, DOC, DOCX files up to 10MB</p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Button>Choose File</Button>
              <span className="text-muted-foreground">or</span>
              <Button variant="outline">Browse</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Previous Analyses */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previousAnalyses.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">{analysis.fileName}</h3>
                    <p className="text-sm text-muted-foreground">{analysis.company}</p>
                    <p className="text-xs text-muted-foreground">Uploaded: {analysis.uploadDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {analysis.status === 'completed' ? (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Processing
                    </Badge>
                  )}
                  {analysis.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Results
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Analysis Results - Apple Inc. Q2 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="data">Extracted Data</TabsTrigger>
              <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
              <TabsTrigger value="raw">Raw Text</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sampleKPIs.map((kpi) => (
                  <Card key={kpi.metric}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{kpi.metric}</p>
                          <p className="text-2xl font-bold">{kpi.value}</p>
                        </div>
                        <div className={`flex items-center space-x-1 ${
                          kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className={`h-4 w-4 ${
                            kpi.trend === 'down' ? 'rotate-180' : ''
                          }`} />
                          <span className="text-sm font-medium">{kpi.change}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI-Generated Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Apple Inc. demonstrated strong financial performance in Q2 2025, with total revenue reaching $94.8B, 
                    representing an 8.2% increase year-over-year. The company maintained healthy profit margins with 
                    net income of $23.6B and continued to show strong operational efficiency. Key highlights include 
                    improved return on equity at 56.7% and sustained innovation investments. The slight decrease in 
                    gross margin (-0.3%) was offset by operational improvements, resulting in an overall positive 
                    financial outlook for the quarter.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Extracted Financial Data</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Q1 2025</TableHead>
                        <TableHead>Q2 2025</TableHead>
                        <TableHead>Q3 2024</TableHead>
                        <TableHead>Q4 2024</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {extractedData.map((row) => (
                        <TableRow key={row.category}>
                          <TableCell className="font-medium">{row.category}</TableCell>
                          <TableCell>{row.q1}</TableCell>
                          <TableCell className="font-medium text-primary">{row.q2}</TableCell>
                          <TableCell>{row.q3}</TableCell>
                          <TableCell>{row.q4}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visualizations">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Revenue Chart Visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Profitability Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Profitability Chart Visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Document Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/20 p-4 rounded-lg text-sm text-muted-foreground max-h-96 overflow-y-auto">
                    <p>APPLE INC. FORM 10-K FOR THE FISCAL YEAR ENDED SEPTEMBER 30, 2025</p>
                    <br />
                    <p>CONSOLIDATED STATEMENTS OF OPERATIONS</p>
                    <p>(In millions, except number of shares which are reflected in thousands and per share amounts)</p>
                    <br />
                    <p>Net sales: $94,836</p>
                    <p>Cost of sales: $52,887</p>
                    <p>Gross margin: $41,949</p>
                    <br />
                    <p>Operating expenses:</p>
                    <p>Research and development: $7,678</p>
                    <p>Selling, general and administrative: $8,297</p>
                    <p>Total operating expenses: $15,975</p>
                    <br />
                    <p>Operating income: $25,974</p>
                    <p>Other income/(expense), net: $269</p>
                    <p>Income before provision for income taxes: $26,243</p>
                    <p>Provision for income taxes: $2,617</p>
                    <p>Net income: $23,626</p>
                    <br />
                    <p>[Additional financial statement data continues...]</p>
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