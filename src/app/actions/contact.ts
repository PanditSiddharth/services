"use server"

import { Contact } from "@/models/contact"
import dbConnect from "@/lib/db-connect"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    await dbConnect()
    
    const contact = new Contact(data)
    await contact.save()

    return { success: true }
  } catch (error) {
    console.error('Contact form error:', error)
    return { success: false, error: 'Failed to save message' }
  }
}
