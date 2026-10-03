import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
export const metadata: Metadata={title:"Physics SPM — Nota Last Minit",description:"KSSM Physics Form 4 & Form 5 last-minute revision notes, formulas, experiments, flashcards and MCQs."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ms"><body>{children}<div id="google_translate_element" aria-hidden="true"></div><Script id="google-translate-init" strategy="afterInteractive">{`
window.googleTranslateElementInit = function () {
  new window.google.translate.TranslateElement({
    pageLanguage: "ms",
    includedLanguages: "en,ms,id,zh-CN,ta",
    autoDisplay: false
  }, "google_translate_element");
};
`}</Script><Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" /></body></html>}