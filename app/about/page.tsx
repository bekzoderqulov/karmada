"use client"

import Link from "next/link"
import { BookOpen, GraduationCap, Users, Award, Globe, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Link href="/" className="flex items-center text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToHome")}
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">{t("about")}</h1>
            <p className="text-xl text-muted-foreground mb-8">{t("aboutHeroText")}</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t("ourMission")}</h2>
              <p className="text-lg text-muted-foreground mb-6">{t("missionText1")}</p>
              <p className="text-lg text-muted-foreground mb-6">{t("missionText2")}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/courses">{t("viewCourses")}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">{t("contactUs")}</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px]">
              <img
                src="/placeholder.svg?height=400&width=600&text=IT+English+Academy"
                alt="IT English Academy"
                className="rounded-lg shadow-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <Card>
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">1,500+</h3>
                <p className="text-muted-foreground">{t("students")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">25+</h3>
                <p className="text-muted-foreground">{t("courses")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">20+</h3>
                <p className="text-muted-foreground">{t("qualifiedTeachers")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">5+</h3>
                <p className="text-muted-foreground">{t("yearsExperience")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("ourTeam")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("teamDescription")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Aziza Karimova",
                position: t("headTeacher"),
                bio: t("azizaBio"),
                image: "/placeholder.svg?height=300&width=300&text=Aziza",
              },
              {
                name: "Bobur Aliyev",
                position: t("itDepartmentHead"),
                bio: t("boburBio"),
                image: "/placeholder.svg?height=300&width=300&text=Bobur",
              },
              {
                name: "Malika Umarova",
                position: t("academicDepartmentHead"),
                bio: t("malikaBio"),
                image: "/placeholder.svg?height=300&width=300&text=Malika",
              },
            ].map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary mb-3">{member.position}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("ourValues")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("valuesDescription")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t("qualityEducation"),
                description: t("qualityEducationDesc"),
                icon: <CheckCircle className="h-10 w-10 text-primary" />,
              },
              {
                title: t("practicalSkills"),
                description: t("practicalSkillsDesc"),
                icon: <GraduationCap className="h-10 w-10 text-primary" />,
              },
              {
                title: t("internationalOpportunities"),
                description: t("internationalOpportunitiesDesc"),
                icon: <Globe className="h-10 w-10 text-primary" />,
              },
            ].map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">{t("joinOurTeam")}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{t("joinTeamDescription")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/courses">{t("viewCourses")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">{t("contactUs")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

