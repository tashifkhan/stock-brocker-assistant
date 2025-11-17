import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Upload,
  FileText,
  TrendingUp,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useUploadFinancialDocument,
  useAnalyzeDocument,
  useFinancialAnalysisHistory,
  useGetDocumentAnalysis,
} from "@/hooks/useApi";
import type {
  AnalysisResult,
  EvaluationParameters,
  FinancialAnalysisRecord,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function formatDate(date: string | number | Date = new Date()) {
  return new Date(date).toLocaleString();
}

export default function FinancialData() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const uploadMutation = useUploadFinancialDocument();
  const analyzeMutation = useAnalyzeDocument();
  const historyQuery = useFinancialAnalysisHistory(20);
  const selectedAnalysisQuery = useGetDocumentAnalysis(selectedAnalysisId ?? "");
  const { toast } = useToast();

  const history: FinancialAnalysisRecord[] = historyQuery.data ?? [];
  const activeAnalysis = selectedAnalysisQuery.data ?? currentAnalysis;
  const activeFileId = activeAnalysis?.file_id ?? selectedAnalysisId ?? null;
  const selectedHistoryRecord = activeFileId
    ? history.find((record) => record.file_id === activeFileId)
    : undefined;
  const isProcessing = uploadMutation.isPending || analyzeMutation.isPending;
  const isAnalysisLoading = selectedAnalysisQuery.isFetching && !currentAnalysis;
  const parameterEntries: EvaluationParameters[] = activeAnalysis?.parameters
    ? Array.isArray(activeAnalysis.parameters)
      ? activeAnalysis.parameters
      : [activeAnalysis.parameters]
    : [];
  const shouldShowAnalysisCard = Boolean(activeAnalysis) || isAnalysisLoading;

  const handleHistorySelect = (fileId: string) => {
    setSelectedAnalysisId(fileId);
    setCurrentAnalysis((prev) => (prev?.file_id === fileId ? prev : null));
  };

  useEffect(() => {
    if (!selectedAnalysisId && history.length > 0) {
      setSelectedAnalysisId(history[0].file_id);
    }
  }, [selectedAnalysisId, history]);

  useEffect(() => {
    if (
      selectedAnalysisQuery.data &&
      currentAnalysis?.file_id === selectedAnalysisQuery.data.file_id
    ) {
      setCurrentAnalysis(null);
    }
  }, [selectedAnalysisQuery.data, currentAnalysis]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file ?? null);
    setSelectedFileName(file ? file.name : null);
  };

  const resetFileInput = () => {
    setSelectedFile(null);
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProcessDocument = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please choose a PDF financial document to upload.",
      });
      return;
    }

    try {
      const uploadResponse = await uploadMutation.mutateAsync(selectedFile);
      toast({
        title: "Upload successful",
        description: `${uploadResponse.filename} uploaded. Starting analysis...`,
      });

      const analysisResponse = await analyzeMutation.mutateAsync(
        uploadResponse.file_id
      );

      setCurrentAnalysis(analysisResponse);
      setSelectedAnalysisId(analysisResponse.file_id);
      await historyQuery.refetch();
      toast({
        title: "Analysis ready",
        description: "The financial report summary has been generated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis failed",
        description:
          error instanceof Error ? error.message : "Unable to analyze document.",
      });
    } finally {
      resetFileInput();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Financial Data Analysis</h1>
        <p className="text-muted-foreground">
          Upload financial documents and extract key insights with the analysis service.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload and Analyze Document</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center space-y-4">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-medium">
                Drag and drop a PDF or use the button below
              </p>
              <p className="text-muted-foreground">
                Only PDF documents are supported at the moment.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
                Choose File
              </Button>
              {selectedFileName ? (
                <span className="text-sm text-muted-foreground">
                  Selected: {selectedFileName}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  No file selected
                </span>
              )}
            </div>
            <Button
              className="w-full md:w-auto"
              onClick={handleProcessDocument}
              disabled={isProcessing || !selectedFile}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Upload & Analyze"
              )}
            </Button>
          </div>

          {uploadMutation.isError && (
            <div className="flex items-center space-x-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>
                {uploadMutation.error instanceof Error
                  ? uploadMutation.error.message
                  : "File upload failed."}
              </span>
            </div>
          )}
          {analyzeMutation.isError && (
            <div className="flex items-center space-x-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>
                {analyzeMutation.error instanceof Error
                  ? analyzeMutation.error.message
                  : "Analysis failed."}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {shouldShowAnalysisCard && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Analysis Details</span>
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  {isAnalysisLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3 w-3" />
                  )}
                  {(selectedHistoryRecord?.status ?? activeAnalysis?.status ?? "pending")
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </Badge>
                <span>
                  {selectedHistoryRecord
                    ? `Updated ${formatDate(selectedHistoryRecord.updated_at ?? selectedHistoryRecord.created_at)}`
                    : `Processed ${formatDate()}`}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAnalysisLoading && !activeAnalysis ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading analysis details...
              </div>
            ) : (
              <>
                <div className="rounded-lg border bg-muted/10 p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    File: <span className="font-medium text-foreground">{activeAnalysis?.filename}</span>
                  </p>
                  <p className="leading-relaxed text-sm">
                    {activeAnalysis?.summary ?? "No summary generated for this document."}
                  </p>
                </div>

                {parameterEntries.length > 0 && (
                  <div className="space-y-4">
                    {parameterEntries.map((parameter, index) => (
                      <div
                        key={`${parameter.parameter_name}-${index}`}
                        className="rounded-lg border bg-card/60 p-4 text-sm space-y-3"
                      >
                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <p className="font-medium text-foreground">Name</p>
                            <p className="text-muted-foreground">{parameter.parameter_name}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Importance</p>
                            <p className="text-muted-foreground">{parameter.importance}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Definition</p>
                          <p className="text-muted-foreground">{parameter.definition}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Interpretation</p>
                          <p className="text-muted-foreground">{parameter.interpretation}</p>
                        </div>
                        {parameter.benchmark_or_note && (
                          <div>
                            <p className="font-medium text-foreground">Benchmark / Note</p>
                            <p className="text-muted-foreground">{parameter.benchmark_or_note}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download report
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
        </CardHeader>
        <CardContent>
          {historyQuery.isError ? (
            <p className="text-sm text-destructive">
              {historyQuery.error instanceof Error
                ? historyQuery.error.message
                : "Unable to load analysis history."}
            </p>
          ) : historyQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading analysis history...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Upload a PDF to view your analysis history.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((analysis) => {
                  const isSelected = selectedAnalysisId === analysis.file_id;
                  const updatedAt = analysis.updated_at ?? analysis.created_at;
                  const summary = analysis.summary ?? "No summary available";
                  return (
                    <TableRow
                      key={analysis.file_id}
                      className={`${isSelected ? "bg-muted/50" : ""} cursor-pointer`}
                      onClick={() => handleHistorySelect(analysis.file_id)}
                    >
                      <TableCell className="font-medium">{analysis.filename}</TableCell>
                      <TableCell>
                        <Badge variant={isSelected ? "secondary" : "outline"}>
                          {analysis.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {updatedAt ? formatDate(updatedAt) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {summary.length > 160 ? `${summary.slice(0, 157)}…` : summary}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!shouldShowAnalysisCard && history.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>What to expect from an analysis?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Upload a PDF 10-K, 10-Q or investor presentation to get an AI-generated summary and key parameter interpretation. Results will appear here once the analysis completes.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-4 rounded-lg border bg-muted/20">
                <p className="font-medium text-foreground mb-1">Key highlights</p>
                <p>
                  Revenue trends, profitability metrics, risk commentary and other financial insights are extracted automatically.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/20">
                <p className="font-medium text-foreground mb-1">Compliance ready</p>
                <p>
                  Download the generated summary and parameter notes to accelerate internal reviews and client updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}