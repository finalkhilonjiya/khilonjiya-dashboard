export interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  location: string | null
  bio: string | null
  role: 'job_seeker' | 'employer' | 'admin'
  verification_status: 'pending' | 'verified' | 'rejected'
  is_active: boolean
  mobile_number: string | null
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  slug: string | null
  logo_url: string | null
  website: string | null
  description: string | null
  industry: string | null
  company_size: string | null
  founded_year: number | null
  headquarters_city: string | null
  headquarters_state: string | null
  rating: number | null
  total_reviews: number
  total_jobs: number
  is_verified: boolean
  created_at: string
  updated_at: string
  owner_id: string | null
  created_by: string
  business_type_id: string
}

export interface JobListing {
  id: string
  employer_id: string
  company_id: string
  job_title: string
  job_category: string | null
  job_type: string
  employment_type: string | null
  job_description: string
  requirements: string
  education_required: string
  experience_required: string
  salary_min: number
  salary_max: number
  benefits: string | null
  district: string
  job_address: string
  hiring_urgency: string
  status: 'pending' | 'active' | 'paused' | 'closed' | 'expired'
  applications_count: number
  views_count: number
  is_premium: boolean
  is_urgent: boolean
  is_walk_in: boolean
  work_mode: 'Remote' | 'On-site' | 'Hybrid' | null
  created_at: string
  updated_at: string
  expires_at: string | null
}

export interface JobApplication {
  id: string
  user_id: string
  name: string
  phone: string
  email: string
  district: string | null
  skills: string
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected'
  resume_file_url: string | null
  photo_file_url: string | null
  created_at: string
  updated_at: string
}

export interface JobApplicationListing {
  id: string
  application_id: string
  listing_id: string
  user_id: string
  applied_at: string
  application_status: 'applied' | 'viewed' | 'shortlisted' | 'interview_scheduled' | 'interviewed' | 'selected' | 'rejected'
  employer_notes: string | null
  interview_date: string | null
}

export interface ConstructionServiceRequest {
  id: string
  user_id: string | null
  service_type: string
  name: string
  phone: string
  email: string | null
  project_address: string
  project_type: string | null
  budget_range: string | null
  timeline: string | null
  status: string
  quote_amount: number | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  status: 'inactive' | 'active' | 'expired'
  plan_price: number
  starts_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface PaymentTransaction {
  id: string
  user_id: string
  plan_key: string
  amount_inr: number
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  status: string
  created_at: string
  paid_at: string | null
}

export interface Report {
  id: string
  reporter_id: string
  reported_item_type: string
  reported_item_id: string
  reason: string
  description: string | null
  status: string
  moderator_notes: string | null
  resolved_at: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body: string | null
  data: Record<string, unknown>
  is_read: boolean
  push_sent: boolean
  created_at: string
}

export interface AssamDistrict {
  id: string
  district_name: string
  headquarters: string
  latitude: number
  longitude: number
  created_at: string
}

export interface AdminAction {
  id: string
  admin_user_id: string
  action_type: string
  target_type: string | null
  target_id: string | null
  notes: string | null
  created_at: string
}

export interface SearchTrend {
  id: string
  keyword: string
  search_count: number
  updated_at: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalEmployers: number
  totalCompanies: number
  activeJobs: number
  applicationsToday: number
  revenueMTD: number
  activeSubscriptions: number
  pendingReports: number
  pendingConstructionRequests: number
}
