// src/app/(marketing)/contact/page.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Mail, Phone, MapPin } from 'lucide-react'

type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle contact form submission
    console.log('Contact form data:', formData)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      description: 'support@shipstream.com',
      action: 'Email us',
      href: 'mailto:support@shipstream.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      description: '+1 (555) 123-4567',
      action: 'Call us',
      href: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Office',
      description: '123 Shipping Lane, Logistics City, LC 12345',
      action: 'Get directions',
      href: '#',
    },
  ]

  return (
    <div className="bg-white">
      {/* Contact Header */}
      <div className="relative bg-blue-600 py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-600" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Get in touch with our team for any questions about our services or
              to request a quote.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  {item.description}
                </p>
                <a
                  href={item.href}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-500"
                >
                  {item.action} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="mt-16 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Subject
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Message
                </label>
                <div className="mt-2">
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full sm:w-auto">
                  Send message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
