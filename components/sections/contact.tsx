/**
 * Contact section — shows service times, address, and a simple contact form.
 * The form currently uses mailto: for simplicity.
 * Replace with a server action or API route for production use.
 */
export default function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-blue-900 py-20 px-4 text-white sm:px-6 lg:px-8"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left column: info */}
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-400">
              Get In Touch
            </p>
            <h2
              id="contact-heading"
              className="text-3xl font-bold sm:text-4xl"
            >
              We&rsquo;d Love To Hear From You
            </h2>
            <p className="mt-4 text-blue-200">
              Whether you&rsquo;re new to the area, exploring faith, or just have a
              question — please reach out. We&rsquo;re a friendly, welcoming community.
            </p>

            <dl className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-xl" aria-hidden="true">📍</span>
                <div>
                  <dt className="font-semibold">Address</dt>
                  <dd className="text-blue-200">Huddersfield, West Yorkshire, UK</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-xl" aria-hidden="true">✉️</span>
                <div>
                  <dt className="font-semibold">Email</dt>
                  <dd>
                    <a
                      href="mailto:info@coc-huddersfield.org"
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      info@coc-huddersfield.org
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-xl" aria-hidden="true">🕐</span>
                <div>
                  <dt className="font-semibold">Service Times</dt>
                  <dd className="text-blue-200">
                    Sunday 10:00 AM · Wednesday 7:00 PM
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Right column: contact form */}
          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
            <h3 className="mb-6 text-xl font-semibold">Send Us a Message</h3>
            {/*
              This form uses the native HTML action with mailto: for simplicity.
              For production, replace with a Server Action or third-party service
              like Resend, SendGrid, or Formspree.
            */}
            <form
              action="mailto:info@coc-huddersfield.org"
              method="post"
              encType="text/plain"
              className="space-y-4"
            >
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-blue-100">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Smith"
                  className="w-full rounded-lg bg-white/20 px-4 py-2.5 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-blue-100">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full rounded-lg bg-white/20 px-4 py-2.5 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-blue-100">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  placeholder="How can we help you?"
                  className="w-full resize-none rounded-lg bg-white/20 px-4 py-2.5 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-400"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
