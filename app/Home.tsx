"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap, Languages, Laptop, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  {t("learnEnglishForIT")}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">{t("academyDescription")}</p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/courses">
                  <Button size="lg" className="px-8">
                    {t("viewCourses")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="px-8">
                    {t("contactUs")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <img
                alt={t("academyImageAlt")}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                width="550"
                height="310"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">{t("ourAdvantages")}</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t("whyChooseUs")}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("academyDescription")}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary p-3 text-primary-foreground">
                <Languages className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t("itEnglish")}</h3>
              <p className="text-center text-muted-foreground">{t("itEnglishDescription")}</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary p-3 text-primary-foreground">
                <Laptop className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t("modernTeaching")}</h3>
              <p className="text-center text-muted-foreground">{t("modernTeachingDescription")}</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary p-3 text-primary-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t("experiencedTeachers")}</h3>
              <p className="text-center text-muted-foreground">{t("experiencedTeachersDescription")}</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary p-3 text-primary-foreground">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t("practicalExercises")}</h3>
              <p className="text-center text-muted-foreground">{t("practicalExercisesDescription")}</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary p-3 text-primary-foreground">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t("smallGroups")}</h3>
              <p className="text-center text-muted-foreground">{t("smallGroupsDescription")}</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary p-3 text-primary-foreground">
                <ArrowRight className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t("guaranteedResult")}</h3>
              <p className="text-center text-muted-foreground">{t("guaranteedResultDescription")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular courses section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t("popularCourses")}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("explorePopularCourses")}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-lg border shadow-sm">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                  alt={t("englishBasics")}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  width="400"
                  height="225"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{t("englishBasics")}</h3>
                <p className="line-clamp-2 mt-2 text-muted-foreground">{t("englishBasicsDescription")}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-bold">{t("price1")}</div>
                  <Link href="/courses/1">
                    <Button size="sm">{t("details")}</Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border shadow-sm">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop"
                  alt={t("itEnglish")}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  width="400"
                  height="225"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{t("itEnglish")}</h3>
                <p className="line-clamp-2 mt-2 text-muted-foreground">{t("itEnglishDescription")}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-bold">{t("price2")}</div>
                  <Link href="/courses/2">
                    <Button size="sm">{t("details")}</Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border shadow-sm">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070&auto=format&fit=crop"
                  alt={t("webDevelopment")}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  width="400"
                  height="225"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{t("webDevelopment")}</h3>
                <p className="line-clamp-2 mt-2 text-muted-foreground">{t("webDevelopmentDescription")}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-bold">{t("price3")}</div>
                  <Link href="/courses/3">
                    <Button size="sm">{t("details")}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Link href="/courses">
              <Button size="lg" variant="outline">
                {t("viewAllCourses")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t("registerNow")}</h2>
              <p className="max-w-[900px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("registerNowDescription")}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="px-8">
                  {t("register")}
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-primary-foreground px-8">
                  {t("viewCourses")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 md:py-12 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">IT English Academy</h3>
              <p className="text-sm text-muted-foreground">{t("academyDescription")}</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">{t("pages")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground">
                    {t("courses")}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                    {t("contact")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">{t("contact")}</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">{t("address")}</li>
                <li className="text-sm text-muted-foreground">{t("phone")}</li>
                <li className="text-sm text-muted-foreground">{t("email")}</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">{t("socialMedia")}</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2023 IT English Academy. {t("allRightsReserved")}
          </div>
        </div>
      </footer>
    </div>
  )
}

