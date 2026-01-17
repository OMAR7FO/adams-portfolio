import { useState, useEffect, useRef } from 'react'
import './App.css'
import { translations } from './translations'
import type { Language } from './translations'

function App() {
  const [language, setLanguage] = useState<Language>('ar')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    sector: '',
    quantity: '',
    message: ''
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})

  const t = translations[language]
  const isRTL = language === 'ar'

  useEffect(() => {
    // Update document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language, isRTL])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      Object.entries(sectionsRef.current).forEach(([key, element]) => {
        if (element && element instanceof HTMLElement) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(key)
          }
        }
      })
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
      '.section-header, .sector-card, .portfolio-item, .process-step'
    )
    animatableElements.forEach((el) => observer.observe(el))

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert(t.contact.success)
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      sector: '',
      quantity: '',
      message: ''
    })
  }

  const scrollToSection = (sectionId: string) => {
    const element = sectionsRef.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en')
  }

  return (
    <div className={`app ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => scrollToSection('hero')}>
            <span className="logo-text">ADAMS</span>
            <span className="logo-subtitle">UNIFORMS</span>
          </div>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#hero" onClick={() => scrollToSection('hero')} className={activeSection === 'hero' ? 'active' : ''}>{t.nav.home}</a></li>
            <li><a href="#sectors" onClick={() => scrollToSection('sectors')} className={activeSection === 'sectors' ? 'active' : ''}>{t.nav.sectors}</a></li>
            <li><a href="#portfolio" onClick={() => scrollToSection('portfolio')} className={activeSection === 'portfolio' ? 'active' : ''}>{t.nav.portfolio}</a></li>
            <li><a href="#process" onClick={() => scrollToSection('process')} className={activeSection === 'process' ? 'active' : ''}>{t.nav.process}</a></li>
            <li><a href="#contact" onClick={() => scrollToSection('contact')} className={activeSection === 'contact' ? 'active' : ''}>{t.nav.contact}</a></li>
          </ul>
          <div className="nav-actions">
            <button className="language-toggle" onClick={toggleLanguage} aria-label="Toggle language">
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            <button className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero" ref={(el: HTMLElement | null) => { sectionsRef.current['hero'] = el }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">{t.hero.title1}</span>
              <span className="title-line">{t.hero.title2}</span>
            </h1>
            <p className="hero-subtitle">
              {t.hero.subtitle}
            </p>
            <button className="cta-button" onClick={() => scrollToSection('contact')}>
              <span>{t.hero.cta}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={isRTL ? 'flip' : ''}>
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
        </div>
      </section>

      {/* Our Sectors */}
      <section id="sectors" className="sectors" ref={(el: HTMLElement | null) => { sectionsRef.current['sectors'] = el }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.sectors.title}</h2>
            <p className="section-subtitle">{t.sectors.subtitle}</p>
          </div>
          <div className="sectors-grid">
            <div className="sector-card">
              <div className="sector-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
              </div>
              <h3>{t.sectors.schoolwear.title}</h3>
              <p>{t.sectors.schoolwear.description}</p>
            </div>
            <div className="sector-card">
              <div className="sector-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>{t.sectors.corporate.title}</h3>
              <p>{t.sectors.corporate.description}</p>
            </div>
            <div className="sector-card">
              <div className="sector-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3>{t.sectors.workwear.title}</h3>
              <p>{t.sectors.workwear.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio/Gallery */}
      <section id="portfolio" className="portfolio" ref={(el: HTMLElement | null) => { sectionsRef.current['portfolio'] = el }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.portfolio.title}</h2>
            <p className="section-subtitle">{t.portfolio.subtitle}</p>
          </div>
          <div className="portfolio-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="portfolio-item">
                <div className="portfolio-image">
                  <div className="image-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                  </div>
                  <div className="portfolio-overlay">
                    <span>{t.portfolio.viewDetails}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Adams Process */}
      <section id="process" className="process" ref={(el: HTMLElement | null) => { sectionsRef.current['process'] = el }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.process.title}</h2>
            <p className="section-subtitle">{t.process.subtitle}</p>
          </div>
          <div className="process-timeline">
            <div className="process-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>{t.process.step1.title}</h3>
                <p>{t.process.step1.description}</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>{t.process.step2.title}</h3>
                <p>{t.process.step2.description}</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>{t.process.step3.title}</h3>
                <p>{t.process.step3.description}</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3>{t.process.step4.title}</h3>
                <p>{t.process.step4.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Inquiry Form */}
      <section id="contact" className="contact" ref={(el: HTMLElement | null) => { sectionsRef.current['contact'] = el }}>
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <h2 className="section-title">{t.contact.title}</h2>
              <p className="contact-description">
                {t.contact.description}
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <h4>{t.contact.location}</h4>
                    <p style={{ whiteSpace: 'pre-line' }}>{t.contact.locationValue}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <div>
                    <h4>{t.contact.phone}</h4>
                    <p>+963 934448887</p>
                  </div>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <div>
                    <h4>{t.contact.email}</h4>
                    <p>fostokomar@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>{t.contact.formTitle}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{t.contact.form.name} {t.contact.form.required}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t.contact.form.email} {t.contact.form.required}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">{t.contact.form.phone} {t.contact.form.required}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="company">{t.contact.form.company}</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sector">{t.contact.form.sector} {t.contact.form.required}</label>
                  <select
                    id="sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{t.contact.form.selectSector}</option>
                    <option value="schoolwear">{t.sectors.schoolwear.title}</option>
                    <option value="corporate">{t.sectors.corporate.title}</option>
                    <option value="workwear">{t.sectors.workwear.title}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">{t.contact.form.quantity}</label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder={t.contact.form.quantityPlaceholder}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">{t.contact.form.message} {t.contact.form.required}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  required
                  placeholder={t.contact.form.messagePlaceholder}
                ></textarea>
              </div>
              <button type="submit" className="submit-button">
                <span>{t.contact.form.submit}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={isRTL ? 'flip' : ''}>
                  <path d="M3 10H17M17 10L12 5M17 10L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-text">ADAMS</span>
              <span className="logo-subtitle">UNIFORMS</span>
            </div>
            <p className="footer-text">{t.footer.tagline}</p>
            <p className="footer-copyright">{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
