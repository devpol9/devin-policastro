/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BRAND } from './_brand.ts'

interface Props {
  name?: string
  downloadUrl?: string
  title?: string
}

const Email = ({ name = 'there', downloadUrl = BRAND.site, title = 'The NJ Entrepreneur Playbook' }: Props) => {
  const first = String(name).split(/\s+/)[0] || 'there'
  return (
    <Html lang="en">
      <Head />
      <Preview>Your copy of {title} is ready.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={accentBar} />
          <Heading style={h1}>Here you go, {first}.</Heading>
          <Text style={p}>
            Thanks for grabbing <strong>{title}</strong>. It's 11 lessons from building 7 businesses
            in Bergen County — written the way I'd tell a friend over coffee.
          </Text>
          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button href={downloadUrl} style={btn}>Download the playbook</Button>
          </Section>
          <Text style={p}>
            Or paste this link in your browser:<br />
            <Link href={downloadUrl} style={link}>{downloadUrl}</Link>
          </Text>
          <Text style={p}>
            I'll send a couple short follow-ups over the next two weeks with the takeaways most people
            ask about. If anything resonates, just reply — it comes straight to me.
          </Text>
          <Text style={p}>
            — Devin<br />
            <span style={{ color: BRAND.muted, fontSize: 14 }}>devinpolicastro.com · Norwood, NJ</span>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>You requested this download at devinpolicastro.com/playbook.</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#ffffff', fontFamily: BRAND.font, margin: 0, padding: 0 }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const accentBar = { height: '4px', backgroundColor: BRAND.accent, borderRadius: '2px', marginBottom: '24px' }
const h1 = { color: BRAND.ink, fontSize: '24px', fontWeight: 700, margin: '0 0 16px' }
const p = { color: BRAND.ink, fontSize: '16px', lineHeight: 1.6, margin: '0 0 16px' }
const link = { color: BRAND.accent, fontWeight: 600, wordBreak: 'break-all' as const }
const btn = { backgroundColor: BRAND.ink, color: '#ffffff', padding: '14px 28px', borderRadius: BRAND.radius, fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: BRAND.border, margin: '24px 0' }
const footer = { color: BRAND.muted, fontSize: '12px', margin: 0 }

export const template = {
  component: Email,
  subject: 'Your NJ Entrepreneur Playbook is here',
  displayName: 'Lead magnet delivery',
  previewData: { name: 'Sam', downloadUrl: 'https://devinpolicastro.com/playbook.pdf', title: 'The NJ Entrepreneur Playbook' },
} satisfies TemplateEntry
