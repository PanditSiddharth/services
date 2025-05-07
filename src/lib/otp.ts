// In a real application, you would use a proper OTP service
// This is a simplified version for demonstration purposes

// Store OTPs in memory (in production, use Redis or another database)
const otpStore: Record<string, { otp: string; expiresAt: number }> = {}

// Generate a random OTP
export function generateOTP(length = 6): string {
  const digits = "0123456789"
  let OTP = ""
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)]
  }
  return OTP
}

// Store OTP for a phone number
export function storeOTP(phone: string, otp: string, expiresInMinutes = 10): void {
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000
  otpStore[phone] = { otp, expiresAt }
}

// Verify OTP for a phone number
export function verifyOTP(phone: string, otp: string): boolean {
  const storedData = otpStore[phone]

  if (!storedData) {
    return false
  }

  if (Date.now() > storedData.expiresAt) {
    // OTP expired
    delete otpStore[phone]
    return false
  }

  if (storedData.otp !== otp) {
    return false
  }

  // OTP verified successfully, remove it from store
  delete otpStore[phone]
  return true
}

// In a real application, you would integrate with an SMS service
export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  try {
    // Simulate sending an SMS
    console.log(`Sending OTP ${otp} to ${phone}`)

    // In a real application, you would use an SMS service like Twilio
    // const message = await twilioClient.messages.create({
    //   body: `Your verification code is: ${otp}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone
    // });

    return true
  } catch (error) {
    console.error("Error sending OTP:", error)
    return false
  }
}
