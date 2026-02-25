"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import toast from "react-hot-toast";

interface UserProfile {
  name: string;
  email: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProfile(data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This will permanently delete your account and all data.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      window.location.href = "/";
    } catch {
      toast.error("Failed to delete account");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account settings</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input id="email" value={profile.email} disabled className="mt-1" />
              <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
            </div>
            <Button onClick={handleSave} loading={saving}>
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Permanently delete your account and all data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="danger" onClick={handleDeleteAccount} loading={deleting}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
