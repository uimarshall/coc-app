import type { Metadata } from "next";
import "./globals.css";

/**
 * Root metadata — applies to every page unless a page overrides it.
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: {
    // Template: individual pages set their own title, which replaces %s
    template: "%s | Church of Christ Huddersfield",
    default: "Church of Christ Huddersfield",
  },
  description:
    "Welcome to the Church of Christ Huddersfield — a community of believers committed to following Christ and serving our city.",
  keywords: ["church", "Huddersfield", "Christ", "worship", "sermons", "community"],
  authors: [{ name: "Church of Christ Huddersfield" }],
  // Open Graph metadata — used when sharing links on social media
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Church of Christ Huddersfield",
  },
};

/**
 * Root layout — wraps every page in the application.
 *
 * Think of this as the HTML template that every page shares.
 * It sets up the <html> and <body> tags, imports global CSS,
 * and could add a navigation bar or footer here.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
