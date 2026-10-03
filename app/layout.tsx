import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"Physics SPM — Nota Last Minit",description:"KSSM Physics Form 4 & Form 5 last-minute revision notes, formulas, experiments, flashcards and MCQs."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}