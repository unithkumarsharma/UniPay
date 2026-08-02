import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "UniPay - Multi-Service Payment Platform",
  description: "India's trusted multi-service platform for recharges, bill payments, money transfers, and more. Empowering retailers and distributors across India.",
  keywords: "UniPay, recharge, bill payment, money transfer, AEPS, PAN card, fintech",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
