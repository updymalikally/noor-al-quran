import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Noor Al-Quran | Modern Islamic Companion',
  description: 'A peaceful space for Quran, Dhikr, and Islamic learning.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="pattern-bg"></div>
          <Navbar />
          <main>{children}</main>
          <footer className="footer">
            <div className="container">
              <p>&copy; 2026 Noor Al-Quran. All rights reserved.</p>
              <p>Keep us in your prayers.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
