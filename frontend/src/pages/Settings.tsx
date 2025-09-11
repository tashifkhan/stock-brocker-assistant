import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Upload
} from "lucide-react"

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <span>Settings</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg">JD</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max size of 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Abcd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="abcd.efgh@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+91 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Financial Corp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" defaultValue="Investment Research" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea 
                  id="bio" 
                  className="w-full p-3 border rounded-md resize-none"
                  rows={3}
                  defaultValue="Senior Financial Analyst with 8+ years of experience in investment research and market analysis."
                />
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Button variant="default" size="sm">Enabled</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Button variant="outline" size="sm">Disabled</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Filing Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get notified of new corporate filings</p>
                  </div>
                  <Button variant="default" size="sm">Enabled</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Market Summary</h3>
                    <p className="text-sm text-muted-foreground">Daily market summary notifications</p>
                  </div>
                  <Button variant="default" size="sm">Enabled</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Analysis Complete</h3>
                    <p className="text-sm text-muted-foreground">Document analysis completion alerts</p>
                  </div>
                  <Button variant="default" size="sm">Enabled</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Weekly Digest</h3>
                    <p className="text-sm text-muted-foreground">Weekly summary of platform activity</p>
                  </div>
                  <Button variant="outline" size="sm">Disabled</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Notification Schedule</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" type="time" defaultValue="08:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" type="time" defaultValue="18:00" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Notifications will only be sent during these hours (your local time)
                </p>
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button size="sm">Update Password</Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Setup 2FA</Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Chrome on Windows • New York, NY</p>
                        <p className="text-xs text-muted-foreground">Last active: Now</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>Current</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-muted-foreground">iOS App • New York, NY</p>
                        <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
                      </div>
                      <Button variant="destructive" size="sm">End Session</Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Data & Privacy</h3>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm">Download My Data</Button>
                    <Button variant="destructive" size="sm">Delete Account</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Theme</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <input type="radio" name="theme" id="light" defaultChecked />
                      <Label htmlFor="light">Light</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <input type="radio" name="theme" id="dark" />
                      <Label htmlFor="dark">Dark</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <input type="radio" name="theme" id="system" />
                      <Label htmlFor="system">System</Label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Font Size</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <input type="radio" name="fontSize" id="small" />
                      <Label htmlFor="small">Small</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <input type="radio" name="fontSize" id="medium" defaultChecked />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <input type="radio" name="fontSize" id="large" />
                      <Label htmlFor="large">Large</Label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Sidebar</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Automatically collapse sidebar on smaller screens
                      </p>
                    </div>
                    <Button variant="default" size="sm">Enabled</Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Animations</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Enable interface animations and transitions
                      </p>
                    </div>
                    <Button variant="default" size="sm">Enabled</Button>
                  </div>
                </div>
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Appearance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}