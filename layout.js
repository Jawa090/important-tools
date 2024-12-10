// app/layout.js

import './globals.css';

export const metadata = {
  title: "Image to PNG Converter",
  description: "Convert images to PNG format easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Image to PNG Converter & Image Compressor</h1>
          
        </header>
        <main>{children}</main>
       
      </body>
    </html>
  );
}
