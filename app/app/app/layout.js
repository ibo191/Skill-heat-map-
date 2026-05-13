import "./globals.css";

export const metadata = {
  title: "Skills Heatmap",
  description: "AI porovnanie CV a pracovnej pozície"
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <body>{children}</body>
    </html>
  );
}
