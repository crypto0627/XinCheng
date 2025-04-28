"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, ChevronDown } from "lucide-react"

interface TimeRangeFilterProps {
  currentTimeRange: string
  onTimeRangeChange: (timeRange: string) => void
}

const timeRanges = ["今日", "本週", "本月", "本季", "本年", "所有"]

export function TimeRangeFilter({ currentTimeRange, onTimeRangeChange }: TimeRangeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">時間範圍:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1">
            {currentTimeRange}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {timeRanges.map((range) => (
            <DropdownMenuItem
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={currentTimeRange === range ? "bg-muted" : ""}
            >
              {range}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
