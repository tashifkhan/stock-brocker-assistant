import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  BarChart3,
  DollarSign,
  Volume2,
  Activity
} from "lucide-react"

const marketIndices = [
  {
    name: "S&P 500",
    symbol: "SPX",
    price: "4,567.23",
    change: "+23.45",
    changePercent: "+0.52%",
    trend: "up"
  },
  {
    name: "Dow Jones",
    symbol: "DJI",
    price: "35,234.12",
    change: "+156.78",
    changePercent: "+0.45%",
    trend: "up"
  },
  {
    name: "NASDAQ",
    symbol: "IXIC",
    price: "14,789.56",
    change: "-45.23",
    changePercent: "-0.31%",
    trend: "down"
  },
  {
    name: "Russell 2000",
    symbol: "RUT",
    price: "2,123.45",
    change: "+12.34",
    changePercent: "+0.58%",
    trend: "up"
  }
]

const marketData = [
  { metric: "Advancing Stocks", value: "1,847", percentage: "58%" },
  { metric: "Declining Stocks", value: "1,342", percentage: "42%" },
  { metric: "Unchanged", value: "123", percentage: "4%" },
  { metric: "New 52-Week Highs", value: "89", percentage: "-" },
  { metric: "New 52-Week Lows", value: "34", percentage: "-" },
  { metric: "Total Volume", value: "4.2B", percentage: "+12%" }
]

const topPerformers = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: "$892.45", change: "+5.67%", volume: "45.2M" },
  { symbol: "TSLA", name: "Tesla Inc", price: "$245.67", change: "+4.23%", volume: "78.9M" },
  { symbol: "AAPL", name: "Apple Inc", price: "$185.34", change: "+3.12%", volume: "56.7M" },
  { symbol: "META", name: "Meta Platforms", price: "$334.56", change: "+2.89%", volume: "23.4M" },
  { symbol: "GOOGL", name: "Alphabet Inc", price: "$142.78", change: "+2.45%", volume: "34.5M" }
]

const bottomPerformers = [
  { symbol: "NFLX", name: "Netflix Inc", price: "$456.78", change: "-4.56%", volume: "12.3M" },
  { symbol: "AMZN", name: "Amazon.com Inc", price: "$134.56", change: "-3.45%", volume: "67.8M" },
  { symbol: "MSFT", name: "Microsoft Corp", price: "$378.90", change: "-2.34%", volume: "45.6M" },
  { symbol: "CRM", name: "Salesforce Inc", price: "$234.56", change: "-2.12%", volume: "8.9M" },
  { symbol: "UBER", name: "Uber Technologies", price: "$67.89", change: "-1.89%", volume: "15.6M" }
]

const mostTraded = [
  { symbol: "TSLA", name: "Tesla Inc", volume: "78.9M", value: "$19.4B" },
  { symbol: "AMZN", name: "Amazon.com Inc", volume: "67.8M", value: "$9.1B" },
  { symbol: "AAPL", name: "Apple Inc", volume: "56.7M", value: "$10.5B" },
  { symbol: "MSFT", name: "Microsoft Corp", volume: "45.6M", value: "$17.3B" },
  { symbol: "NVDA", name: "NVIDIA Corp", volume: "45.2M", value: "$40.3B" }
]

const analystQuotes = [
  {
    analyst: "Sarah Johnson",
    firm: "Goldman Sachs",
    quote: "The market's resilience in the face of economic uncertainty demonstrates strong underlying fundamentals, particularly in the technology sector.",
    time: "2 hours ago"
  },
  {
    analyst: "Michael Chen",
    firm: "Morgan Stanley",
    quote: "We're seeing a rotation into quality names as investors seek stability amid volatile market conditions.",
    time: "3 hours ago"
  },
  {
    analyst: "Emily Rodriguez",
    firm: "JP Morgan",
    quote: "The divergence between growth and value stocks continues to present interesting opportunities for active managers.",
    time: "4 hours ago"
  }
]

const previousSummaries = [
  { date: "2025-07-22", title: "Tech Rally Drives Market Higher", status: "published" },
  { date: "2025-07-21", title: "Mixed Trading as Earnings Season Continues", status: "published" },
  { date: "2025-07-20", title: "Financial Sector Leads Market Gains", status: "published" },
  { date: "2025-07-19", title: "Volatility Returns Amid Economic Data", status: "published" }
]

export default function MarketSummary() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Daily Market Summary</h1>
          <p className="text-muted-foreground">
            Automated daily financial market analysis and insights for July 23, 2025
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Previous Days
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Market Indices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Major Market Indices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {marketIndices.map((index) => (
              <div key={index.symbol} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{index.name}</h3>
                  {index.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <p className="text-2xl font-bold">{index.price}</p>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    index.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {index.change}
                  </span>
                  <span className={`text-sm ${
                    index.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ({index.changePercent})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Data */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Market Breadth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{data.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{data.value}</span>
                    {data.percentage !== '-' && (
                      <Badge variant="secondary" className="text-xs">
                        {data.percentage}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Market Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Bullish Sentiment</h3>
                <p className="text-sm text-green-700">
                  Market showing resilience with 58% of stocks advancing. Technology sector 
                  leading gains with strong institutional buying.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">+0.4%</p>
                  <p className="text-sm text-muted-foreground">Avg. Index Change</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <p className="text-2xl font-bold">4.2B</p>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top/Bottom Performers */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground">{stock.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{stock.price}</TableCell>
                    <TableCell className="text-green-600 font-medium">{stock.change}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{stock.volume}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <TrendingDown className="h-5 w-5" />
              <span>Bottom Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bottomPerformers.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground">{stock.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{stock.price}</TableCell>
                    <TableCell className="text-red-600 font-medium">{stock.change}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{stock.volume}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Most Traded & Analyst Quotes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5" />
              <span>Most Traded Securities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostTraded.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground">{stock.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{stock.volume}</TableCell>
                    <TableCell className="font-medium">{stock.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyst Commentary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analystQuotes.map((quote, index) => (
                <div key={index} className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm mb-2">"{quote.quote}"</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{quote.analyst}, {quote.firm}</span>
                    <span>{quote.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Previous Summaries */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Market Summaries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {previousSummaries.map((summary, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{summary.title}</p>
                    <p className="text-sm text-muted-foreground">{summary.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Published</Badge>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}