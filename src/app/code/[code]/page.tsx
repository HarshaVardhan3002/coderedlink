"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowLeft, Copy, Check, ExternalLink, RefreshCw, 
  MousePointer2, Clock, Globe, TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/Navbar"
import { toast } from "sonner"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"

type Click = {
  id: string
  ipAddress: string | null
  userAgent: string | null
  referer: string | null
  createdAt: string
}

type LinkData = {
  id: string
  code: string
  targetUrl: string
  totalClicks: number
  lastClickedAt: string | null
  createdAt: string
  clicks: Click[]
}

export default function StatsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [link, setLink] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchLinkData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const res = await fetch(`/api/links/${code}`)
      if (res.ok) {
        const data = await res.json()
        setLink(data)
        setLastUpdate(new Date())
        setError(null)
      } else if (res.status === 404) {
        setError("Link not found")
      } else {
        setError("Failed to load link data")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLinkData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchLinkData(true), 30000)
    return () => clearInterval(interval)
  }, [code])

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${code}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Link copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  // Process click data for chart
  const getChartData = () => {
    if (!link?.clicks) return []
    const clicksByDay: Record<string, number> = {}
    
    link.clicks.forEach(click => {
      const date = new Date(click.createdAt).toLocaleDateString()
      clicksByDay[date] = (clicksByDay[date] || 0) + 1
    })

    return Object.entries(clicksByDay)
      .map(([date, clicks]) => ({ date, clicks }))
      .slice(-7) // Last 7 days
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-28 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-48 bg-muted rounded" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass rounded-2xl h-28" />
                ))}
              </div>
              <div className="glass rounded-2xl h-64" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !link) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-28 px-4">
          <div className="max-w-xl mx-auto text-center">
            <Card className="glass border-0">
              <CardContent className="py-16">
                <h2 className="text-2xl font-bold mb-2">Link Not Found</h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Link href="/">
                  <Button className="rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  const chartData = getChartData()
  const uniqueIPs = new Set(link.clicks.map(c => c.ipAddress).filter(Boolean)).size

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link href="/">
              <Button variant="ghost" className="rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">/{code}</h1>
                <a 
                  href={link.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {link.targetUrl.length > 50 ? `${link.targetUrl.substring(0, 50)}...` : link.targetUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  Copy Link
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => fetchLinkData(true)}
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <MousePointer2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{link.totalClicks}</p>
                    <p className="text-sm text-muted-foreground">Total Clicks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-500/10">
                    <Globe className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{uniqueIPs}</p>
                    <p className="text-sm text-muted-foreground">Unique Visitors</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {link.lastClickedAt 
                        ? new Date(link.lastClickedAt).toLocaleDateString()
                        : "Never"
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">Last Click</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/10">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Created</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Click Activity (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "none",
                            borderRadius: "12px"
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="clicks" 
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No click data yet
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
