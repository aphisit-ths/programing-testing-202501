import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
    title: "User Management App",
    description: "Next.js App Router + shadcn/ui User Management Application",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="th">
        <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
            <header className="border-b bg-white">
                <div className="container mx-auto py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold">User Management</span>
                    </div>
                </div>
            </header>
            <main className="flex-1 bg-slate-50">
                {children}
            </main>
            <footer className="border-t bg-white">
                <div className="container mx-auto py-4 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} User Management App
                </div>
            </footer>
        </div>
        </body>
        </html>
    );
}