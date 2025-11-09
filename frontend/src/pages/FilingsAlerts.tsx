import { useMemo, useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Globe,
  RefreshCw,
  ExternalLink,

  Send,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  useIndiaFilings,
  useUSFilings,
  useEmailIndiaFilings,
  useEmailUSFilings,
} from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_COUNT = 10;

type EmailFormState = {
  to: string;
  cc: string;
};

type FilingRecord = {
  title?: string;
  link?: string;
  company?: string;
  date?: string;
  [key: string]: unknown;
};

function normaliseTitle(filing: FilingRecord): string {
  return filing.title || filing.company || "Untitled filing";
}

function normaliseDate(filing: FilingRecord): string | undefined {
  if (!filing.date) {
    return undefined;
  }
  try {
    const parsed = new Date(filing.date);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString();
    }
  } catch (error) {
    return filing.date;
  }
  return filing.date;
}

export default function FilingsAlerts() {
  const { toast } = useToast();
  const [activeRegion, setActiveRegion] = useState<"us" | "india">("us");
  const [emailForm, setEmailForm] = useState<EmailFormState>({ to: "", cc: "" });

  const usQuery = useUSFilings(DEFAULT_COUNT);
  const indiaQuery = useIndiaFilings(DEFAULT_COUNT);
  const sendUsFilings = useEmailUSFilings();
  const sendIndiaFilings = useEmailIndiaFilings();

  const statsCards = useMemo(
    () => [
      {
        title: "US SEC filings",
        value: usQuery.isLoading ? "--" : String(usQuery.data?.count ?? 0),
        description: "Latest entries pulled from the SEC Atom feed",
        icon: Globe,
      },
      {
        title: "India SEBI filings",
        value: indiaQuery.isLoading ? "--" : String(indiaQuery.data?.count ?? 0),
        description: "Most recent disclosures from SEBI",
        icon: Bell,
      },
    ],
    [indiaQuery.data?.count, indiaQuery.isLoading, usQuery.data?.count, usQuery.isLoading]
  );

  const filings: FilingRecord[] = useMemo(() => {
    if (activeRegion === "us") {
      return (usQuery.data?.results as FilingRecord[] | undefined) ?? [];
    }
    return (indiaQuery.data?.results as FilingRecord[] | undefined) ?? [];
  }, [activeRegion, indiaQuery.data?.results, usQuery.data?.results]);

  const activeQuery = activeRegion === "us" ? usQuery : indiaQuery;
  const isSendingEmail = sendUsFilings.isPending || sendIndiaFilings.isPending;

  const handleRefresh = () => {
    void activeQuery.refetch();
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailForm.to.trim()) {
      toast({
        title: "Recipient email required",
        description: "Add an email address before sending the digest.",
        variant: "destructive",
      });
      return;
    }

    const ccList = emailForm.cc
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    try {
      if (activeRegion === "us") {
        await sendUsFilings.mutateAsync({
          to: emailForm.to.trim(),
          cc: ccList.length ? ccList : undefined,
        });
      } else {
        await sendIndiaFilings.mutateAsync({
          to: emailForm.to.trim(),
          cc: ccList.length ? ccList : undefined,
        });
      }

      toast({
        title: "Digest sent",
        description: `Shared ${activeRegion.toUpperCase()} filings with ${emailForm.to.trim()}.`,
      });
      setEmailForm({ to: "", cc: "" });
    } catch (error) {
      toast({
        title: "Failed to send digest",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const renderStateMessage = (region: "us" | "india") => {
    if (activeRegion !== region) {
      return null;
    }

    const query = region === "us" ? usQuery : indiaQuery;
    const regionFilings = filings;

    if (query.isLoading) {
      return <p className="text-sm text-muted-foreground">Loading filings...</p>;
    }
    if (query.error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Unable to fetch filings</AlertTitle>
          <AlertDescription>
            {(query.error as Error).message || "The backend did not return filings."}
          </AlertDescription>
        </Alert>
      );
    }
    if (regionFilings.length === 0) {
      return <p className="text-sm text-muted-foreground">No filings available for this region.</p>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Corporate filings alerts</h1>
        <p className="text-muted-foreground">
          Track regulatory disclosures from US and India markets, refresh data on demand, and email curated digests to your team.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {statsCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold mt-2">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
              </div>
              <card.icon className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeRegion} onValueChange={(value) => setActiveRegion(value as "us" | "india")}>
        <TabsList>
          <TabsTrigger value="us">US Filings</TabsTrigger>
          <TabsTrigger value="india">India Filings</TabsTrigger>
        </TabsList>

        <TabsContent value="us" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>SEC recent filings</span>
              </CardTitle>
              <Button variant="outline" onClick={handleRefresh} disabled={activeQuery.isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh feed
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderStateMessage("us")}
              {activeRegion === "us" && filings.length > 0 && (
                <div className="space-y-3">
                  {filings.map((filing, index) => (
                    <div
                      key={`${filing.link ?? filing.title ?? index}-${index}`}
                      className="border rounded-lg p-4 flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium text-sm">{normaliseTitle(filing)}</p>
                        {filing.link && (
                          <p className="text-xs text-muted-foreground break-all mt-1">{filing.link}</p>
                        )}
                      </div>
                      {filing.link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={filing.link} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="india" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>SEBI recent filings</span>
              </CardTitle>
              <Button variant="outline" onClick={handleRefresh} disabled={activeQuery.isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh feed
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderStateMessage("india")}
              {activeRegion === "india" && filings.length > 0 && (
                <div className="space-y-3">
                  {filings.map((filing, index) => (
                    <div
                      key={`${filing.link ?? filing.title ?? index}-${index}`}
                      className="border rounded-lg p-4 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{normaliseTitle(filing)}</p>
                        {normaliseDate(filing) && (
                          <p className="text-xs text-muted-foreground">Filed: {normaliseDate(filing)}</p>
                        )}
                        {filing.company && (
                          <Badge variant="secondary" className="w-fit text-xs">
                            {filing.company}
                          </Badge>
                        )}
                      </div>
                      {filing.link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={filing.link} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Send filings digest</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={handleEmailSubmit}>
            <div className="md:col-span-1">
              <label htmlFor="email-recipient" className="text-sm font-medium">
                Recipient email
              </label>
              <Input
                id="email-recipient"
                type="email"
                placeholder="analyst@example.com"
                value={emailForm.to}
                onChange={(event) => setEmailForm((prev) => ({ ...prev, to: event.target.value }))}
                required
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="email-cc" className="text-sm font-medium">
                CC (comma separated)
              </label>
              <Input
                id="email-cc"
                placeholder="team@example.com"
                value={emailForm.cc}
                onChange={(event) => setEmailForm((prev) => ({ ...prev, cc: event.target.value }))}
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button type="submit" className="w-full" disabled={isSendingEmail}>
                {isSendingEmail ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {isSendingEmail ? "Sending..." : `Send ${activeRegion.toUpperCase()} digest`}
              </Button>
            </div>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            The digest uses the latest filings returned by the {activeRegion.toUpperCase()} endpoint.
          </p>
        </CardContent>
      </Card>

      {(sendUsFilings.error || sendIndiaFilings.error) && (
        <Alert variant="destructive">
          <AlertTitle>Email delivery failed</AlertTitle>
          <AlertDescription>
            {((sendUsFilings.error || sendIndiaFilings.error) as Error).message ||
              "An error occurred while sending filings via email."}
          </AlertDescription>
        </Alert>
      )}

      {activeQuery.error && !activeQuery.isLoading && (
        <Alert variant="destructive" className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <div>
            <AlertTitle>Realtime feed encountered an error</AlertTitle>
            <AlertDescription>
              {(activeQuery.error as Error).message || "No additional details were provided."}
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
}