'use server'

import { updateUserStatus } from '@/lib/services/users'
import { revalidatePath } from 'next/cache'

export async function updateUserStatusAction(id: string, isActive: boolean) {
  await updateUserStatus(id, isActive)
  revalidatePath('/dashboard/users')
  revalidatePath('/dashboard')
}
