"use client"

import { useEffect, useState } from "react"
import type { Team } from "@/types/team"
import { AdminLayout } from "@/components/admin-layout"
import { TeamCard } from "@/components/team-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch("/api/admin/teams", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setTeams(data.teams)
        setFilteredTeams(data.teams)
      } else {
        throw new Error("Failed to fetch teams")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    const filtered = teams.filter(
      (team) =>
        team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.idea_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.participants.some(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.college_or_company_name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    )
    setFilteredTeams(filtered)
  }, [searchTerm, teams])

  const handleSelectionChange = (teamId: string, selected: boolean) => {
    setTeams((prev) => prev.map((team) => (team._id === teamId ? { ...team, selected } : team)))
  }

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
            <h1 className="text-2xl font-bold text-gray-900">All Teams</h1>
            <p className="text-gray-600">
              {teams.length} teams registered • {teams.filter((t) => t.selected).length} selected
            </p>
          </div>
          <Button onClick={fetchTeams} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search teams, ideas, or participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Teams List */}
        <div className="space-y-4">
          {filteredTeams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{searchTerm ? "No teams match your search." : "No teams registered yet."}</p>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <TeamCard key={team._id} team={team} onSelectionChange={handleSelectionChange} />
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
