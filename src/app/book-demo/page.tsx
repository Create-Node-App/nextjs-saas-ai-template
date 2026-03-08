'use client';

import { BookOpen, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { AppLogo } from '@/shared/components/brand/Logo';
import { Button } from '@/shared/components/ui';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';

export default function BookDemoPage() {
  const t = useTranslations('bookDemo');
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    jobTitle: '',
    companySize: '',
    interests: [] as string[],
    message: '',
    preferredDate: '',
    preferredTime: '',
    timezone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would send the data to your backend
      console.log('Form submitted:', formData);

      // Show success message (you can replace this with a toast notification)
      alert(t('successMessage'));

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
        jobTitle: '',
        companySize: '',
        interests: [] as string[],
        message: '',
        preferredDate: '',
        preferredTime: '',
        timezone: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const interestOptions = [
    { value: 'skills', label: t('interestSkillsManagement') },
    { value: 'career', label: t('interestCareerGrowth') },
    { value: 'team', label: t('interestTeamDevelopment') },
    { value: 'ai', label: t('interestAIAssistant') },
  ];

  const companySizeOptions = [
    { value: 'small', label: t('companySizeSmall') },
    { value: 'medium', label: t('companySizeMedium') },
    { value: 'large', label: t('companySizeLarge') },
    { value: 'xl', label: t('companySizeXL') },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <AppLogo href="/" size="md" />
          <Link href="/">
            <Button variant="outline" size="sm">
              {locale === 'es' ? 'Volver' : 'Back'}
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-background via-background to-muted/30 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mx-auto max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <BookOpen className="h-4 w-4" aria-hidden />
                {t('pageTitle')}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">{t('heroTitle')}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">{t('heroSubtitle')}</p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-2">{t('formTitle')}</h2>
                  <p className="text-muted-foreground mb-8">{t('formDescription')}</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          {t('firstName')} *
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder={t('firstNamePlaceholder')}
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          {t('lastName')} *
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder={t('lastNamePlaceholder')}
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          {t('email')} *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={t('emailPlaceholder')}
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          {t('phone')}
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder={t('phonePlaceholder')}
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Company & Job Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-medium">
                          {t('company')} *
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          placeholder={t('companyPlaceholder')}
                          value={formData.company}
                          onChange={handleInputChange}
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle" className="text-sm font-medium">
                          {t('jobTitle')} *
                        </Label>
                        <Input
                          id="jobTitle"
                          name="jobTitle"
                          placeholder={t('jobTitlePlaceholder')}
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          required
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Company Size */}
                    <div className="space-y-2">
                      <Label htmlFor="companySize" className="text-sm font-medium">
                        {t('companySize')} *
                      </Label>
                      <Select
                        value={formData.companySize}
                        onValueChange={(value) => handleSelectChange('companySize', value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder={t('companySize')} />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Interests */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">{t('interests')}</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {interestOptions.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.interests.includes(option.value)}
                              onChange={() => handleInterestChange(option.value)}
                              className="rounded"
                            />
                            <span className="text-sm font-medium">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        {t('message')}
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={t('messagePlaceholder')}
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="resize-none rounded-lg"
                      />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate" className="text-sm font-medium">
                          {t('preferredDate')}
                        </Label>
                        <Input
                          id="preferredDate"
                          name="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredTime" className="text-sm font-medium">
                          {t('preferredTime')}
                        </Label>
                        <Input
                          id="preferredTime"
                          name="preferredTime"
                          type="time"
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-sm font-medium">
                        {t('timezone')}
                      </Label>
                      <Input
                        id="timezone"
                        name="timezone"
                        placeholder="UTC-3 (America/Argentina/Buenos_Aires)"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="rounded-lg"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" disabled={isSubmitting} size="lg" className="w-full rounded-lg">
                      {isSubmitting ? t('submitting') : t('submit')}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="space-y-8">
                {/* Benefits Card */}
                <div className="bg-muted/30 border border-border/50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6">{t('benefits.title')}</h3>
                  <ul className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <li key={i} className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/20">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{t(`benefits.item${i}`)}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Features Card */}
                <div className="bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6">{t('features.title')}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-primary font-bold">→</span>
                      <span>{t('features.skillsManagement')}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-primary font-bold">→</span>
                      <span>{t('features.careerPaths')}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-primary font-bold">→</span>
                      <span>{t('features.peopleFinder')}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-primary font-bold">→</span>
                      <span>{t('features.analytics')}</span>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {locale === 'es' ? 'O contáctanos directamente' : 'Or reach out to us'}
                  </p>
                  <div className="space-y-2">
                    <a
                      href="mailto:demos@example.com"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" aria-hidden />
                      demos@example.com
                    </a>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" aria-hidden />
                      Buenos Aires, Argentina
                    </p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" aria-hidden />
                      +54 11 1234-5678
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Agentic A8n Hub. {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
