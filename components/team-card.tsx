"use client"

import { useState } from "react"
import type { Team } from "@/types/team"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ExternalLink, Github, Linkedin, User, Mail, Phone, Building, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TeamCardProps {
  team: Team
  onSelectionChange?: (teamId: string, selected: boolean) => void
  showSelectionButton?: boolean
}

export function TeamCard({ team, onSelectionChange, showSelectionButton = true }: TeamCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleToggleSelection = async () => {
    if (!team._id) return

    setIsUpdating(true)
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch(`/api/admin/teams/${team._id}/select`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected: !team.selected }),
      })

      if (response.ok) {
        onSelectionChange?.(team._id, !team.selected)
        toast({
          title: team.selected ? "Team deselected" : "Team selected",
          description: `${team.team_name} has been ${team.selected ? "removed from" : "added to"} finals`,
        })
      } else {
        throw new Error("Failed to update team selection")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team selection",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg">{team.team_name}</CardTitle>
                {team.selected && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Selected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{team.idea_title}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {team.team_size} members
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(team.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showSelectionButton && (
                <Button
                  variant={team.selected ? "destructive" : "default"}
                  size="sm"
                  onClick={handleToggleSelection}
                  disabled={isUpdating}
                >
                  {team.selected ? "Deselect" : "Select"}
                </Button>
              )}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Idea Document Link */}
              <div>
                <h4 className="font-medium text-sm mb-2">Idea Document</h4>
                <a
                  href={team.idea_document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Document
                </a>
              </div>

              {/* Participants */}
              <div>
                <h4 className="font-medium text-sm mb-3">Team Members</h4>
                <div className="space-y-3">
                  {team.participants.map((participant, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h5 className="font-medium text-sm">{participant.name}</h5>
                        <Badge variant="outline" className="text-xs w-fit">
                          {participant.student_or_professional}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${participant.email}`} className="hover:text-blue-600">
                            {participant.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {participant.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {participant.college_or_company_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Age: {participant.age}
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="flex gap-2 mt-2">
                        {participant.github_profile && (
                          <a
                            href={participant.github_profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {participant.linkedin_profile && (
                          <a
                            href={participant.linkedin_profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {participant.devfolio_profile && (
                          <a
                            href={participant.devfolio_profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 text-xs"
                          >
                            Devfolio
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
