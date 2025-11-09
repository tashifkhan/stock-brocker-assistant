import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PenTool,
  CheckCircle,
  Lightbulb,
  FileText,
  Loader2,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import { useStyleGuide, useEditorialAnalytics } from "@/hooks/useApi";
import { editorialApi, type EditorialSuggestion } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ContentTypeOption = {
  value: string;
  label: string;
};

const contentTypes: ContentTypeOption[] = [
  { value: "article", label: "Market article" },
  { value: "headline", label: "Headline" },
  { value: "summary", label: "Executive summary" },
];

function renderGuidelineValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, nestedValue]) => `${key}: ${nestedValue}`)
      .join("; ");
  }
  return String(value ?? "");
}

export default function Editorial() {
  const { toast } = useToast();
  const { data: styleGuideData, isLoading: styleGuideLoading, error: styleGuideError } =
    useStyleGuide();
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useEditorialAnalytics();

  const [text, setText] = useState(
    "Markets rallied today as investors reacted to stronger-than-expected earnings across the tech sector."
  );
  const [contentType, setContentType] = useState<string>(contentTypes[0]?.value ?? "article");

  const suggestionMutation = useMutation({
    mutationFn: async (payload: { text: string; contentType: string }) =>
      editorialApi.getSuggestions(payload.text, payload.contentType),
    onSuccess: (data) => {
      toast({ title: "Suggestions generated", description: `Received ${data.suggestions.length} ideas.` });
    },
    onError: (error) => {
      toast({
        title: "Unable to generate suggestions",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) {
      toast({
        title: "Add some text first",
        description: "Please provide content for the assistant to review.",
        variant: "destructive",
      });
      return;
    }
    suggestionMutation.mutate({ text, contentType });
  };

  const suggestionData: EditorialSuggestion | undefined = suggestionMutation.data;
  const guidelines = styleGuideData?.guidelines ?? {};
  const analytics = analyticsData?.analytics;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Editorial Assistant</h1>
        <p className="text-muted-foreground">
          Generate actionable suggestions, review house guidelines, and track content performance from a single workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PenTool className="h-5 w-5" />
            <span>Request suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
              <div className="space-y-1">
                <label htmlFor="editorial-text" className="text-sm font-medium">
                  Draft text
                </label>
                <Textarea
                  id="editorial-text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={6}
                  placeholder="Paste content that needs polishing..."
                />
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="content-type" className="text-sm font-medium">
                    Content type
                  </label>
                  <select
                    id="content-type"
                    value={contentType}
                    onChange={(event) => setContentType(event.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {contentTypes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="word-count" className="text-sm font-medium">
                    Word count (optional)
                  </label>
                  <Input
                    id="word-count"
                    value={text.trim() ? String(text.trim().split(/\s+/).length) : ""}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <Button type="submit" disabled={suggestionMutation.isPending} className="w-full md:w-auto">
              {suggestionMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PenTool className="mr-2 h-4 w-4" />
              )}
              {suggestionMutation.isPending ? "Analyzing..." : "Generate suggestions"}
            </Button>
          </form>

          {suggestionMutation.isError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Failed to fetch suggestions</AlertTitle>
              <AlertDescription>
                {suggestionMutation.error instanceof Error
                  ? suggestionMutation.error.message
                  : "Something went wrong calling the editorial service."}
              </AlertDescription>
            </Alert>
          )}

          {suggestionData && suggestionData.suggestions.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                Suggested improvements
              </h3>
              <div className="space-y-2">
                {suggestionData.suggestions.map((suggestion, index) => (
                  <div key={`${suggestion}-${index}`} className="border rounded-lg p-3">
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Original text preserved for reference. Content type analysed: {suggestionData.content_type}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="style" className="space-y-4">
        <TabsList>
          <TabsTrigger value="style">Style guide</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="style">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>House guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {styleGuideError ? (
                <Alert variant="destructive">
                  <AlertTitle>Unable to load style guide</AlertTitle>
                  <AlertDescription>
                    {(styleGuideError as Error).message || "The backend did not return guidelines."}
                  </AlertDescription>
                </Alert>
              ) : styleGuideLoading ? (
                <p className="text-sm text-muted-foreground">Fetching guidelines...</p>
              ) : Object.keys(guidelines).length === 0 ? (
                <p className="text-sm text-muted-foreground">No guidelines were provided by the API.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(guidelines).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-4 space-y-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{key}</p>
                      <p className="text-sm leading-snug">{renderGuidelineValue(value)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>Editorial analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsError ? (
                <Alert variant="destructive">
                  <AlertTitle>Analytics unavailable</AlertTitle>
                  <AlertDescription>
                    {(analyticsError as Error).message || "Analytics endpoint returned an error."}
                  </AlertDescription>
                </Alert>
              ) : analyticsLoading ? (
                <p className="text-sm text-muted-foreground">Loading analytics...</p>
              ) : !analytics ? (
                <p className="text-sm text-muted-foreground">No analytics data available.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total articles tracked</span>
                      <Badge variant="secondary">{analytics.total_articles}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Average engagement: {analytics.average_engagement}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Top topics</span>
                    </div>
                    {analytics.top_topics.length === 0 ? (
                      <p className="text-xs text-muted-foreground mt-2">No trending topics identified.</p>
                    ) : (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {analytics.top_topics.map((topic: string) => (
                          <Badge key={topic} variant="outline">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Readability score</span>
                    </div>
                    <p className="text-xl font-semibold mt-2">{analytics.readability_score}</p>
                    <p className="text-xs text-muted-foreground">Higher scores indicate easier reading experience.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Performance trends</span>
                    </div>
                    {analytics.performance_trends.length === 0 ? (
                      <p className="text-xs text-muted-foreground mt-2">No trend data yet.</p>
                    ) : (
                      <ul className="list-disc pl-5 text-xs mt-2 space-y-1">
                        {analytics.performance_trends.map((trend: string, index: number) => (
                          <li key={index}>{trend}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}