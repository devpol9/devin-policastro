/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BRAND } from './_brand.ts'

interface Field { label: string; value: string }
interface Props {
  title?: string
  preheader?: string
  intro?: string
  bodyHtml?: string
  fields?: Field[]
}

const Email = ({
  title = 'Notification',
  preheader = '',
  intro = '',
  bodyHtml = '',
  fields = [],
}: Props) => (
  <Html lang="en">
    <Head />
    <Preview>{preheader || title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={accentBar} />
        <Text style={kicker}>Devin HQ</Text>
        <Heading style={h1}>{title}</Heading>
        {intro ? <Text style={p}>{intro}</Text> : null}
        {fields.length > 0 ? (
          <Section style={card}>
            {fields.map((f, i) => (
              <Text key={i} style={fieldRow}>
                <strong style={{ color: BRAND.ink }}>{f.label}: </strong>
                <span style={{ color: BRAND.muted }}>{f.value}</span>
              </Text>
            ))}
          </Section>
        ) : null}
        {bodyHtml ? (
          <Section
            style={{ marginTop: 16 }}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : null}
        <Hr style={hr} />
        <Text style={footer}>Sent from devinpolicastro.com · Internal HQ alert</Text>
      </Container>
    </Body>
  </Html>
)

const main = { backgroundColor: '#ffffff', fontFamily: BRAND.font, margin: 0, padding: 0 }
const container = { maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }
const accentBar = { height: '4px', backgroundColor: BRAND.accent, borderRadius: '2px', marginBottom: '20px' }
const kicker = { color: BRAND.accent, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, fontWeight: 700, margin: '0 0 8px' }
const h1 = { color: BRAND.ink, fontSize: '22px', fontWeight: 700, margin: '0 0 16px' }
const p = { color: BRAND.ink, fontSize: '15px', lineHeight: 1.6, margin: '0 0 12px' }
const card = { backgroundColor: BRAND.bgSoft, border: `1px solid ${BRAND.border}`, borderRadius: BRAND.radius, padding: '16px 18px', margin: '8px 0 16px' }
const fieldRow = { fontSize: '14px', lineHeight: 1.6, margin: '4px 0' }
const hr = { borderColor: BRAND.border, margin: '24px 0' }
const footer = { color: BRAND.muted, fontSize: '12px', margin: 0 }

export const template = {
  component: Email,
  subject: (d: Props) => d?.title || 'HQ notification',
  displayName: 'Admin notification',
  previewData: {
    title: 'New consulting inquiry',
    preheader: 'Sam Rivera just submitted the contact form',
    intro: 'Heads up — a new lead came in.',
    fields: [
      { label: 'Name', value: 'Sam Rivera' },
      { label: 'Email', value: 'sam@example.com' },
      { label: 'Service', value: 'Consulting' },
    ],
  },
} satisfies TemplateEntry
