"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { UserProfile } from "@/components/user/UserProfile"
import { FormFlowLogo } from "@/components/ui/logo"

export default function SettingsPage() {
  const [user, setUser] = useState({
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
    bio: "Product manager passionate about user experience and data-driven decisions.",
    plan: "Pro",
    surveysCreated: 0,
    responsesCollected: 0,
    joinedAt: "2025-09-05",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    responseAlerts: true,
    weeklyReports: false,
    marketingEmails: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    shareAnalytics: false,
    allowDataExport: true,
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user_1")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const savedNotifications = localStorage.getItem("user_notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }

    const savedPrivacy = localStorage.getItem("user_privacy")
    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy))
    }

    // Calculate actual survey stats
    let surveysCreated = 0
    let responsesCollected = 0

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("survey_")) {
        try {
          const surveyData = JSON.parse(localStorage.getItem(key) || "{}")
          surveysCreated++
          responsesCollected += surveyData.responses || 0
        } catch (e) {
          console.error("Error parsing survey data:", e)
        }
      }
    }

    setUser((prev) => ({ ...prev, surveysCreated, responsesCollected }))
  }, [])

  const handleNotificationSave = async () => {
    try {
      localStorage.setItem("user_notifications", JSON.stringify(notifications))
      setSaveStatus("Notification preferences saved!")
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error("Failed to save notifications:", error)
      alert("Failed to save notification preferences")
    }
  }

  const handlePrivacySave = async () => {
    try {
      localStorage.setItem("user_privacy", JSON.stringify(privacy))
      setSaveStatus("Privacy settings saved!")
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error("Failed to save privacy settings:", error)
      alert("Failed to save privacy settings")
    }
  }

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert("Please fill in all password fields")
      return
    }

    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match")
      return
    }

    if (passwords.new.length < 8) {
      alert("Password must be at least 8 characters long")
      return
    }

    try {
      // In a real app, this would verify current password and update
      localStorage.setItem("user_password_updated", new Date().toISOString())
      setPasswords({ current: "", new: "", confirm: "" })
      setSaveStatus("Password updated successfully!")
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error("Failed to update password:", error)
      alert("Failed to update password")
    }
  }

  const handleEnable2FA = () => {
    // Simulate 2FA setup
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    alert(`2FA Setup Code: ${code}\n\nIn a real app, this would redirect to 2FA setup with QR code.`)
    localStorage.setItem("user_2fa_enabled", "true")
  }

  const handleUpgradePlan = () => {
    alert(
      "Redirecting to billing portal...\n\nIn a real app, this would integrate with Stripe or similar payment processor.",
    )
  }

  const handleUpdatePayment = () => {
    alert("Opening payment method update...\n\nIn a real app, this would show payment method management interface.")
  }

  const handleDownloadInvoices = () => {
    const invoiceData = {
      user: user.name,
      plan: user.plan,
      amount: "$29.99",
      date: "2025-09-05",
      invoiceNumber: "INV-2025-001",
    }

    const dataStr = JSON.stringify(invoiceData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "invoices.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportData = () => {
    const userData = {
      profile: user,
      notifications,
      privacy,
      surveys: [],
    }

    // Collect all survey data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("survey_")) {
        try {
          const surveyData = JSON.parse(localStorage.getItem(key) || "{}")
          userData.surveys.push(surveyData)
        } catch (e) {
          console.error("Error parsing survey data:", e)
        }
      }
    }

    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `formflow_data_export_${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = () => {
    const confirmation = prompt("Type 'DELETE' to confirm account deletion:")
    if (confirmation === "DELETE") {
      // Clear all user data
      localStorage.clear()
      alert("Account deleted successfully. You will be redirected to the homepage.")
      window.location.href = "/"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">← Dashboard</Button>
              </Link>
              <FormFlowLogo size="sm" />
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold">Account Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {saveStatus && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✅</span>
              <span className="text-green-800">{saveStatus}</span>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <UserProfile user={user} />

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive email notifications for important updates</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="response-alerts">Response Alerts</Label>
                  <p className="text-sm text-gray-600">Get notified when someone responds to your surveys</p>
                </div>
                <Switch
                  id="response-alerts"
                  checked={notifications.responseAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, responseAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-gray-600">Receive weekly summary reports of your survey performance</p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-gray-600">Receive updates about new features and tips</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleNotificationSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Notification Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your privacy and data sharing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visible">Public Profile</Label>
                  <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                </div>
                <Switch
                  id="profile-visible"
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="share-analytics">Share Analytics</Label>
                  <p className="text-sm text-gray-600">Allow anonymous analytics data to improve the platform</p>
                </div>
                <Switch
                  id="share-analytics"
                  checked={privacy.shareAnalytics}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, shareAnalytics: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-data-export">Data Export</Label>
                  <p className="text-sm text-gray-600">Allow data export and backup features</p>
                </div>
                <Switch
                  id="allow-data-export"
                  checked={privacy.allowDataExport}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, allowDataExport: checked })}
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handlePrivacySave} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Privacy Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
              <Button onClick={handlePasswordUpdate} className="bg-blue-600 hover:bg-blue-700 text-white">
                Update Password
              </Button>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                <Button variant="outline" onClick={handleEnable2FA}>
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
              <CardDescription>Manage your subscription and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Current Plan: {user.plan}</h4>
                  <p className="text-sm text-gray-600">Unlimited surveys, advanced analytics, team collaboration</p>
                </div>
                <Button variant="outline" onClick={handleUpgradePlan}>
                  Upgrade Plan
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Billing Information</h4>
                <p className="text-sm text-gray-600">Next billing date: September 15, 2025</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleUpdatePayment}>
                    Update Payment Method
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadInvoices}>
                    Download Invoices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions that affect your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Export Account Data</h4>
                  <p className="text-sm text-gray-600">Download all your surveys and response data</p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  Export Data
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-600">Delete Account</h4>
                  <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
