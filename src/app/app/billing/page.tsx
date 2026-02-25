"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { PLANS } from "@/lib/plans";

interface BillingInfo {
  plan: "FREE" | "PRO";
  status: string;
  currentPeriodEnd: string | null;
  usage: {
    generationsCount: number;
    exportsCount: number;
  };
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const fetchBilling = useCallback(async () => {
    try {
      const res = await fetch("/api/user/billing");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBilling(data);
    } catch {
      toast.error("Failed to load billing info");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      window.history.replaceState({}, "", "/app/billing");
      const syncWithRetry = async (attempts = 0): Promise<void> => {
        const res = await fetch("/api/stripe/sync", { method: "POST" });
        const data = await res.json();
        if (data.synced) {
          await fetchBilling();
          toast.success("Successfully upgraded to Pro!");
        } else if (attempts < 3) {
          toast.loading("Syncing subscription...", { id: "sync" });
          await new Promise((r) => setTimeout(r, 2000));
          toast.dismiss("sync");
          return syncWithRetry(attempts + 1);
        } else {
          toast.error(data.reason || "Could not verify subscription. Try refreshing.");
          await fetchBilling();
        }
      };
      syncWithRetry().catch(() => fetchBilling());
    } else {
      fetchBilling();
    }
  }, [fetchBilling]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create checkout");
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      toast.error("Failed to start checkout");
      setUpgrading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create portal");
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      toast.error("Failed to open billing portal");
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
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your subscription and usage</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Your active subscription</CardDescription>
              </div>
              <Badge variant={billing?.plan === "PRO" ? "info" : "default"}>
                {billing?.plan}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {billing?.plan === "PRO" ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Your Pro plan renews on{" "}
                  {billing.currentPeriodEnd
                    ? new Date(billing.currentPeriodEnd).toLocaleDateString()
                    : "N/A"}
                </p>
                <Button variant="outline" onClick={handleManageBilling}>
                  Manage Billing
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  You&apos;re on the free plan with limited usage.
                </p>
                <Button onClick={handleUpgrade} loading={upgrading}>
                  <Zap className="mr-2 h-4 w-4" />
                  Upgrade to Pro — $19/mo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Generations</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {billing?.usage.generationsCount ?? 0}
                  <span className="text-sm font-normal text-gray-400">
                    {" "}/ {billing?.plan === "PRO" ? "∞" : PLANS.FREE.generationsPerDay}
                  </span>
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Exports</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {billing?.usage.exportsCount ?? 0}
                  <span className="text-sm font-normal text-gray-400">
                    {" "}/ {billing?.plan === "PRO" ? "∞" : PLANS.FREE.exportsPerDay}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {(["FREE", "PRO"] as const).map((planKey) => {
            const plan = PLANS[planKey];
            const isActive = billing?.plan === planKey;
            return (
              <Card key={planKey} className={isActive ? "border-blue-600 ring-1 ring-blue-600" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {isActive && <Badge variant="info">Current</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
