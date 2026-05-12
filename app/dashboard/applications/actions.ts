'use server'

import { updateApplicationStatus } from '@/lib/services/applications'
import { revalidatePath } from 'next/cache'

export async function updateApplicationStatusAction(id: string, status: string) {
  await updateApplicationStatus(id, status)
  revalidatePath('/dashboard/applications')
  revalidatePath('/dashboard')
}
