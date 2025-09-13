"use client"

import { useEffect, useState } from "react"
import type { Submission } from "@/types/team"
import { AdminLayout } from "@/components/admin-layout"
import { TeamCard } from "@/components/team-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Download, ExternalLink, FileText, Code, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SelectedTeamsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchSelectedTeams = async () => {
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch("/api/admin/teams/submissions", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
      } else {
        throw new Error("Failed to fetch submissions")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Team Name", "Idea Title", "Team Size", "Participant Name", "Email", "Phone", "College/Company", "Type", "PPT", "Repository", "Video"].join(
        ",",
      ),
      ...submissions.flatMap((submission) =>
        submission.team.participants.map((participant) => {
          const pptUrl = submission.submission_document_url.find(doc => doc.ppt)?.ppt || ""
          const repoUrl = submission.submission_document_url.find(doc => doc.repo)?.repo || ""
          const videoUrl = submission.submission_document_url.find(doc => doc.video)?.video || ""
          
          return [
            submission.team.team_name,
            submission.team.idea_title,
            submission.team.team_size,
            participant.name,
            participant.email,
            participant.phone,
            participant.college_or_company_name,
            participant.student_or_professional,
            pptUrl,
            repoUrl,
            videoUrl,
          ].join(",")
        }),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `submissions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSelectionChange = (teamId: string, selected: boolean) => {
    if (!selected) {
      setSubmissions((prev) => prev.filter((submission) => submission.team._id !== teamId))
    }
  }

  useEffect(() => {
    fetchSelectedTeams()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Submissions</h1>
            <p className="text-muted-foreground">{submissions.length} submissions received</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {submissions.length > 0 && (
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
            <Button onClick={fetchSelectedTeams} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-6">
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No submissions received yet.</p>
            </div>
          ) : (
            submissions.map((submission) => (
              <div key={submission._id} className="space-y-4">
                {/* Team Card */}
                <TeamCard 
                  team={submission.team} 
                  onSelectionChange={handleSelectionChange}
                  showSelectionButton={true}
                />
                
                {/* Submission Documents Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                      </Badge>
                      <h4 className="font-semibold text-foreground">Submission Documents</h4>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {submission.submission_document_url.map((doc, index) => (
                        <div key={index} className="space-y-2">
                          {doc.ppt && (
                            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">Presentation</p>
                                <a
                                  href={doc.ppt}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate block"
                                >
                                  View PPT
                                  <ExternalLink className="w-3 h-3 inline ml-1" />
                                </a>
                              </div>
                            </div>
                          )}
                          {doc.repo && (
                            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                              <Code className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">Repository</p>
                                <a
                                  href={doc.repo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 truncate block"
                                >
                                  View Code
                                  <ExternalLink className="w-3 h-3 inline ml-1" />
                                </a>
                              </div>
                            </div>
                          )}
                          {doc.video && (
                            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                              <Video className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">Demo Video</p>
                                <a
                                  href={doc.video}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 truncate block"
                                >
                                  Watch Video
                                  <ExternalLink className="w-3 h-3 inline ml-1" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
