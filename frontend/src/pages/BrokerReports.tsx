import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
	CheckCircle,
	Globe,
	Search,
	Filter,
	ExternalLink,
	AlertCircle,
	RefreshCw,
} from "lucide-react";

const dataSourcesConfig = [
	{
		id: 1,
		name: "Yahoo Finance",
		url: "finance.yahoo.com",
		type: "Financial Data",
		status: "active",
		lastUpdate: "5 minutes ago",
		dataPoints: ["Stock Prices", "Market News", "Analyst Ratings"],
	},
	{
		id: 2,
		name: "Bloomberg",
		url: "bloomberg.com",
		type: "Market News",
		status: "active",
		lastUpdate: "10 minutes ago",
		dataPoints: ["Breaking News", "Market Analysis", "Economic Data"],
	},
	{
		id: 3,
		name: "SEC EDGAR",
		url: "sec.gov/edgar",
		type: "Regulatory Filings",
		status: "active",
		lastUpdate: "30 minutes ago",
		dataPoints: ["10-K Reports", "10-Q Reports", "8-K Filings"],
	},
	{
		id: 4,
		name: "MarketWatch",
		url: "marketwatch.com",
		type: "Market Analysis",
		status: "active",
		lastUpdate: "15 minutes ago",
		dataPoints: ["Market Commentary", "Sector Analysis", "Earnings Reports"],
	},
	{
		id: 5,
		name: "Reuters",
		url: "reuters.com",
		type: "News & Analysis",
		status: "inactive",
		lastUpdate: "2 hours ago",
		dataPoints: ["Breaking News", "Company Updates", "Market Trends"],
	},
];

const extractedReports = [
	{
		id: 1,
		company: "Apple Inc. (AAPL)",
		source: "Yahoo Finance",
		title: "Apple Reports Strong Q3 Earnings, Services Revenue Jumps 15%",
		extractedAt: "2 hours ago",
		sentiment: "positive",
		keyMetrics: {
			revenue: "$81.8B",
			eps: "$1.26",
			guidance: "Optimistic",
		},
		url: "https://finance.yahoo.com/news/apple-earnings-q3-2025",
		status: "processed",
	},
	{
		id: 2,
		company: "Apple Inc. (AAPL)",
		source: "Bloomberg",
		title: "Apple's AI Push Faces China Regulatory Hurdles",
		extractedAt: "3 hours ago",
		sentiment: "negative",
		keyMetrics: {
			marketShare: "18% (China)",
			impact: "Medium",
			timeline: "Q4 2025",
		},
		url: "https://bloomberg.com/news/apple-china-ai-regulation",
		status: "processed",
	},
	{
		id: 3,
		company: "Apple Inc. (AAPL)",
		source: "SEC EDGAR",
		title: "Form 10-Q: Quarterly Report - Q3 2025",
		extractedAt: "1 hour ago",
		sentiment: "neutral",
		keyMetrics: {
			cashPosition: "$162.1B",
			debt: "$104.5B",
			capex: "$7.2B",
		},
		url: "https://sec.gov/edgar/data/320193/000032019325000087",
		status: "processed",
	},
	{
		id: 4,
		company: "Apple Inc. (AAPL)",
		source: "MarketWatch",
		title: "Analyst Upgrades Apple on Strong iPhone 16 Pre-Orders",
		extractedAt: "4 hours ago",
		sentiment: "positive",
		keyMetrics: {
			preOrders: "+25% YoY",
			priceTarget: "$210",
			rating: "Buy",
		},
		url: "https://marketwatch.com/story/apple-iphone-16-preorders",
		status: "processed",
	},
];

const synthesizedReports = [
	{
		id: 1,
		title: "Apple Inc. Comprehensive Analysis: Q3 Earnings & Market Position",
		sources: 4,
		dateCreated: "2025-07-23",
		status: "generated",
		confidence: "high",
		sentiment: "positive",
		keyPoints: [
			"Strong Q3 earnings with 15% services growth",
			"China regulatory challenges for AI features",
			"Positive analyst sentiment on iPhone 16 pre-orders",
		],
	},
	{
		id: 2,
		title: "Tesla Inc. Market Dynamics: Production & Regulatory Updates",
		sources: 3,
		dateCreated: "2025-07-22",
		status: "draft",
		confidence: "medium",
		sentiment: "neutral",
		keyPoints: [
			"Q3 production targets met ahead of schedule",
			"FSD regulatory approval pending in Europe",
			"Energy storage business showing strong growth",
		],
	},
];

