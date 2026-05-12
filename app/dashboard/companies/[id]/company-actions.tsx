'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { updateCompanyVerificationAction } from '../actions'

interface CompanyActionsProps {
  company: {
    id: string
    is_verified: boolean
  }
}

export function CompanyActions({ company }: CompanyActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-2">
      {company.is_verified ? (
        <Button
          variant="outline"
          onClick={() =>
            startTransition(async () => {
              await updateCompanyVerificationAction(company.id, false)
              router.refresh()
            })
          }
          disabled={isPending}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Revoke Verification
        </Button>
      ) : (
        <Button
          onClick={() =>
            startTransition(async () => {
              await updateCompanyVerificationAction(company.id, true)
              router.refresh()
            })
          }
          disabled={isPending}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Verify Company
        </Button>
      )}
    </div>
  )
}
