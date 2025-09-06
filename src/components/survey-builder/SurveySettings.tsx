"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface SurveySettingsProps {
  settings: {
    collectEmail: boolean
    requireSignIn: boolean
    limitResponses: boolean
    maxResponses: number
    allowResponseEditing: boolean
    showProgressBar: boolean
    shuffleQuestions: boolean
    confirmationMessage: string
    redirectUrl: string
    acceptingResponses: boolean
    responseDeadline: string | null
    allowAnonymous: boolean
    showSummaryChart: boolean
    emailNotifications: boolean
    notificationEmail: string
  }
  onSettingsChange: (settings: any) => void
  onSave?: () => void // Added optional save callback
}

export function SurveySettings({ settings, onSettingsChange, onSave }: SurveySettingsProps) {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const handleSave = () => {
    if (onSave) {
      onSave()
    } else {
      // Fallback save functionality
      console.log("Settings saved:", settings)
      alert("Settings saved successfully!")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Survey Settings</h1>
        <p className="text-gray-600">Configure how your survey behaves and collects responses</p>
      </div>

      {/* Response Collection */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Response Collection</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="accepting-responses">Accepting responses</Label>
              <p className="text-sm text-gray-600">Allow new responses to be submitted</p>
            </div>
            <Switch
              id="accepting-responses"
              checked={settings.acceptingResponses}
              onCheckedChange={(checked) => updateSetting("acceptingResponses", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="collect-email">Collect email addresses</Label>
              <p className="text-sm text-gray-600">Require respondents to provide their email</p>
            </div>
            <Switch
              id="collect-email"
              checked={settings.collectEmail}
              onCheckedChange={(checked) => updateSetting("collectEmail", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require-signin">Require sign-in</Label>
              <p className="text-sm text-gray-600">Only signed-in users can respond</p>
            </div>
            <Switch
              id="require-signin"
              checked={settings.requireSignIn}
              onCheckedChange={(checked) => updateSetting("requireSignIn", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-anonymous">Allow anonymous responses</Label>
              <p className="text-sm text-gray-600">Don't collect identifying information</p>
            </div>
            <Switch
              id="allow-anonymous"
              checked={settings.allowAnonymous}
              onCheckedChange={(checked) => updateSetting("allowAnonymous", checked)}
            />
          </div>
        </div>
      </Card>

      {/* Response Limits */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Response Limits</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="limit-responses">Limit number of responses</Label>
              <p className="text-sm text-gray-600">Stop accepting responses after a certain number</p>
            </div>
            <Switch
              id="limit-responses"
              checked={settings.limitResponses}
              onCheckedChange={(checked) => updateSetting("limitResponses", checked)}
            />
          </div>

          {settings.limitResponses && (
            <div>
              <Label htmlFor="max-responses">Maximum responses</Label>
              <Input
                id="max-responses"
                type="number"
                value={settings.maxResponses}
                onChange={(e) => updateSetting("maxResponses", Number.parseInt(e.target.value) || 100)}
                className="w-32"
              />
            </div>
          )}

          <div>
            <Label htmlFor="response-deadline">Response deadline</Label>
            <Input
              id="response-deadline"
              type="datetime-local"
              value={settings.responseDeadline || ""}
              onChange={(e) => updateSetting("responseDeadline", e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Presentation */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Presentation</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-progress">Show progress bar</Label>
              <p className="text-sm text-gray-600">Display completion progress to respondents</p>
            </div>
            <Switch
              id="show-progress"
              checked={settings.showProgressBar}
              onCheckedChange={(checked) => updateSetting("showProgressBar", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="shuffle-questions">Shuffle question order</Label>
              <p className="text-sm text-gray-600">Randomize the order of questions</p>
            </div>
            <Switch
              id="shuffle-questions"
              checked={settings.shuffleQuestions}
              onCheckedChange={(checked) => updateSetting("shuffleQuestions", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-summary">Show summary chart to respondents</Label>
              <p className="text-sm text-gray-600">Display response summary after submission</p>
            </div>
            <Switch
              id="show-summary"
              checked={settings.showSummaryChart}
              onCheckedChange={(checked) => updateSetting("showSummaryChart", checked)}
            />
          </div>
        </div>
      </Card>

      {/* After Submission */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">After Submission</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-editing">Allow response editing</Label>
              <p className="text-sm text-gray-600">Let respondents edit their responses</p>
            </div>
            <Switch
              id="allow-editing"
              checked={settings.allowResponseEditing}
              onCheckedChange={(checked) => updateSetting("allowResponseEditing", checked)}
            />
          </div>

          <div>
            <Label htmlFor="confirmation-message">Confirmation message</Label>
            <Textarea
              id="confirmation-message"
              value={settings.confirmationMessage}
              onChange={(e) => updateSetting("confirmationMessage", e.target.value)}
              placeholder="Thank you for your response!"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="redirect-url">Redirect URL (optional)</Label>
            <Input
              id="redirect-url"
              type="url"
              value={settings.redirectUrl}
              onChange={(e) => updateSetting("redirectUrl", e.target.value)}
              placeholder="https://example.com/thank-you"
            />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email notifications</Label>
              <p className="text-sm text-gray-600">Get notified when someone responds</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>

          {settings.emailNotifications && (
            <div>
              <Label htmlFor="notification-email">Notification email</Label>
              <Input
                id="notification-email"
                type="email"
                value={settings.notificationEmail}
                onChange={(e) => updateSetting("notificationEmail", e.target.value)}
                placeholder="your-email@example.com"
              />
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
          💾 Save Settings
        </Button>
      </div>
    </div>
  )
}
