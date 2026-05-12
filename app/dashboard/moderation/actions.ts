'use server'

import { updateReportStatus } from '@/lib/services/moderation'
import { revalidatePath } from 'next/cache'

export async function updateReportStatusAction(id: string, status: string, notes?: string) {
  await updateReportStatus(id, status, notes)
  revalidatePath('/dashboard/moderation')
  revalidatePath('/dashboard')
}
