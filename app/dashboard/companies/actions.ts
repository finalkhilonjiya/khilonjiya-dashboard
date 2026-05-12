'use server'

import { updateCompanyVerification } from '@/lib/services/companies'
import { revalidatePath } from 'next/cache'

export async function updateCompanyVerificationAction(id: string, isVerified: boolean) {
  await updateCompanyVerification(id, isVerified)
  revalidatePath('/dashboard/companies')
  revalidatePath('/dashboard')
}
