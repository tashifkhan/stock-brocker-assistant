import { useEffect, useMemo, useState } from "react";
import {
  Shield,
  Users,
  Server,
  Activity,
  HardDrive,
  Cpu,
  Gauge,
  RefreshCw,
  Settings,
  Send,
  ClipboardList,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  useSystemMetrics,
  useAdminUsers,
  useAdminLogs,
  useAdminSettings,
  useUpdateAdminSettings,
} from "@/hooks/useApi";
import type { SystemMetrics } from "@/lib/api";

type SettingsFormValues = {
  key: string;
  value: string;
};

function formatNumber(value: number | undefined, fractionDigits = 0): string {
  if (value === undefined || Number.isNaN(value)) {
    return "--";
  }
  return value.toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  });
}

function formatTimestamp(value: string | undefined): string {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString();
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const { data: metricsData, isLoading: metricsLoading, error: metricsError } =
    useSystemMetrics();
  const { data: usersData, isLoading: usersLoading, error: usersError } =
    useAdminUsers(25, 0);
  const { data: logsData, isLoading: logsLoading, error: logsError } =
    useAdminLogs(25);
  const { data: settingsData, isLoading: settingsLoading } = useAdminSettings();
  const updateSettings = useUpdateAdminSettings();

  const metrics = metricsData?.metrics as SystemMetrics | undefined;
  const users = usersData?.users ?? [];
  const logs = logsData?.logs ?? [];
  const appSettings = settingsData?.settings ?? {};

  const [customSetting, setCustomSetting] = useState("log_level");
  const [customValue, setCustomValue] = useState("");

  useEffect(() => {
    if (appSettings[customSetting] !== undefined) {
      setCustomValue(String(appSettings[customSetting]));
    }
  }, [appSettings, customSetting]);

  const metricTiles = useMemo(
    () => [
      {
        title: "Active Users",
        value: formatNumber(metrics?.active_users),
        description: "Currently active across the platform",
        icon: Users,
      },
      {
        title: "Total Requests",
        value: formatNumber(metrics?.total_requests),
        description: "Processed API calls",
        icon: Activity,
      },
      {
        title: "Uptime (hrs)",
        value: formatNumber(metrics?.uptime_hours, 1),
        description: "Cumulative service uptime",
        icon: Server,
      },
      {
        title: "Disk Usage",
        value: `${formatNumber(metrics?.disk_usage_percent, 1)}%`,
        description: "Current storage utilisation",
        icon: HardDrive,
      },
    ],
    [metrics]
  );

  const resourceIndicators = useMemo(
    () => [
      {
        name: "Memory",
        value: metrics?.memory_usage_percent ?? 0,
        icon: Gauge,
      },
      {
        name: "CPU",
        value: metrics?.cpu_usage_percent ?? 0,
        icon: Cpu,
      },
    ],
    [metrics]
  );

  const handleSettingSubmit = async () => {
    if (!customSetting) return;
    try {
      await updateSettings.mutateAsync({
        key: customSetting,
        value: customValue,
      });
      toast({
        title: "Settings updated",
        description: `${customSetting} saved successfully`,
      });
    } catch (error) {
      toast({
        title: "Failed to update setting",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span>Admin Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Monitor platform health, manage users, and adjust runtime settings in real time.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {metricsError && (
        <Alert variant="destructive">
          <AlertTitle>System metrics unavailable</AlertTitle>
          <AlertDescription>
            {(metricsError as Error).message || "The backend did not return metrics."}
          </AlertDescription>
        </Alert>
      )}

      {metricsLoading && !metricsError && (
        <p className="text-sm text-muted-foreground">Loading system metrics...</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricTiles.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {metric.description}
                </p>
              </div>
              <metric.icon className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cpu className="h-5 w-5" />
            <span>Resource utilisation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {resourceIndicators.map((indicator) => (
              <div key={indicator.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm font-medium">
                    <indicator.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{indicator.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(indicator.value, 1)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.min(indicator.value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User directory</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usersError ? (
                <Alert variant="destructive">
                  <AlertTitle>Unable to load users</AlertTitle>
                  <AlertDescription>
                    {(usersError as Error).message || "The backend did not return user records."}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                            Loading users...
                          </TableCell>
                        </TableRow>
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                            No users returned by the API.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatTimestamp(user.created_at)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>Recent application logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {logsError ? (
                <Alert variant="destructive">
                  <AlertTitle>Unable to fetch logs</AlertTitle>
                  <AlertDescription>
                    {(logsError as Error).message || "The backend did not return log entries."}
                  </AlertDescription>
                </Alert>
              ) : logsLoading ? (
                <p className="text-sm text-muted-foreground">Loading logs...</p>
              ) : logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No logs available.</p>
              ) : (
                <div className="space-y-3">
                  {logs.map((log, index) => (
                    <div key={`${log.timestamp}-${index}`} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{log.level}</span>
                        <span className="text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm mt-2">{log.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">Source: {log.source}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Runtime settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Current values
                </h3>
                {settingsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading settings...</p>
                ) : Object.keys(appSettings).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No settings returned by the API.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(appSettings).map(([key, value]) => (
                      <div key={key} className="border rounded-lg p-4">
                        <p className="text-xs uppercase text-muted-foreground">{key}</p>
                        <p className="text-sm font-medium">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold">Update setting</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="setting-key">
                      Setting key
                    </label>
                    <Input
                      id="setting-key"
                      value={customSetting}
                      onChange={(event) => setCustomSetting(event.target.value)}
                      placeholder="e.g. log_level"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="setting-value">
                      New value
                    </label>
                    <Input
                      id="setting-value"
                      value={customValue}
                      onChange={(event) => setCustomValue(event.target.value)}
                      placeholder="Enter value"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSettingSubmit}
                  disabled={updateSettings.isPending || !customSetting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {updateSettings.isPending ? "Saving..." : "Save setting"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
