'use server'

import { updateConstructionRequestStatus, updateConstructionRequestQuote } from '@/lib/services/construction'
import { revalidatePath } from 'next/cache'

export async function updateConstructionStatusAction(id: string, status: string) {
  await updateConstructionRequestStatus(id, status)
  revalidatePath('/dashboard/construction')
  revalidatePath('/dashboard')
}

export async function updateConstructionQuoteAction(id: string, quoteAmount: number, adminNotes?: string) {
  await updateConstructionRequestQuote(id, quoteAmount, adminNotes)
  revalidatePath('/dashboard/construction')
}
