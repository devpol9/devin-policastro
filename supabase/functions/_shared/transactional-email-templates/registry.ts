import type * as React from 'npm:react@18.3.1'
import { template as contactConfirmation } from './contact-confirmation.tsx'
import { template as notifyAdmin } from './notify-admin.tsx'
import { template as leadMagnetDelivery } from './lead-magnet-delivery.tsx'
import { template as playbookNurture } from './playbook-nurture.tsx'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, unknown>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-confirmation': contactConfirmation,
  'notify-admin': notifyAdmin,
  'lead-magnet-delivery': leadMagnetDelivery,
  'playbook-nurture': playbookNurture,
}
