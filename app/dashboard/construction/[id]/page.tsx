import { getConstructionRequestById } from '@/lib/services/construction'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, Phone, Mail, Calendar, IndianRupee } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import { ConstructionActions } from './construction-actions'

interface PageProps {
  params: Promise<{ id: string }>
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  in_progress: 'default',
  completed: 'default',
  cancelled: 'destructive',
}

export default async function ConstructionDetailPage({ params }: PageProps) {
  const { id } = await params

  let request
  try {
    request = await getConstructionRequestById(id)
  } catch {
    notFound()
  }

  if (!request) notFound()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/construction">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{request.name}</h1>
            <Badge variant={statusColors[request.status] || 'secondary'}>
              {request.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-muted-foreground">{request.service_type}</p>
        </div>
        <ConstructionActions request={request} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{request.phone}</span>
                </div>
                {request.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{request.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:col-span-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{request.project_address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Submitted: {format(new Date(request.created_at), 'PPP')}
                  </span>
                </div>
              </div>

              {request.project_type && (
                <div>
                  <h3 className="font-semibold mb-2">Project Type</h3>
                  <p className="text-sm text-muted-foreground">{request.project_type}</p>
                </div>
              )}

              {request.budget_range && (
                <div>
                  <h3 className="font-semibold mb-2">Budget Range</h3>
                  <p className="text-sm text-muted-foreground">{request.budget_range}</p>
                </div>
              )}

              {request.timeline && (
                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <p className="text-sm text-muted-foreground">{request.timeline}</p>
                </div>
              )}

              {request.additional_details && (
                <div>
                  <h3 className="font-semibold mb-2">Additional Details</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {request.additional_details}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service-Specific Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Service Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {request.needs_design_planning && (
                  <Badge variant="outline" className="justify-center py-2">Design Planning</Badge>
                )}
                {request.needs_material_supply && (
                  <Badge variant="outline" className="justify-center py-2">Material Supply</Badge>
                )}
                {request.needs_soil_testing && (
                  <Badge variant="outline" className="justify-center py-2">Soil Testing</Badge>
                )}
                {request.needs_wiring && (
                  <Badge variant="outline" className="justify-center py-2">Wiring</Badge>
                )}
                {request.needs_electrical_work && (
                  <Badge variant="outline" className="justify-center py-2">Electrical Work</Badge>
                )}
                {request.needs_plumbing_work && (
                  <Badge variant="outline" className="justify-center py-2">Plumbing Work</Badge>
                )}
                {request.needs_painting && (
                  <Badge variant="outline" className="justify-center py-2">Painting</Badge>
                )}
                {request.needs_lighting_work && (
                  <Badge variant="outline" className="justify-center py-2">Lighting Work</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quote</CardTitle>
            </CardHeader>
            <CardContent>
              {request.quote_amount ? (
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    {request.quote_amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ) : (
                <p className="text-muted-foreground">No quote provided yet</p>
              )}
            </CardContent>
          </Card>

          {request.admin_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {request.admin_notes}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.plot_size && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plot Size</span>
                  <span className="font-medium">{request.plot_size}</span>
                </div>
              )}
              {request.number_of_floors && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Floors</span>
                  <span className="font-medium">{request.number_of_floors}</span>
                </div>
              )}
              {request.house_type && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">House Type</span>
                  <span className="font-medium">{request.house_type}</span>
                </div>
              )}
              {request.room_count && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rooms</span>
                  <span className="font-medium">{request.room_count}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
