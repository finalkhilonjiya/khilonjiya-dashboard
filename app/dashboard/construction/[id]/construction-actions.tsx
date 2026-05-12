'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Clock, Hammer, CheckCircle, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { updateConstructionStatusAction } from '../actions'

interface ConstructionActionsProps {
  request: {
    id: string
    status: string
  }
}

export function ConstructionActions({ request }: ConstructionActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-2">
      {request.status === 'pending' && (
        <Button
          onClick={() =>
            startTransition(async () => {
              await updateConstructionStatusAction(request.id, 'in_progress')
              router.refresh()
            })
          }
          disabled={isPending}
        >
          <Hammer className="mr-2 h-4 w-4" />
          Start Work
        </Button>
      )}

      {request.status === 'in_progress' && (
        <Button
          onClick={() =>
            startTransition(async () => {
              await updateConstructionStatusAction(request.id, 'completed')
              router.refresh()
            })
          }
          disabled={isPending}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark Completed
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
                await updateConstructionStatusAction(request.id, 'pending')
                router.refresh()
              })
            }
          >
            <Clock className="mr-2 h-4 w-4" />
            Mark Pending
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              startTransition(async () => {
                await updateConstructionStatusAction(request.id, 'in_progress')
                router.refresh()
              })
            }
          >
            <Hammer className="mr-2 h-4 w-4" />
            Mark In Progress
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              startTransition(async () => {
                await updateConstructionStatusAction(request.id, 'completed')
                router.refresh()
              })
            }
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark Completed
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() =>
              startTransition(async () => {
                await updateConstructionStatusAction(request.id, 'cancelled')
                router.refresh()
              })
            }
          >
            Cancel Request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
