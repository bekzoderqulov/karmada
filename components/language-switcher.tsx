"use client"

import { useState, useEffect } from "react"
import { Check, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/context/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Globe className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("uz")}>
          <div className="flex items-center justify-between w-full">
            <span>O'zbek</span>
            {language === "uz" && <Check className="h-4 w-4 ml-2" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ru")}>
          <div className="flex items-center justify-between w-full">
            <span>Русский</span>
            {language === "ru" && <Check className="h-4 w-4 ml-2" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <div className="flex items-center justify-between w-full">
            <span>English</span>
            {language === "en" && <Check className="h-4 w-4 ml-2" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher

