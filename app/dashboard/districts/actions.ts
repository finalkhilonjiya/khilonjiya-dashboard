"use server"

import { updateDistrictStatus } from "@/lib/services/districts"
import { revalidatePath } from "next/cache"

export async function toggleDistrictStatus(id: string, isActive: boolean) {
  const success = await updateDistrictStatus(id, isActive)
  
  if (success) {
    revalidatePath("/dashboard/districts")
  }
  
  return { success }
}
