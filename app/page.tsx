"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowDownToLine, ArrowRight, ArrowUpRight, Code2, Menu, Network, X } from "lucide-react";
import { GitHubIcon, LinkedInIcon as Linkedin } from "@/components/social-icons";
import { NetworkVisual } from "@/components/network-visual";
import { PortfolioSections } from "@/components/portfolio-sections";
import { ContactSection } from "@/components/contact-section";
import { assetPath } from "@/lib/site-config";

import { isLanguage, LANGUAGES, type Language as Lang } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";
import { PhotoGallery } from "@/components/photo-gallery";
const linkedIn = "https://linkedin.com/in/artyom-shuvalov-0b9029332";
const nav = {
  en: ["Home", "About", "Experience", "Projects", "Skills", "Contact"],
  ru: ["Главная", "Обо мне", "Опыт", "Проекты", "Навыки", "Контакты"],
  es: ["Inicio", "Sobre mí", "Experiencia", "Proyectos", "Habilidades", "Contacto"],
};
const ids = ["home", "about", "experience", "projects", "skills", "contact"];

function Monogram() {
  return <svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 3 32 11v14L18 33 4 25V11L18 3Z" stroke="currentColor" strokeWidth="1.4"/><path d="m10 23 8-14 8 14M13 18h10M10 25l8 5 8-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>;
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const menuButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const t = siteCopy[lang];

  useEffect(() => {
    try { const saved = localStorage.getItem("portfolio-language"); if (isLanguage(saved)) setLang(saved); } catch { /* Storage is optional. */ }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-18% 0px -58% 0px" });
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("portfolio-language", lang); } catch { /* Storage is optional. */ }
  }, [lang]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleEscape(event: KeyboardEvent) { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">{t.skip}</a>
      <header className="site-header">
        <a className="brand" href="#home" aria-label={t.homeLabel} onClick={() => setMenuOpen(false)}><Monogram/><span>ARTEM<span className="brand-last"> SHUVALOV</span><small>{t.brandRole}</small></span></a>
        <nav className="desktop-nav" aria-label={t.navLabel}>
          {nav[lang].map((label, i) => <a key={ids[i]} href={`#${ids[i]}`} className={active === ids[i] ? "is-active" : ""} aria-current={active === ids[i] ? "location" : undefined}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <div className="language-switch" aria-label={t.languageLabel}>{LANGUAGES.map((language, index) => <span className="language-option" key={language}>{index > 0 && <span aria-hidden="true">/</span>}<button lang={language} aria-pressed={lang === language} onClick={() => setLang(language)}>{language.toUpperCase()}</button></span>)}</div>
          <div className="nav-social-links">
            <a className="nav-social" href={linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin size={16}/></a>
            <a className="nav-social" href="https://github.com/Tem0Key" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub · Tem0Key"><GitHubIcon size={17}/></a>
          </div>
          <a href="#contact" className="nav-connect">{t.connect}<ArrowUpRight size={15}/></a>
          <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? (t.closeMenu) : (t.openMenu)} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
        {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label={t.mobileNav}>{nav[lang].map((label, i) => <a key={ids[i]} href={`#${ids[i]}`} onClick={() => setMenuOpen(false)}><span className="mono">0{i + 1}</span>{label}<ArrowUpRight size={18}/></a>)}</nav>}
      </header>

      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-heading">
          <div className="hero-ambience" aria-hidden="true"/>
          <div className="hero-visual"><NetworkVisual/></div>
          <div className="hero-shade" aria-hidden="true"/>
          <div className="container hero-inner">
            <div className="hero-copy">
              <motion.div className="availability" initial={reduced ? false : {opacity: 0, y: 12}} animate={{opacity: 1, y: 0}} transition={{duration: .6}}><span className="status-dot"/>{t.availability}<ArrowUpRight size={12}/></motion.div>
              <h1 id="hero-heading">{t.heroFirst}<br/><span>{t.heroMiddle}</span><br/>{t.heroLast}<span className="hero-period">.</span></h1>
              <p className="hero-role">{t.role}<span/><span className="hero-role-detail">{t.roleDetail}</span></p>
              <p className="hero-description">{t.description}</p>
              <div className="hero-buttons"><a className="button-primary" href="#contact"><span>{t.workTogether}</span><span className="button-arrow"><ArrowUpRight size={20}/></span></a><a className="button-secondary" href="#projects">{t.viewWork}<ArrowRight size={17}/></a></div>
              <div className="hero-metrics">
                <div><strong>3,200<span>+</span></strong><p>{t.branches}</p></div>
                <div><strong>10<span>+</span></strong><p>{t.toolUsers}</p></div>
                <div><strong>02</strong><p>{t.projectCount}</p></div>
              </div>
            </div>
            <div className="hero-annotation" aria-hidden="true"><span className="annotation-line"/><span><span className="tiny-dot"/> {t.architecture}<small>{t.architectureDetail}</small></span></div>
            <a className="scroll-cue" href="#about"><span>{t.scroll}</span><ArrowDown size={14}/></a>
            <span className="hero-index mono" aria-hidden="true">01 — 06</span>
          </div>
        </section>

        <div className="tech-bar"><div className="container tech-bar-inner"><span className="tech-label">{t.stack}</span><div className="tech-names"><span className="tech-cisco">cisco<span className="cisco-bars" aria-hidden="true">▂▅▇▅▂</span></span><span className="tech-palo"><span aria-hidden="true">///</span> paloalto<small>NETWORKS</small></span><span className="tech-amicon"><Network size={22}/>AMICON</span><span className="tech-splunk">splunk<span>&gt;</span></span><span className="tech-python"><Code2 size={24}/>Python</span></div></div></div>

        <section id="about" className="section-shell about-section" aria-labelledby="about-title"><div className="container about-grid">
          <PhotoGallery lang={lang}/>
          <div className="about-copy"><p className="section-eyebrow"><span>01 /</span>{t.aboutEyebrow}</p><h2 id="about-title" className="section-title">{t.aboutFirst}<br/><span>{t.aboutLast}</span></h2><p className="about-lead">{t.aboutLead}</p><p className="body-muted">{t.aboutBody}</p><div className="about-principles"><div><span><Network size={19}/></span><p><strong>{t.principleOne}</strong><small>{t.principleOneDetail}</small></p></div><div><span><Code2 size={19}/></span><p><strong>{t.principleTwo}</strong><small>{t.principleTwoDetail}</small></p></div></div><div className="about-tags">{t.tags.map(t => <span key={t}>{t}</span>)}</div><a className="text-link" href={assetPath("/assets/Artyom_Shuvalov_CV_Eng.pdf")} download>{t.download}<ArrowDownToLine size={17}/><small>PDF · 4.1 MB</small></a></div>
        </div></section>

        <PortfolioSections lang={lang}/>
        <ContactSection lang={lang}/>
      </main>

      <footer className="site-footer"><div className="container"><a className="footer-brand" href="#home"><Monogram/><span>ARTEM SHUVALOV</span></a><p>© {new Date().getFullYear()} Artem Shuvalov<span>{t.footer}</span></p><a href="#home">{t.backTop}<ArrowUpRight size={15}/></a></div></footer>
    </MotionConfig>
  );
}
