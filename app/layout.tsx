import type { Metadata } from "next";
import "./globals.css";
import { Agentation } from "agentation";

export const metadata: Metadata = {
  title: "Insphere",
  description: "AI-powered sales intelligence platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {/* Agentation: visual annotation tool for AI agent feedback.
            Click the toolbar icon (bottom-right) to annotate any element,
            then paste the structured output here in Cursor. */}
        <Agentation endpoint="http://localhost:4747" />
      </body>
    </html>
  );
}
