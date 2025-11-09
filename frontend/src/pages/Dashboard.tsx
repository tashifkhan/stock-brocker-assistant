import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
	FileBarChart,
	Loader,
	AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMarketSummaryDaily, useScrapeArticles } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import type { Article } from "@/lib/api";

const quickAccessCards = [
	{
		title: "Financial Data Analysis",
		description:
			"Upload and analyze financial documents with AI-powered insights",
		icon: BarChart3,
		url: "/financial-data",
		color: "bg-blue-50 border-blue-200",
		iconColor: "text-blue-600",
	},
	{
		title: "Editorial Assistant",
		description: "AI-powered writing assistance for Google Docs integration",
		icon: PenTool,
		url: "/editorial",
		color: "bg-green-50 border-green-200",
		iconColor: "text-green-600",
	},
	{
		title: "Broker Report Articles",
		description: "Generate synthesized articles from multiple broker reports",
		icon: FileText,
		url: "/broker-reports",
		color: "bg-purple-50 border-purple-200",
		iconColor: "text-purple-600",
	},
	{
		title: "Market Summary",
		description: "Automated daily financial market summaries and insights",
		icon: TrendingUp,
		url: "/market-summary",
		color: "bg-orange-50 border-orange-200",
		iconColor: "text-orange-600",
	},
	{
		title: "Corporate Filings Alerts",
		description: "Real-time notifications for corporate filing updates",
		icon: Bell,
		url: "/filings-alerts",
		color: "bg-red-50 border-red-200",
		iconColor: "text-red-600",
	},
];

const recentActivity = [
	{
		action: "Market Summary for July 23, 2025 generated",
		time: "2 hours ago",
		type: "success",
	},
	{
		action: "New filing detected for AAPL - Form 10-K",
		time: "4 hours ago",
		type: "alert",
	},
	{
		action: "Financial analysis completed for Q2 Report",
		time: "6 hours ago",
		type: "info",
	},
	{
		action: "Broker report article published: Tech Sector Analysis",
		time: "1 day ago",
		type: "success",
	},
	{
		action: "Editorial suggestions applied to 5 documents",
		time: "1 day ago",
		type: "info",
	},
];

const keyMetrics = [
	{
		title: "Documents Analyzed",
		value: "1,247",
		change: "+12%",
		icon: FileBarChart,
		color: "text-blue-600",
	},
	{
		title: "Articles Generated",
		value: "89",
		change: "+5%",
		icon: FileText,
		color: "text-green-600",
	},
	{
		title: "Active Alerts",
		value: "156",
		change: "+8%",
		icon: Bell,
		color: "text-orange-600",
	},
	{
		title: "Total Users",
		value: "45",
		change: "+3%",
		icon: Users,
		color: "text-purple-600",
	},
];

export default function Dashboard() {
	const navigate = useNavigate();
	const { data: marketSummary, isLoading: marketLoading, error: marketError } = useMarketSummaryDaily();
	const {
		data: articlesData,
		isLoading: articlesLoading,
		error: articlesError,
	} = useScrapeArticles({ count: 5, maxArticles: 12 });

	const recentArticles = (articlesData?.articles ?? []).slice(0, 3) as Article[];

	const formatArticleSource = (link?: string) => {
		if (!link) return "Unknown source";
		try {
			const host = new URL(link).hostname.replace(/^www\./, "");
			return host || "Unknown source";
		} catch (error) {
			return link;
		}
	};

	const formatArticleDate = (value?: string | null) => {
		if (!value) return "";
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) {
			return value;
		}
		return parsed.toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
		});
	};

	// Transform market data for display
	const topGainers = marketSummary?.top_gainers?.slice(0, 3) || [];
	const topLosers = marketSummary?.top_losers?.slice(0, 2) || [];

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
				<p className="text-muted-foreground">
					Here's an overview of your financial AI tools and recent activity.
				</p>
			</div>

			{/* Key Metrics */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{keyMetrics.map((metric) => (
					<Card key={metric.title}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{metric.title}
							</CardTitle>
							<metric.icon className={`h-4 w-4 ${metric.color}`} />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{metric.value}</div>
							<p className="text-xs text-muted-foreground">
								<span className="text-green-600">{metric.change}</span> from
								last month
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
						<Card
							key={card.title}
							className={`${card.color} hover:shadow-md transition-shadow cursor-pointer`}
						>
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

			{/* Market Data and Articles */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Market Summary */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<TrendingUp className="h-5 w-5" />
							<span>Market Overview</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{marketLoading ? (
							<div className="space-y-4">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						) : marketError ? (
							<div className="flex items-center space-x-2 text-red-600 text-sm">
								<AlertCircle className="h-4 w-4" />
								<span>Failed to load market data</span>
							</div>
						) : (
							<div className="space-y-4">
								<div>
									<p className="text-xs text-muted-foreground mb-2">Top Gainers</p>
									<div className="space-y-2">
										{topGainers.map((gainer: any) => (
											<div key={gainer.symbol} className="flex justify-between items-center">
												<span className="text-sm font-medium">{gainer.symbol}</span>
												<Badge className="bg-green-100 text-green-800">
													+{gainer.change_percent.toFixed(2)}%
												</Badge>
											</div>
										))}
									</div>
								</div>
								<div className="pt-2 border-t">
									<p className="text-xs text-muted-foreground mb-2">Top Losers</p>
									<div className="space-y-2">
										{topLosers.map((loser: any) => (
											<div key={loser.symbol} className="flex justify-between items-center">
												<span className="text-sm font-medium">{loser.symbol}</span>
												<Badge className="bg-red-100 text-red-800">
													{loser.change_percent.toFixed(2)}%
												</Badge>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
						<Button variant="outline" className="w-full mt-4">
							View Full Market Data
						</Button>
					</CardContent>
				</Card>

				{/* Recent Articles */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<FileText className="h-5 w-5" />
							<span>Recent Articles</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{articlesLoading ? (
							<div className="space-y-4">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
							</div>
						) : articlesError ? (
							<div className="flex items-center space-x-2 text-red-600 text-sm">
								<AlertCircle className="h-4 w-4" />
								<span>Failed to load articles</span>
							</div>
						) : (
							<div className="space-y-3">
								{recentArticles.map((article, index) => {
									const articleDate = formatArticleDate(article.publish_date);
									return (
										<div key={`${article.link}-${index}`} className="border-b pb-3 last:border-b-0">
											<p className="text-sm font-medium line-clamp-2">
												{article.title || "Untitled article"}
											</p>
											<div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
												<span>{formatArticleSource(article.link)}</span>
												{articleDate && <span>{articleDate}</span>}
											</div>
										</div>
									);
								})}
							</div>
						)}
						<Button variant="outline" className="w-full mt-4" onClick={() => navigate("/broker-reports")}>
							View All Articles
						</Button>
					</CardContent>
				</Card>
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
									<div
										className={`w-2 h-2 rounded-full ${
											activity.type === "success"
												? "bg-green-500"
												: activity.type === "alert"
												? "bg-orange-500"
												: "bg-blue-500"
										}`}
									/>
									<div className="flex-1">
										<p className="text-sm font-medium">{activity.action}</p>
										<p className="text-xs text-muted-foreground">
											{activity.time}
										</p>
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
								<span className="text-sm text-muted-foreground">
									Documents Processed
								</span>
								<Badge variant="secondary">23</Badge>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									New Alerts
								</span>
								<Badge variant="destructive">5</Badge>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									Articles Generated
								</span>
								<Badge variant="default">3</Badge>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									Market Updates
								</span>
								<Badge className="bg-accent text-accent-foreground">1</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
