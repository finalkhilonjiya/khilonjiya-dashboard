import { createClient } from "@/lib/supabase/server"

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  metadata?: Record<string, unknown>
}

export async function getNotifications(filters?: {
  type?: string
  isRead?: boolean
  limit?: number
  offset?: number
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })

  if (filters?.type) {
    query = query.eq("type", filters.type)
  }

  if (filters?.isRead !== undefined) {
    query = query.eq("is_read", filters.isRead)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching notifications:", error)
    return { data: [], count: 0 }
  }

  return { data: data as Notification[], count: count || 0 }
}

export async function markNotificationAsRead(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)

  if (error) {
    console.error("Error marking notification as read:", error)
    return false
  }

  return true
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false)

  if (error) {
    console.error("Error marking all notifications as read:", error)
    return false
  }

  return true
}

export async function getUnreadNotificationCount() {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)

  if (error) {
    console.error("Error getting unread count:", error)
    return 0
  }

  return count || 0
}
