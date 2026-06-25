/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BRAND } from './_brand.ts'

interface Props {
  name?: string
  subject?: string
}

const Email = ({ name = 'there', subject = 'inquiry' }: Props) => {
  const first = String(name).split(/\s+/)[0] || 'there'
  return (
    <Html lang="en">
      <Head />
      <Preview>Got your {subject} — Devin will reply within 24 hours.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={accentBar} />
          <Heading style={h1}>Hey {first},</Heading>
          <Text style={p}>
            Got your <strong>{subject}</strong> — it's in front of me, not buried in a queue.
            I read every inquiry myself and usually reply within 24 hours (often same day).
          </Text>
          <Text style={p}>
            While you wait, grab the free{' '}
            <Link href={`${BRAND.site}/playbook`} style={link}>
              NJ Entrepreneur Playbook
            </Link>{' '}
            — 11 lessons from building 7 businesses in Bergen County.
          </Text>
          <Text style={p}>
            Talk soon,<br />
            <strong>Devin Policastro</strong><br />
            <span style={{ color: BRAND.muted, fontSize: 14 }}>Norwood, NJ</span>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            You're getting this because you submitted an inquiry at devinpolicastro.com.
            Reply directly and it'll come to me.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#ffffff', fontFamily: BRAND.font, margin: 0, padding: 0 }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const accentBar = { height: '4px', backgroundColor: BRAND.accent, borderRadius: '2px', marginBottom: '24px' }
const h1 = { color: BRAND.ink, fontSize: '22px', fontWeight: 700, margin: '0 0 16px' }
const p = { color: BRAND.ink, fontSize: '16px', lineHeight: 1.6, margin: '0 0 16px' }
const link = { color: BRAND.accent, fontWeight: 600, textDecoration: 'none' }
const hr = { borderColor: BRAND.border, margin: '24px 0' }
const footer = { color: BRAND.muted, fontSize: '12px', lineHeight: 1.5, margin: 0 }

export const template = {
  component: Email,
  subject: (d: Props) => `Got it, ${String(d?.name ?? 'there').split(/\s+/)[0]} — talk soon`,
  displayName: 'Inquiry auto-reply',
  previewData: { name: 'Sam Rivera', subject: 'consulting inquiry' },
} satisfies TemplateEntry
