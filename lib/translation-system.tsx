"use client"

import type React from "react"

import { useEffect, useState, createContext, useContext } from "react"
import { translations, type SupportedLanguage, type TranslationKey } from "./translations"

export type { SupportedLanguage, TranslationKey }

export interface TranslationConfig {
  language: SupportedLanguage
  region: string
}

const TranslationContext = createContext<{
  language: SupportedLanguage
  region: string
  t: (key: TranslationKey, fallback?: string) => string
  setLanguage: (language: SupportedLanguage) => void
}>({
  language: "en",
  region: "",
  t: (key: TranslationKey, fallback?: string) => fallback || key,
  setLanguage: () => {},
})

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en")
  const [region, setRegion] = useState("")

  useEffect(() => {
    // Load saved language and region from localStorage
    const savedLanguage = localStorage.getItem("user_language") as SupportedLanguage
    const savedRegion = localStorage.getItem("user_region")

    if (savedLanguage) setLanguageState(savedLanguage)
    if (savedRegion) setRegion(savedRegion)
  }, [])

  useEffect(() => {
    // Listen for language changes from profile updates
    const handleLanguageChange = (event: CustomEvent<TranslationConfig>) => {
      setLanguageState(event.detail.language)
      setRegion(event.detail.region)
      localStorage.setItem("user_language", event.detail.language)
      localStorage.setItem("user_region", event.detail.region)
    }

    window.addEventListener("language-changed" as any, handleLanguageChange)
    return () => {
      window.removeEventListener("language-changed" as any, handleLanguageChange)
    }
  }, [])

  const t = (key: TranslationKey, fallback?: string): string => {
    const translation = translations[language]?.[key]
    return translation || fallback || key
  }

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage)
    localStorage.setItem("user_language", newLanguage)
  }

  return (
    <TranslationContext.Provider value={{ language, region, t, setLanguage }}>{children}</TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider")
  }
  return context
}

// Helper to get language name
export function getLanguageName(code: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    hi: "Hindi",
    ar: "Arabic",
    sw: "Swahili",
    pt: "Portuguese",
    mi: "Māori",
    sm: "Samoan",
  }
  return names[code] || code
}
