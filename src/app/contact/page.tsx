"use client"
import { useState } from "react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import { sendContactEmail } from "@/app/actions/contact"

// Import Map component with no SSR
const Map = dynamic(() => import('@/components/map'), { ssr: false })

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
})

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const result = await sendContactEmail(data)

      if (!result.success) {
        toast.error(result.error || 'Failed to send message')
        return
      }
      
      toast.success('Message sent successfully!')
      reset()
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactDetails = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: [
        "+91 8960270179",
        "+91 6389680622"
      ]
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: [
        "mynmss3@gmail.com"
      ]
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Address",
      details: [
        "Hanskheda, Para",
        "Lucknow, Uttar Pradesh",
        "India"
      ]
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      details: [
        "Monday - Saturday: 9:00 AM - 8:00 PM",
        "Sunday: 10:00 AM - 6:00 PM"
      ]
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Have questions? We are here to help. Reach out to us through any of the following channels.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Input 
                      placeholder="Your Name" 
                      {...register("name")}
                      
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Input 
                      type="email" 
                      placeholder="Email Address" 
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Input 
                      placeholder="Subject" 
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                  <div>
                    <Textarea 
                      placeholder="Your Message" 
                      className="min-h-[150px]" 
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Details */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="grid gap-6">
                  {contactDetails.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="bg-blue-100 rounded-full p-3 mr-4">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            {item.details.map((detail, i) => (
                              <p key={i} className="text-gray-600">{detail}</p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Location</h2>
            <div className="aspect-video rounded-lg overflow-hidden">
              <Map 
                center={[26.8467, 80.9462]} // Lucknow coordinates
                zoom={13}
                address="Hanskheda, Para, Lucknow"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
