"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"

export default function AdminLanguageSwitcher() {
  const { language, setLanguage, t } = useAdminLanguage()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Set mounted state after component mounts to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything during SSR to avoid hydration issues
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Globe className="h-4 w-4" />
      </Button>
    )
  }

  const languages = [
    { value: "en", label: "English" },
    { value: "ru", label: "Русский" },
    { value: "uz", label: "O'zbek" },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:h-9 md:w-auto md:px-3 md:py-2"
          aria-label={t("changeLanguage")}
        >
          <Globe className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline text-xs">{languages.find((l) => l.value === language)?.label}</span>
          <ChevronsUpDown className="hidden md:inline h-4 w-4 ml-1 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <Command>
          <CommandList>
            <CommandInput placeholder={t("searchLanguage")} className="h-9" />
            <CommandEmpty>{t("noLanguageFound")}</CommandEmpty>
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={(value) => {
                    setLanguage(value as "en" | "ru" | "uz")
                    setOpen(false)
                  }}
                >
                  {lang.label}
                  <Check className={cn("ml-auto h-4 w-4", language === lang.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

