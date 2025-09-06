"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface UserProfileProps {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    bio?: string
    plan: string
    surveysCreated: number
    responsesCollected: number
    joinedAt: string
  }
}

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || "",
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (!formData.name.trim()) {
        alert("Name is required")
        return
      }

      if (!formData.email.trim() || !formData.email.includes("@")) {
        alert("Valid email is required")
        return
      }

      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        lastModified: new Date().toISOString(),
      }

      localStorage.setItem(`user_${user.id}`, JSON.stringify(updatedUser))

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsEditing(false)
      setSaveSuccess(true)

      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to save profile:", error)
      alert("Failed to save profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      bio: user.bio || "",
    })
    setIsEditing(false)
  }

  const handleAvatarChange = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const avatarUrl = e.target?.result as string
          localStorage.setItem(`user_${user.id}_avatar`, avatarUrl)
          alert("Avatar updated! (Refresh to see changes)")
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-6">
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            <span className="text-green-800">Profile updated successfully!</span>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your account details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-semibold">{formData.name}</h3>
                <Badge variant="secondary">{user.plan}</Badge>
              </div>
              <p className="text-gray-600">{formData.email}</p>
              <Button variant="outline" size="sm" onClick={handleAvatarChange}>
                Change Avatar
              </Button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Bio</Label>
                <p className="text-sm text-gray-600 mt-1">{formData.bio || "No bio added yet."}</p>
              </div>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{user.surveysCreated}</CardTitle>
            <CardDescription>Surveys Created</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{user.responsesCollected}</CardTitle>
            <CardDescription>Responses Collected</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{new Date(user.joinedAt).toLocaleDateString()}</CardTitle>
            <CardDescription>Member Since</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
