import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/app/globals.css";
import { OnlineStatusProvider } from "@/contexts/OnlineStatusContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NotificationListener from "@/components/notifications/NotificationListener";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Student Forum - Connect Students",
  description:
    "Student forum with modern Google Material Design interface, connect friends and share knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
          integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${roboto.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <OnlineStatusProvider>
              {/* Listens for WS notifications when a user is logged in */}
              <NotificationListener />
              {children}
            </OnlineStatusProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
