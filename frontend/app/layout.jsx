import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Platform CRM",
  description: "Recruiting CRM Stage 0"
};

const navItems = [
  { href: "/candidates", label: "Candidates" },
  { href: "/contacts", label: "Contacts" },
  { href: "/vacancies", label: "Vacancies" },
  { href: "/users", label: "Users" }
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
            <Link href="/" className="font-semibold">
              Platform CRM
            </Link>
            <nav className="flex gap-3 text-sm text-slate-600">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
