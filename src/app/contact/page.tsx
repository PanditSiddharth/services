import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen">
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
                <form className="space-y-6">
                  <div>
                    <Input placeholder="Your Name" />
                  </div>
                  <div>
                    <Input type="email" placeholder="Email Address" />
                  </div>
                  <div>
                    <Input placeholder="Subject" />
                  </div>
                  <div>
                    <Textarea placeholder="Your Message" className="min-h-[150px]" />
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </div>

              {/* Contact Details */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="grid gap-6">
                  {[
                    {
                      icon: <Phone className="h-6 w-6" />,
                      title: "Phone",
                      details: [
                        "+91 1234567890",
                        "+91 9876543210"
                      ]
                    },
                    {
                      icon: <Mail className="h-6 w-6" />,
                      title: "Email",
                      details: [
                        "support@serviceplatform.com",
                        "info@serviceplatform.com"
                      ]
                    },
                    {
                      icon: <MapPin className="h-6 w-6" />,
                      title: "Address",
                      details: [
                        "123 Service Street",
                        "Mumbai, Maharashtra 400001",
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
                  ].map((item, index) => (
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
            <div className="aspect-video bg-gray-200 rounded-lg">
              {/* Add your map component here */}
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Map Component Goes Here
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
