import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/GlobalContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "InstaForm AI — Generate Forms Instantly with AI",
  description:
    "Create beautiful, responsive forms in seconds using AI. No coding needed. Just describe your form and let InstaForm AI build it for you.",
  keywords: "form builder, AI forms, form generator, no-code forms",
};

export default function RootLayout({ children }) {
  return (
    <GlobalProvider>
      <html lang="en">
        <body className={`${inter.variable} antialiased`} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
          {children}
        </body>
      </html>
    </GlobalProvider>
  );
}
