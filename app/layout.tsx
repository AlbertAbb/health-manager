import type {Metadata} from "next";
import {Plus_Jakarta_Sans} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/toaster";

const fontSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sans"
});

export const metadata: Metadata = {
    title: "Health Manager",
    description: "A healthcare management system",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={cn("min-h-screen bg-dark-300 font-sans antialiased text-white", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
            <Toaster />
        </ThemeProvider>
        </body>
        </html>
    );
}
