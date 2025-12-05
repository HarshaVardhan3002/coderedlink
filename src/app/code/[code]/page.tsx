"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, ExternalLink, Clock, MousePointer2, Share2, Activity, Globe, Facebook, Twitter, Linkedin, Send } from "lucide-react"
import { toast } from "sonner"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ClickData = {
  id: string
  createdAt: string
}

type LinkData = {
  id: string
  code: string
  targetUrl: string
  totalClicks: number
  lastClickedAt: string | null
  createdAt: string
  clicks: ClickData[]
}

export default function StatsPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  const [link, setLink] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (code) fetchLink()
  }, [code])

  const fetchLink = async () => {
    try {
      const res = await fetch(`/api/links/${code}`)
      if (!res.ok) {
        if (res.status === 404) router.push("/404")
        return
      }
      const data = await res.json()
      setLink(data)
    } catch (error) {
      toast.error("Failed to fetch stats")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${code}`
    navigator.clipboard.writeText(url)
    toast.success("Copied to clipboard!")
  }

  const shareLink = (platform: string) => {
    const url = `${window.location.origin}/${code}`
    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`
        break
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}`
        break
      case "discord":
        navigator.clipboard.writeText(url)
        toast.success("Link copied! Paste it in Discord.")
        return
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer")
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin shadow-[0_0_30px_rgba(var(--primary),0.2)]" />
      </div>
    </div>
  )
  
  if (!link) return null

  // Process real data for visualization
  const processData = () => {
    if (!link.clicks || link.clicks.length === 0) return []

    // Group clicks by date
    const clicksByDate = link.clicks.reduce((acc, click) => {
      const date = new Date(click.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Create array for chart
    const data = Object.entries(clicksByDate).map(([name, clicks]) => ({
      name,
      clicks
    }))

    // Sort by date (simple string sort might not be perfect for all locales but works for 'MMM D')
    // Ideally we'd sort by timestamp, but for this demo:
    return data
  }

  const chartData = processData()

  return (
    <main className="min-h-screen p-4 md:p-12 space-y-8 relative overflow-hidden font-sans bg-background text-foreground">
      {/* Background Orbs - Soft & Diffused */}
      <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-blob mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="hover:bg-white/10 hover:text-primary group text-muted-foreground rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Dashboard
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
          {/* Left Column: Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="glass-strong border-white/10 overflow-hidden relative shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]">/{link.code}</span>
                  <div className="p-3 bg-white/5 rounded-full border border-white/10">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Target URL</label>
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-primary/30 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <span className="truncate text-sm text-white/80 flex-1">{link.targetUrl}</span>
                    <a
                      href={link.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-2 text-primary mb-2 relative z-10">
                      <MousePointer2 className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Hits</span>
                    </div>
                    <p className="text-4xl font-bold text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{link.totalClicks}</p>
                  </div>
                  
                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-2 text-primary mb-2 relative z-10">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Last Active</span>
                    </div>
                    <p className="text-sm font-medium text-white/90 mt-1 relative z-10">
                      {link.lastClickedAt
                        ? new Date(link.lastClickedAt).toLocaleDateString()
                        : "Never"}
                    </p>
                    <p className="text-xs text-muted-foreground relative z-10">
                      {link.lastClickedAt
                        ? new Date(link.lastClickedAt).toLocaleTimeString()
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={copyToClipboard}
                    className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all duration-300"
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy Link
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-12 w-12 rounded-xl border-white/10 hover:bg-white/10 hover:text-primary text-white p-0"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-black/80 backdrop-blur-xl border-white/10 text-white rounded-xl">
                      <DropdownMenuItem onClick={() => shareLink('facebook')} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        <Facebook className="mr-2 h-4 w-4" /> Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => shareLink('whatsapp')} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        <Send className="mr-2 h-4 w-4" /> WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => shareLink('telegram')} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        <Send className="mr-2 h-4 w-4" /> Telegram
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => shareLink('discord')} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        <MessageCircle className="mr-2 h-4 w-4" /> Discord
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full min-h-[400px]"
          >
            <Card className="glass-strong border-white/10 rounded-3xl h-full flex flex-col shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span className="text-xl font-bold text-white tracking-tight">Traffic Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-[300px] p-6">
                <div className="w-full h-[300px]">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                          dataKey="name"
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0,0,0,0.8)",
                            backdropFilter: "blur(10px)",
                            borderColor: "rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                            color: "#fff"
                          }}
                          itemStyle={{ color: "var(--primary)" }}
                          cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "5 5" }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="clicks" 
                          stroke="var(--primary)" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorClicks)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Activity className="w-12 h-12 mb-4 opacity-20" />
                      <p>No traffic data available yet.</p>
                      <p className="text-sm opacity-50">Share your link to start tracking.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

function MessageCircle(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
    )
  }
