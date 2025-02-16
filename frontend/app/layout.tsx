// app/layout.tsx
import Link from 'next/link';
import './globals.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <title>Chaster Extension</title>
      </head>
      <body className="bg-gray-900 text-white">
        <nav className="p-4 bg-gray-800">
          <Link href="/" className="mr-4 hover:underline">Home</Link>
          <Link href="/config" className="hover:underline">Konfiguration</Link>
        </nav>
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
