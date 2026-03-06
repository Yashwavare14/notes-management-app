// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is missing from .env.local')
  }

  // --- 1. Grab Svix headers for verification ---
  const headerPayload = await headers()
  const svix_id        = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  // --- 2. Verify the payload is genuinely from Clerk ---
  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let event: WebhookEvent

  try {
    event = wh.verify(body, {
      'svix-id':        svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  // --- 3. Handle events ---
  switch (event.type) {

    case 'user.created': {
      const { id, email_addresses, first_name, last_name, image_url } = event.data

      await db.insert(users).values({
        clerkId:   id,
        email:     email_addresses[0].email_address,
        name:      `${first_name ?? ''} ${last_name ?? ''}`.trim(),
      })

      console.log(`User created: ${id}`)
      break
    }

    case 'user.updated': {
      const { id, email_addresses, first_name, last_name, image_url } = event.data

      await db
        .update(users)
        .set({
          email:    email_addresses[0].email_address,
          name:     `${first_name ?? ''} ${last_name ?? ''}`.trim(),
        })
        .where(eq(users.clerkId, id))

      console.log(`User updated: ${id}`)
      break
    }

    case 'user.deleted': {
      const { id } = event.data

      if (id) {
        await db
          .delete(users)
          .where(eq(users.clerkId, id))

        console.log(`User deleted: ${id}`)
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new Response('OK', { status: 200 })
}