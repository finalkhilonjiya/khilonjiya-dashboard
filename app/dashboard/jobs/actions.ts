'use server'

import { updateJobStatus, toggleJobPremium, toggleJobUrgent } from '@/lib/services/jobs'
import { revalidatePath } from 'next/cache'

export async function updateJobStatusAction(id: string, status: string) {
  await updateJobStatus(id, status)
  revalidatePath('/dashboard/jobs')
  revalidatePath('/dashboard')
}

export async function toggleJobPremiumAction(id: string, isPremium: boolean) {
  await toggleJobPremium(id, isPremium)
  revalidatePath('/dashboard/jobs')
}

export async function toggleJobUrgentAction(id: string, isUrgent: boolean) {
  await toggleJobUrgent(id, isUrgent)
  revalidatePath('/dashboard/jobs')
}
