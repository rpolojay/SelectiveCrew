'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: connect to Firebase or email service
    setSent(true);
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-navy to-ocean text-white py-16 px-4">
        <div className="container-main">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-blue-200">Get in touch with our recruitment team.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container-main max-w-xl">
          {sent ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-navy mb-2">Message Sent!</h2>
              <p className="text-gray-600">We'll get back to you within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ocean"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ocean"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ocean"
                  placeholder="How can we help you?"
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
