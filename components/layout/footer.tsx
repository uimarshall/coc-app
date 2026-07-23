import Link from "next/link";

/**
 * Site-wide footer.
 * Shows the church name, quick links, and contact info.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                C
              </div>
              <span className="font-semibold text-white">CoC Huddersfield</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              A community of believers committed to following Christ and serving
              the people of Huddersfield.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/#about", label: "About Us" },
                { href: "/#sermons", label: "Sermons" },
                { href: "/#events", label: "Events" },
                { href: "/#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service times */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Service Times
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium text-white">Sunday Morning</span>
                <br />
                10:00 AM – Worship Service
              </li>
              <li>
                <span className="font-medium text-white">Wednesday Evening</span>
                <br />
                7:00 PM – Bible Study
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Huddersfield, West Yorkshire, UK</li>
              <li>
                <a
                  href="mailto:info@coc-huddersfield.org"
                  className="transition-colors hover:text-white"
                >
                  info@coc-huddersfield.org
                </a>
              </li>
            </ul>
            {/* Social links placeholder */}
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-full bg-gray-700 p-2 text-gray-400 transition-colors hover:bg-blue-600 hover:text-white"
              >
                {/* Facebook icon */}
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="rounded-full bg-gray-700 p-2 text-gray-400 transition-colors hover:bg-red-600 hover:text-white"
              >
                {/* YouTube icon */}
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21.582 7.186a2.506 2.506 0 00-1.768-1.768C18.254 5 12 5 12 5s-6.254 0-7.814.418A2.506 2.506 0 002.418 7.186C2 8.746 2 12 2 12s0 3.254.418 4.814a2.506 2.506 0 001.768 1.768C5.746 19 12 19 12 19s6.254 0 7.814-.418a2.506 2.506 0 001.768-1.768C22 15.254 22 12 22 12s0-3.254-.418-4.814zM10 15V9l5.196 3L10 15z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>
            &copy; {currentYear} Church of Christ Huddersfield. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
