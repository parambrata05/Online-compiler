import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Online Compiler",
  description: "Compile Python, C, C++, Java, JS online with testcases",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
