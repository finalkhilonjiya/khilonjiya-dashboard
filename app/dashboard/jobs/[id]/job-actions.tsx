'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CheckCircle, XCircle, Star, StarOff, AlertTriangle, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { updateJobStatusAction, toggleJobPremiumAction, toggleJobUrgentAction } from '../actions'

interface JobActionsProps {
  job: {
    id: string
    status: string
    is_premium: boolean
    is_urgent: boolean
  }
}

export function JobActions({ job }: JobActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-2">
      {job.status !== 'active' && (
        <Button
          onClick={() =>
            startTransition(async () => {
              await updateJobStatusAction(job.id, 'active')
              router.refresh()
            })
          }
          disabled={isPending}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve
        </Button>
      )}

      {job.status === 'active' && (
        <Button
          variant="secondary"
          onClick={() =>
            startTransition(async () => {
              await updateJobStatusAction(job.id, 'paused')
              router.refresh()
            })
          }
          disabled={isPending}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Pause
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              startTransition(async () => {
                await toggleJobPremiumAction(job.id, !job.is_premium)
                router.refresh()
              })
            }
          >
            {job.is_premium ? (
              <>
                <StarOff className="mr-2 h-4 w-4" />
                Remove Premium
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                Make Premium
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              startTransition(async () => {
                await toggleJobUrgentAction(job.id, !job.is_urgent)
                router.refresh()
              })
            }
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            {job.is_urgent ? 'Remove Urgent' : 'Mark Urgent'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() =>
              startTransition(async () => {
                await updateJobStatusAction(job.id, 'closed')
                router.refresh()
              })
            }
          >
            <XCircle className="mr-2 h-4 w-4" />
            Close Job
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
