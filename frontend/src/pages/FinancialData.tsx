import { ChangeEvent, useRef, useState } from "react";
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
} from "@/hooks/useApi";
import type { AnalysisResult } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function formatDate(date = new Date()) {
  return new Date(date).toLocaleString();
}

export default function FinancialData() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const uploadMutation = useUploadFinancialDocument();
  const analyzeMutation = useAnalyzeDocument();
  const { toast } = useToast();

  const isProcessing = uploadMutation.isPending || analyzeMutation.isPending;

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
      setAnalysisHistory((prev) => {
        const filtered = prev.filter(
          (item) => item.file_id !== analysisResponse.file_id
        );
        return [analysisResponse, ...filtered];
      });
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

      {currentAnalysis && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Latest Analysis</span>
              </CardTitle>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Processed {formatDate()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-muted/10 p-4">
              <p className="text-sm text-muted-foreground mb-2">
                File: <span className="font-medium text-foreground">{currentAnalysis.filename}</span>
              </p>
              <p className="leading-relaxed text-sm">
                {currentAnalysis.summary ?? "No summary generated for this document."}
              </p>
            </div>

            {currentAnalysis.parameters && (
              <Card className="bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base">Key Parameter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <p className="font-medium text-foreground">Name</p>
                      <p className="text-muted-foreground">
                        {currentAnalysis.parameters.parameter_name}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Importance</p>
                      <p className="text-muted-foreground">
                        {currentAnalysis.parameters.importance}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Definition</p>
                    <p className="text-muted-foreground">
                      {currentAnalysis.parameters.definition}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Interpretation</p>
                    <p className="text-muted-foreground">
                      {currentAnalysis.parameters.interpretation}
                    </p>
                  </div>
                  {currentAnalysis.parameters.benchmark_or_note && (
                    <div>
                      <p className="font-medium text-foreground">Benchmark / Note</p>
                      <p className="text-muted-foreground">
                        {currentAnalysis.parameters.benchmark_or_note}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Analysis History (current session)</CardTitle>
        </CardHeader>
        <CardContent>
          {analysisHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Upload a PDF to see a running history of analyses.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysisHistory.map((analysis) => (
                  <TableRow key={analysis.file_id}>
                    <TableCell className="font-medium">
                      {analysis.filename}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{analysis.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {analysis.summary ? analysis.summary.slice(0, 160) + (analysis.summary.length > 160 ? "…" : "") : "No summary available"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!currentAnalysis && (
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