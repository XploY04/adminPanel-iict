"use client"

import { useEffect, useState } from "react"
import type { Team } from "@/types/team"
import { AdminLayout } from "@/components/admin-layout"
import { TeamCard } from "@/components/team-card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SelectedTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchSelectedTeams = async () => {
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch("/api/admin/teams/selected", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setTeams(data.teams)
      } else {
        throw new Error("Failed to fetch selected teams")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load selected teams",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Team Name", "Idea Title", "Team Size", "Participant Name", "Email", "Phone", "College/Company", "Type"].join(
        ",",
      ),
      ...teams.flatMap((team) =>
        team.participants.map((participant) =>
          [
            team.team_name,
            team.idea_title,
            team.team_size,
            participant.name,
            participant.email,
            participant.phone,
            participant.college_or_company_name,
            participant.student_or_professional,
          ].join(","),
        ),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `selected-teams-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSelectionChange = (teamId: string, selected: boolean) => {
    if (!selected) {
      setTeams((prev) => prev.filter((team) => team._id !== teamId))
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Selected Teams</h1>
            <p className="text-gray-600">{teams.length} teams selected for finals</p>
          </div>
          <div className="flex gap-2">
            {teams.length > 0 && (
              <Button onClick={exportToCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
            <Button onClick={fetchSelectedTeams} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Selected Teams List */}
        <div className="space-y-4">
          {teams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No teams selected for finals yet.</p>
            </div>
          ) : (
            teams.map((team) => <TeamCard key={team._id} team={team} onSelectionChange={handleSelectionChange} />)
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
