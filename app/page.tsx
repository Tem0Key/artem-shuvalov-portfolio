"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowDownToLine, ArrowRight, ArrowUpRight, Code2, Menu, Network, X } from "lucide-react";
import { GitHubIcon, LinkedInIcon as Linkedin } from "@/components/social-icons";
import { NetworkVisual } from "@/components/network-visual";
import { PortfolioSections } from "@/components/portfolio-sections";
import { ContactSection } from "@/components/contact-section";

type Lang = "en" | "ru";
const linkedIn = "https://linkedin.com/in/artyom-shuvalov-0b9029332";
const nav = {
  en: ["Home", "About", "Experience", "Projects", "Skills", "Contact"],
  ru: ["Главная", "Обо мне", "Опыт", "Проекты", "Навыки", "Контакты"],
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
  const ru = lang === "ru";

  useEffect(() => {
    try { if (localStorage.getItem("portfolio-language") === "ru") setLang("ru"); } catch { /* Storage is optional. */ }
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
      <a className="skip-link" href="#main">{ru ? "Перейти к содержанию" : "Skip to content"}</a>
      <header className="site-header">
        <a className="brand" href="#home" aria-label={ru ? "Артём Шувалов — главная" : "Artem Shuvalov — home"} onClick={() => setMenuOpen(false)}><Monogram/><span>ARTEM<span className="brand-last"> SHUVALOV</span><small>NETWORK SECURITY ENGINEER</small></span></a>
        <nav className="desktop-nav" aria-label={ru ? "Основная навигация" : "Main navigation"}>
          {nav[lang].map((label, i) => <a key={ids[i]} href={`#${ids[i]}`} className={active === ids[i] ? "is-active" : ""} aria-current={active === ids[i] ? "location" : undefined}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <div className="language-switch" aria-label={ru ? "Язык" : "Language"}><button lang="en" aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button><span>/</span><button lang="ru" aria-pressed={lang === "ru"} onClick={() => setLang("ru")}>RU</button></div>
          <div className="nav-social-links">
            <a className="nav-social" href={linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin size={16}/></a>
            <a className="nav-social" href="https://github.com/Tem0Key" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub · Tem0Key"><GitHubIcon size={17}/></a>
          </div>
          <a href="#contact" className="nav-connect">{ru ? "На связи" : "Let’s connect"}<ArrowUpRight size={15}/></a>
          <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? (ru ? "Закрыть меню" : "Close menu") : (ru ? "Открыть меню" : "Open menu")} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
        {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label={ru ? "Мобильная навигация" : "Mobile navigation"}>{nav[lang].map((label, i) => <a key={ids[i]} href={`#${ids[i]}`} onClick={() => setMenuOpen(false)}><span className="mono">0{i + 1}</span>{label}<ArrowUpRight size={18}/></a>)}</nav>}
      </header>

      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-heading">
          <div className="hero-ambience" aria-hidden="true"/>
          <div className="hero-visual"><NetworkVisual/></div>
          <div className="hero-shade" aria-hidden="true"/>
          <div className="container hero-inner">
            <div className="hero-copy">
              <motion.div className="availability" initial={reduced ? false : {opacity: 0, y: 12}} animate={{opacity: 1, y: 0}} transition={{duration: .6}}><span className="status-dot"/>{ru ? "ОТКРЫТ К ПРЕДЛОЖЕНИЯМ" : "OPEN TO OPPORTUNITIES"}<ArrowUpRight size={12}/></motion.div>
              <h1 id="hero-heading">{ru ? <>{"Безопасные сети."}<br/><span>Автоматизация</span><br/>операций<span className="hero-period">.</span></> : <>Securing Networks.<br/><span>Automating</span><br/>Operations<span className="hero-period">.</span></>}</h1>
              <p className="hero-role">{ru ? "Сетевая безопасность" : "Network Security Engineer"}<span/><span className="hero-role-detail">{ru ? "Межсетевые экраны и VPN" : "Firewall & VPN Infrastructure"}</span></p>
              <p className="hero-description">{ru ? "Помогаю обеспечивать безопасность инфраструктуры 3 200+ отделений. Межсетевые экраны, защищённые соединения и автоматизация, которая упрощает работу." : "Securing infrastructure across 3,200+ branch offices. Enterprise firewalls, reliable connectivity, and automation that makes operations work better."}</p>
              <div className="hero-buttons"><a className="button-primary" href="#contact"><span>{ru ? "Давайте работать вместе" : "Let’s work together"}</span><span className="button-arrow"><ArrowUpRight size={20}/></span></a><a className="button-secondary" href="#projects">{ru ? "Мои проекты" : "View my work"}<ArrowRight size={17}/></a></div>
              <div className="hero-metrics">
                <div><strong>3,200<span>+</span></strong><p>{ru ? "Отделений в инфраструктуре" : "Branch offices supported"}</p></div>
                <div><strong>10<span>+</span></strong><p>{ru ? "Пользователей платформы" : "Internal tool users"}</p></div>
                <div><strong>02</strong><p>{ru ? "Проекта автоматизации" : "Featured automation projects"}</p></div>
              </div>
            </div>
            <div className="hero-annotation" aria-hidden="true"><span className="annotation-line"/><span><span className="tiny-dot"/> {ru ? "АРХИТЕКТУРА ЗАЩИЩЁННОЙ СЕТИ" : "SECURE NETWORK ARCHITECTURE"}<small>{ru ? "СВЯЗНОСТЬ. НАДЁЖНОСТЬ. КОНТРОЛЬ." : "CONNECTED. RESILIENT. CONTROLLED."}</small></span></div>
            <a className="scroll-cue" href="#about"><span>{ru ? "УЗНАТЬ БОЛЬШЕ" : "SCROLL TO EXPLORE"}</span><ArrowDown size={14}/></a>
            <span className="hero-index mono" aria-hidden="true">01 — 06</span>
          </div>
        </section>

        <div className="tech-bar"><div className="container tech-bar-inner"><span className="tech-label">{ru ? "В РАБОЧЕМ СТЕКЕ" : "WORKING ACROSS THE STACK"}</span><div className="tech-names"><span className="tech-cisco">cisco<span className="cisco-bars" aria-hidden="true">▂▅▇▅▂</span></span><span className="tech-palo"><span aria-hidden="true">///</span> paloalto<small>NETWORKS</small></span><span className="tech-amicon"><Network size={22}/>AMICON</span><span className="tech-splunk">splunk<span>&gt;</span></span><span className="tech-python"><Code2 size={24}/>Python</span></div></div></div>

        <section id="about" className="section-shell about-section" aria-labelledby="about-title"><div className="container about-grid">
          <div className="about-images"><div className="about-image-main"><img src="/assets/artem-portrait.webp" alt={ru ? "Портрет Артёма Шувалова" : "Portrait of Artem Shuvalov"} width="791" height="996" loading="lazy"/><div className="portrait-caption"><span className="status-dot"/><span>{ru ? "АРТЁМ ШУВАЛОВ" : "ARTEM SHUVALOV"}<small>{ru ? "СЕТЕВАЯ БЕЗОПАСНОСТЬ" : "NETWORK SECURITY ENGINEER"}</small></span><ArrowUpRight size={21}/></div></div><div className="about-image-secondary"><img src="/assets/artem-window.webp" alt={ru ? "Артём у окна" : "Artem beside a window"} width="626" height="671" loading="lazy"/></div><div className="image-corner" aria-hidden="true"/></div>
          <div className="about-copy"><p className="section-eyebrow"><span>01 /</span>{ru ? "ОБО МНЕ" : "THE ENGINEER BEHIND THE NETWORK"}</p><h2 id="about-title" className="section-title">{ru ? <>Безопасные сети.<br/><span>Надёжная основа.</span></> : <>Engineering secure,<br/><span>reliable networks.</span></>}</h2><p className="about-lead">{ru ? "Я Артём — инженер сетевой безопасности, который объединяет инфраструктуру, безопасность и код." : "I’m Artem — a network security engineer working at the intersection of infrastructure, security, and code."}</p><p className="body-muted">{ru ? "Мой опыт охватывает администрирование Amicon FPSU, VPN-инфраструктуру и настройку межсетевых экранов. Работаю с Cisco ASA, Palo Alto Networks и Cisco Firepower, а также с SecurityVision NDR для анализа сетевой активности." : "My experience spans Amicon FPSU administration, VPN infrastructure, and firewall configuration. I work with Cisco ASA, Palo Alto Networks, and Cisco Firepower, alongside SecurityVision NDR for network visibility."}</p><div className="about-principles"><div><span><Network size={19}/></span><p><strong>{ru ? "Надёжная инфраструктура" : "Infrastructure that holds up"}</strong><small>{ru ? "Защищённые соединения. Устойчивые сети." : "Secure connectivity. Reliable networks."}</small></p></div><div><span><Code2 size={19}/></span><p><strong>{ru ? "Меньше рутины. Больше смысла." : "Less repetition. More engineering."}</strong><small>{ru ? "Автоматизация на Python и JavaScript." : "Practical Python and JavaScript automation."}</small></p></div></div><div className="about-tags">{(ru ? ["Межсетевые экраны", "VPN", "NDR", "Автоматизация"] : ["Enterprise firewalls", "VPN & connectivity", "NDR", "Automation"]).map(t => <span key={t}>{t}</span>)}</div><a className="text-link" href="/assets/Artyom_Shuvalov_CV_Eng.pdf" download>{ru ? "Скачать резюме (EN)" : "Download my résumé"}<ArrowDownToLine size={17}/><small>PDF · 4.1 MB</small></a></div>
        </div></section>

        <PortfolioSections lang={lang}/>
        <ContactSection lang={lang}/>
      </main>

      <footer className="site-footer"><div className="container"><a className="footer-brand" href="#home"><Monogram/><span>ARTEM SHUVALOV</span></a><p>© {new Date().getFullYear()} Artem Shuvalov<span>{ru ? "Продумано. Спроектировано. Защищено." : "Built with intent. Engineered for trust."}</span></p><a href="#home">{ru ? "Наверх" : "Back to top"}<ArrowUpRight size={15}/></a></div></footer>
    </MotionConfig>
  );
}
