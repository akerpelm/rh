import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="font-bold">NYC Running Hub</h3>
              <p className="text-sm text-muted-foreground">Connecting runners in New York City</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/events"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clubs"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Clubs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} NYC Running Hub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