export default function BrokerReports() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold text-foreground">
					Intelligent Report Synthesis
				</h1>
				<p className="text-muted-foreground">
					Automatically extract and synthesize information from multiple web
					sources to generate comprehensive financial reports.
				</p>
			</div>

			{/* Data Sources Configuration */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Globe className="h-5 w-5" />
						<span>Data Source Configuration</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<p className="text-sm text-muted-foreground">
								Configure and monitor data sources for automatic information
								extraction
							</p>
							<Button variant="outline" size="sm">
								<RefreshCw className="h-4 w-4 mr-1" />
								Refresh All
							</Button>
						</div>

						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{dataSourcesConfig.map((source) => (
								<div
									key={source.id}
									className="p-4 border rounded-lg space-y-3"
								>
									<div className="flex items-start justify-between">
										<div>
											<h3 className="font-medium">{source.name}</h3>
											<p className="text-sm text-muted-foreground">
												{source.url}
											</p>
										</div>
										<Badge
											variant={
												source.status === "active" ? "default" : "secondary"
											}
										>
											{source.status}
										</Badge>
									</div>

									<div className="space-y-2">
										<div className="flex items-center justify-between text-xs">
											<span className="text-muted-foreground">
												Last Updated:
											</span>
											<span>{source.lastUpdate}</span>
										</div>
										<div>
											<p className="text-xs text-muted-foreground mb-1">
												Data Points:
											</p>
											<div className="flex flex-wrap gap-1">
												{source.dataPoints.map((point, idx) => (
													<Badge
														key={idx}
														variant="outline"
														className="text-xs"
													>
														{point}
													</Badge>
												))}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Search & Extract Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Search className="h-5 w-5" />
						<span>Extract Information</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex space-x-2">
							<div className="flex-1">
								<input
									type="text"
									placeholder="Enter company ticker or name (e.g., AAPL, Apple Inc.)"
									className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
									defaultValue="AAPL"
								/>
							</div>
							<Button>
								<Search className="h-4 w-4 mr-1" />
								Extract Reports
							</Button>
						</div>

						<div className="flex items-center space-x-4 text-sm text-muted-foreground">
							<div className="flex items-center space-x-1">
								<Filter className="h-4 w-4" />
								<span>Time Range: Last 24 hours</span>
							</div>
							<div className="flex items-center space-x-1">
								<Globe className="h-4 w-4" />
								<span>Sources: 5 active</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Extracted Reports */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<FileText className="h-5 w-5" />
							<span>Extracted Reports</span>
						</div>
						<Badge variant="secondary">
							{extractedReports.length} reports found
						</Badge>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{extractedReports.map((report) => (
							<div key={report.id} className="p-4 border rounded-lg space-y-3">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center space-x-2 mb-1">
											<h3 className="font-medium text-sm">{report.title}</h3>
											<ExternalLink className="h-3 w-3 text-muted-foreground" />
										</div>
										<div className="flex items-center space-x-4 text-xs text-muted-foreground">
											<span>{report.source}</span>
											<span>•</span>
											<span>{report.extractedAt}</span>
											<span>•</span>
											<span>{report.company}</span>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<Badge
											variant={
												report.sentiment === "positive"
													? "default"
													: report.sentiment === "negative"
													? "destructive"
													: "secondary"
											}
										>
											{report.sentiment === "positive" && (
												<TrendingUp className="h-3 w-3 mr-1" />
											)}
											{report.sentiment === "negative" && (
												<TrendingDown className="h-3 w-3 mr-1" />
											)}
											{report.sentiment === "neutral" && (
												<Minus className="h-3 w-3 mr-1" />
											)}
											{report.sentiment}
										</Badge>
										<Badge variant="outline">{report.status}</Badge>
									</div>
								</div>

								<div className="grid gap-2 md:grid-cols-3">
									{Object.entries(report.keyMetrics).map(([key, value]) => (
										<div
											key={key}
											className="text-center p-2 bg-muted/20 rounded"
										>
											<p className="text-xs text-muted-foreground capitalize">
												{key}
											</p>
											<p className="font-medium text-sm">{value}</p>
										</div>
									))}
								</div>
							</div>
						))}

						<div className="flex justify-center mt-6">
							<Button className="bg-accent text-accent-foreground">
								<FileText className="h-4 w-4 mr-1" />
								Synthesize All Reports
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Synthesized Reports */}
			<Card>
				<CardHeader>
					<CardTitle>Synthesized Reports</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{synthesizedReports.map((report) => (
							<div
								key={report.id}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div className="flex items-center space-x-4">
									<FileText className="h-8 w-8 text-primary" />
									<div>
										<h3 className="font-medium">{report.title}</h3>
										<div className="flex items-center space-x-4 text-sm text-muted-foreground">
											<span>{report.sources} sources</span>
											<span>•</span>
											<span>{report.dateCreated}</span>
											<span>•</span>
											<span>{report.confidence} confidence</span>
										</div>
										<div className="mt-1">
											{report.keyPoints.slice(0, 2).map((point, idx) => (
												<p key={idx} className="text-xs text-muted-foreground">
													• {point}
												</p>
											))}
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-4">
									<Badge
										variant={
											report.sentiment === "positive"
												? "default"
												: report.sentiment === "negative"
												? "destructive"
												: "secondary"
										}
									>
										{report.sentiment === "positive" && (
											<TrendingUp className="h-3 w-3 mr-1" />
										)}
										{report.sentiment === "negative" && (
											<TrendingDown className="h-3 w-3 mr-1" />
										)}
										{report.sentiment === "neutral" && (
											<Minus className="h-3 w-3 mr-1" />
										)}
										{report.sentiment}
									</Badge>
									{report.status === "generated" ? (
										<Badge className="bg-success text-success-foreground">
											<CheckCircle className="h-3 w-3 mr-1" />
											Generated
										</Badge>
									) : (
										<Badge variant="secondary">
											<Clock className="h-3 w-3 mr-1" />
											Draft
										</Badge>
									)}
									<Button variant="outline" size="sm">
										<Edit className="h-4 w-4 mr-1" />
										View
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Sample Synthesized Report View */}
			<Card>
				<CardHeader>
					<CardTitle>Sample Synthesized Report - Apple Inc. Analysis</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="summary" className="space-y-4">
						<TabsList>
							<TabsTrigger value="summary">Executive Summary</TabsTrigger>
							<TabsTrigger value="sources">Source Analysis</TabsTrigger>
							<TabsTrigger value="metrics">Key Metrics</TabsTrigger>
							<TabsTrigger value="timeline">Timeline View</TabsTrigger>
						</TabsList>

						<TabsContent value="summary">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<Badge variant="default">Auto-Generated</Badge>
										<Badge variant="outline">High Confidence</Badge>
									</div>
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

								<div className="p-4 bg-muted/20 rounded-lg">
									<h3 className="font-medium mb-2">Synthesis Summary</h3>
									<p className="text-sm text-muted-foreground mb-4">
										Based on 4 sources extracted in the last 4 hours, here's the
										comprehensive analysis:
									</p>

									<div className="space-y-3">
										<div className="flex items-start space-x-3">
											<div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
											<div>
												<p className="font-medium text-sm">
													Strong Q3 Financial Performance
												</p>
												<p className="text-xs text-muted-foreground">
													Apple reported Q3 earnings with $81.8B revenue and
													$1.26 EPS, exceeding analyst expectations. Services
													revenue showed particular strength with 15% YoY
													growth.
												</p>
											</div>
										</div>

										<div className="flex items-start space-x-3">
											<div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
											<div>
												<p className="font-medium text-sm">
													China Regulatory Challenges
												</p>
												<p className="text-xs text-muted-foreground">
													AI feature rollout facing regulatory hurdles in China,
													potentially impacting 18% market share in the region
													with medium-term implications for Q4 2025.
												</p>
											</div>
										</div>

										<div className="flex items-start space-x-3">
											<div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
											<div>
												<p className="font-medium text-sm">
													iPhone 16 Strong Pre-Order Performance
												</p>
												<p className="text-xs text-muted-foreground">
													iPhone 16 pre-orders showing 25% YoY increase, leading
													to analyst upgrades and $210 price target from
													MarketWatch coverage.
												</p>
											</div>
										</div>

										<div className="flex items-start space-x-3">
											<div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
											<div>
												<p className="font-medium text-sm">
													Strong Balance Sheet Position
												</p>
												<p className="text-xs text-muted-foreground">
													Latest 10-Q filing shows $162.1B cash position with
													$104.5B debt and $7.2B capex, indicating healthy
													financial foundation.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="sources">
							<Card>
								<CardHeader>
									<CardTitle>Source Reliability & Coverage</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{extractedReports.map((report) => (
											<div
												key={report.id}
												className="flex items-center justify-between p-3 border rounded-lg"
											>
												<div className="flex items-center space-x-3">
													<div
														className={`w-3 h-3 rounded-full ${
															report.source === "SEC EDGAR"
																? "bg-blue-500"
																: report.source === "Yahoo Finance"
																? "bg-purple-500"
																: report.source === "Bloomberg"
																? "bg-orange-500"
																: "bg-green-500"
														}`}
													/>
													<div>
														<p className="font-medium text-sm">
															{report.source}
														</p>
														<p className="text-xs text-muted-foreground">
															{report.title}
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													<Badge variant="outline" className="text-xs">
														{report.source === "SEC EDGAR"
															? "Official"
															: report.source === "Bloomberg"
															? "Premium"
															: "Public"}
													</Badge>
													<span className="text-xs text-muted-foreground">
														{report.extractedAt}
													</span>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="metrics">
							<Card>
								<CardHeader>
									<CardTitle>Aggregated Key Metrics</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
										<div className="text-center p-4 bg-muted/20 rounded-lg">
											<p className="text-2xl font-bold text-green-600">
												$81.8B
											</p>
											<p className="text-sm text-muted-foreground">
												Q3 Revenue
											</p>
											<p className="text-xs text-muted-foreground">
												Yahoo Finance
											</p>
										</div>
										<div className="text-center p-4 bg-muted/20 rounded-lg">
											<p className="text-2xl font-bold">$1.26</p>
											<p className="text-sm text-muted-foreground">EPS</p>
											<p className="text-xs text-muted-foreground">
												SEC Filing
											</p>
										</div>
										<div className="text-center p-4 bg-muted/20 rounded-lg">
											<p className="text-2xl font-bold text-green-600">+25%</p>
											<p className="text-sm text-muted-foreground">
												Pre-Orders YoY
											</p>
											<p className="text-xs text-muted-foreground">
												MarketWatch
											</p>
										</div>
										<div className="text-center p-4 bg-muted/20 rounded-lg">
											<p className="text-2xl font-bold">$162.1B</p>
											<p className="text-sm text-muted-foreground">
												Cash Position
											</p>
											<p className="text-xs text-muted-foreground">
												10-Q Filing
											</p>
										</div>
									</div>

									<div className="mt-6 p-4 bg-muted/20 rounded-lg">
										<h4 className="font-medium mb-3">Sentiment Analysis</h4>
										<div className="space-y-2">
											<div className="flex items-center justify-between text-sm">
												<span>Overall Sentiment: Positive</span>
												<span>Confidence: 85%</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className="bg-green-500 h-2 rounded-full"
													style={{ width: "75%" }}
												></div>
											</div>
											<div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
												<span>2 Positive</span>
												<span>1 Negative</span>
												<span>1 Neutral</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="timeline">
							<Card>
								<CardHeader>
									<CardTitle>Information Timeline</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="relative">
											<div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

											<div className="space-y-6">
												<div className="flex items-start space-x-4">
													<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
														1h
													</div>
													<div className="flex-1">
														<div className="flex items-center justify-between">
															<h4 className="font-medium text-sm">
																SEC 10-Q Filing Released
															</h4>
															<span className="text-xs text-muted-foreground">
																SEC EDGAR
															</span>
														</div>
														<p className="text-xs text-muted-foreground mt-1">
															Official quarterly financial data showing strong
															cash position and operational metrics
														</p>
													</div>
												</div>

												<div className="flex items-start space-x-4">
													<div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium">
														2h
													</div>
													<div className="flex-1">
														<div className="flex items-center justify-between">
															<h4 className="font-medium text-sm">
																Strong Q3 Earnings Report
															</h4>
															<span className="text-xs text-muted-foreground">
																Yahoo Finance
															</span>
														</div>
														<p className="text-xs text-muted-foreground mt-1">
															Earnings beat expectations with services revenue
															showing 15% growth
														</p>
													</div>
												</div>

												<div className="flex items-start space-x-4">
													<div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-medium">
														3h
													</div>
													<div className="flex-1">
														<div className="flex items-center justify-between">
															<h4 className="font-medium text-sm">
																China AI Regulatory Concerns
															</h4>
															<span className="text-xs text-muted-foreground">
																Bloomberg
															</span>
														</div>
														<p className="text-xs text-muted-foreground mt-1">
															AI features facing regulatory hurdles in China
															market
														</p>
													</div>
												</div>

												<div className="flex items-start space-x-4">
													<div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium">
														4h
													</div>
													<div className="flex-1">
														<div className="flex items-center justify-between">
															<h4 className="font-medium text-sm">
																iPhone 16 Pre-Order Success
															</h4>
															<span className="text-xs text-muted-foreground">
																MarketWatch
															</span>
														</div>
														<p className="text-xs text-muted-foreground mt-1">
															25% YoY increase in pre-orders leading to analyst
															upgrades
														</p>
													</div>
												</div>
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
	);
}
