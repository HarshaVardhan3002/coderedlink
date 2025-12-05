"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  Link2, Copy, ExternalLink, Trash2, BarChart3, 
  Search, Plus, Check, Loader2, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/Navbar"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  code: z.string().regex(/^[A-Za-z0-9]{0,8}$/, "Code must be 4-8 alphanumeric characters").optional().or(z.literal("")),
})

type UrlFormData = z.infer<typeof urlSchema>

type Link = {
  id: string
  code: string
  targetUrl: string
  totalClicks: number
  createdAt: string
}

export default function HomePage() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; link: Link | null }>({ open: false, link: null })
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
  })

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    setLoading(true)
    setFetchError(false)
    try {
      const res = await fetch("/api/links")
      if (res.ok) {
        const data = await res.json()
        setLinks(data)
      } else {
        setFetchError(true)
        toast.error("Failed to load links")
      }
    } catch (error) {
      setFetchError(true)
      toast.error("Connection error - please check your network")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: UrlFormData) => {
    setCreating(true)
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url, code: data.code || undefined }),
      })
      
      if (res.ok) {
        const newLink = await res.json()
        setLinks([newLink, ...links])
        reset()
        toast.success("Link created successfully!")
        copyToClipboard(newLink.code)
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to create link")
      }
    } catch (error) {
      toast.error("Failed to create link")
    } finally {
      setCreating(false)
    }
  }

  const copyToClipboard = (code: string) => {
    const url = `${window.location.origin}/${code}`
    navigator.clipboard.writeText(url)
    setCopiedCode(code)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const deleteLink = async () => {
    if (!deleteDialog.link) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/links/${deleteDialog.link.code}`, { method: "DELETE" })
      if (res.ok) {
        setLinks(links.filter(l => l.id !== deleteDialog.link!.id))
        toast.success("Link deleted")
      } else {
        toast.error("Failed to delete link")
      }
    } catch (error) {
      toast.error("Failed to delete link")
    } finally {
      setDeleting(false)
      setDeleteDialog({ open: false, link: null })
    }
  }

  const filteredLinks = links.filter(link => 
    link.code.toLowerCase().includes(search.toLowerCase()) ||
    link.targetUrl.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-subtle rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Simple. Fast. Beautiful.</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Shorten your links,
              <br />
              <span className="text-muted-foreground">amplify your reach</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Create short, memorable links in seconds. Track clicks, analyze performance, 
              and share with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* URL Shortener Form */}
      <section className="px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="glass-strong border-0 overflow-hidden">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      {...register("url")}
                      placeholder="Paste your long URL here..."
                      className="h-14 text-lg glass-subtle border-0 focus-visible:ring-1 focus-visible:ring-foreground/20"
                    />
                    {errors.url && (
                      <p className="text-sm text-destructive mt-2">{errors.url.message}</p>
                    )}
                  </div>
                  <div className="md:w-40">
                    <Input
                      {...register("code")}
                      placeholder="Custom code"
                      maxLength={8}
                      className="h-14 text-lg glass-subtle border-0 focus-visible:ring-1 focus-visible:ring-foreground/20"
                    />
                    {errors.code && (
                      <p className="text-sm text-destructive mt-2">{errors.code.message}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={creating}
                    className="h-14 px-8 text-lg font-semibold rounded-xl"
                  >
                    {creating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Shorten
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Links Table */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Recent Links</h2>
                <p className="text-muted-foreground">
                  {links.length} link{links.length !== 1 ? "s" : ""} created
                </p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search links..."
                  className="pl-10 glass-subtle border-0"
                />
              </div>
            </div>

            {/* Links Grid */}
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="glass rounded-2xl h-24 animate-pulse" />
                ))}
              </div>
            ) : fetchError ? (
              <Card className="glass border-0">
                <CardContent className="py-16 text-center">
                  <Link2 className="w-12 h-12 mx-auto text-destructive/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Failed to load links</h3>
                  <p className="text-muted-foreground mb-4">
                    There was a problem connecting to the server
                  </p>
                  <Button onClick={fetchLinks} className="rounded-xl">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredLinks.length === 0 ? (
              <Card className="glass border-0">
                <CardContent className="py-16 text-center">
                  <Link2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No links yet</h3>
                  <p className="text-muted-foreground">
                    {search ? "No links match your search" : "Create your first short link above"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredLinks.map((link, index) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="glass border-0 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-300">
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg font-semibold truncate">
                                  /{link.code}
                                </span>
                                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                  {link.totalClicks} clicks
                                </span>
                              </div>
                              <a 
                                href={link.targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground truncate block transition-colors"
                              >
                                {link.targetUrl}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl"
                                onClick={() => copyToClipboard(link.code)}
                              >
                                {copiedCode === link.code ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                              <a href={`/code/${link.code}`}>
                                <Button variant="ghost" size="icon" className="rounded-xl">
                                  <BarChart3 className="w-4 h-4" />
                                </Button>
                              </a>
                              <a href={link.targetUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="rounded-xl">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </a>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl text-destructive hover:text-destructive"
                                onClick={() => setDeleteDialog({ open: true, link })}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, link: null })}>
        <DialogContent className="glass-strong border-0">
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold">/{deleteDialog.link?.code}</span>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="ghost" 
              onClick={() => setDeleteDialog({ open: false, link: null })}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteLink}
              disabled={deleting}
              className="rounded-xl"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
