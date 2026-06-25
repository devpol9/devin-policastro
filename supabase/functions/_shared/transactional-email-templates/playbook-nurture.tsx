/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BRAND } from './_brand.ts'

interface Props {
  name?: string
  subjectLine?: string
  heading?: string
  bodyHtml?: string
  ctaLabel?: string
  ctaUrl?: string
}

const Email = ({
  name = 'there',
  heading = 'Quick follow-up',
  bodyHtml = '',
  ctaLabel = '',
  ctaUrl = '',
}: Props) => {
  const first = String(name).split(/\s+/)[0] || 'there'
  return (
    <Html lang="en">
      <Head />
      <Preview>{heading}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={accentBar} />
          <Heading style={h1}>{heading}</Heading>
          <Text style={p}>Hey {first},</Text>
          {bodyHtml ? (
            <Section style={{ ...p }} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          ) : null}
          {ctaUrl && ctaLabel ? (
            <Section style={{ textAlign: 'center', margin: '24px 0' }}>
              <Link href={ctaUrl} style={btn}>{ctaLabel}</Link>
            </Section>
          ) : null}
          <Text style={p}>
            — Devin<br />
            <span style={{ color: BRAND.muted, fontSize: 14 }}>devinpolicastro.com</span>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>You're getting this because you grabbed the NJ Entrepreneur Playbook.</Text>
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
const btn = { backgroundColor: BRAND.ink, color: '#ffffff', padding: '12px 24px', borderRadius: BRAND.radius, fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: BRAND.border, margin: '24px 0' }
const footer = { color: BRAND.muted, fontSize: '12px', margin: 0 }

export const template = {
  component: Email,
  subject: (d: Props) => d?.subjectLine || d?.heading || 'A quick follow-up from Devin',
  displayName: 'Playbook nurture',
  previewData: {
    name: 'Sam',
    subjectLine: 'The one lesson everyone underestimates',
    heading: 'The one lesson everyone underestimates',
    bodyHtml: '<p>Speed of decision beats quality of decision more often than you think...</p>',
    ctaLabel: 'Read more on devinpolicastro.com',
    ctaUrl: 'https://devinpolicastro.com',
  },
} satisfies TemplateEntry
