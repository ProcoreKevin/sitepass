"use client"

import { useState, useEffect } from "react"
import { translations, type SupportedLanguage, type TranslationKey } from "./translations"

export function useTranslation() {
  const [language, setLanguage] = useState<SupportedLanguage>("en")

  useEffect(() => {
    // Load language from localStorage
    const storedLanguage = localStorage.getItem("user_language") as SupportedLanguage
    if (storedLanguage && translations[storedLanguage]) {
      setLanguage(storedLanguage)
    }

    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent) => {
      const { language: newLanguage } = event.detail
      if (newLanguage && translations[newLanguage as SupportedLanguage]) {
        setLanguage(newLanguage as SupportedLanguage)
      }
    }

    window.addEventListener("language-changed", handleLanguageChange as EventListener)
    return () => window.removeEventListener("language-changed", handleLanguageChange as EventListener)
  }, [])

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  return { t, language, setLanguage }
}
