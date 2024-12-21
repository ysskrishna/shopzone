import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


const siteConfig = {
  name: "Shopzone | Your One-Stop Online Shopping Destination",
  description: "Discover amazing deals on electronics, fashion, home goods, and more at Shopzone. Shop with confidence with our secure checkout and fast delivery.",
  url: "http://localhost:3000/",
}



export const metadata = {
  title: siteConfig?.name,
  description: siteConfig?.description,
  keywords: [
    "online shopping",
    "e-commerce",
    "digital marketplace",
    "deals",
    "electronics",
    "fashion",
    "home goods",
    "libmate",
    "ysskrishna",
  ],
  authors: [
    {
      name: "Y. Siva Sai Krishna",
      url: "https://github.com/ysskrishna",
    },
  ],
  creator: "Y. Siva Sai Krishna",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.png`],
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.png`],
    creator: "@ysskrishna",
  },
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
