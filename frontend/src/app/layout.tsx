import './globals.css';

export const metadata = {
  title: 'Instagram Analysis Tool',
  description: 'Analyze Instagram profiles',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
