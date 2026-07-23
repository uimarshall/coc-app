import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Hero section — the first thing visitors see on the home page.
 * It should be welcoming, clear, and call the visitor to action.
 */
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"
      aria-label="Welcome banner"
    >
      {/* Decorative background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Tag line */}
        <p className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-blue-100">
          Welcome to our church family
        </p>

        {/* Main heading */}
        <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl text-balance">
          Church of Christ{" "}
          <span className="text-amber-400">Huddersfield</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100 sm:text-xl">
          A community of believers committed to following Christ, growing
          together in faith, and serving the people of Huddersfield with love.
        </p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/#services">
            <Button size="lg" variant="secondary">
              Join Us This Sunday
            </Button>
          </Link>
          <Link href="/#about">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-900"
            >
              Learn More
            </Button>
          </Link>
        </div>

        {/* Service time badge */}
        <div className="mt-12 inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm text-blue-100">
          <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong className="text-white">Sunday Service</strong> — 10:00 AM
          </span>
        </div>
      </div>
    </section>
  );
}
