import "./globals.css";

export const metadata = {
  title: "SkillHeat â€” Know your project management edge",
  description: "Map your project management skills and see how ready you are for your next role.",
  icons: { icon: "/icon.svg" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


