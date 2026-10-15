"use client";

import { Activity, ArrowDownRight, ArrowUpRight, Braces, Check, ChevronDown, FileCode2, GraduationCap, Network, Radar, Route, Terminal, Workflow } from "lucide-react";
import "./portfolio-sections.css";
import { portfolioEs } from "@/lib/portfolio-es";
import { assetPath } from "@/lib/site-config";
import type { Language } from "@/lib/i18n";

const copy = {
  es: portfolioEs,
  en: {
    experienceEyebrow: "02 / Experience",
    experienceTitle: "Experience built on real infrastructure.",
    experienceIntro: "Enterprise infrastructure. Complex incidents. Tools that make everyday operations better.",
    sberRole: "Senior Network & Security Engineer",
    sberDate: "Mar 2024 — Sep 2026",
    sberSummary: "Supporting the security infrastructure behind 3,200+ branch offices.",
    sberPoints: [
      ["Secure connectivity", "Administered Amicon FPSU central nodes, VPN tunnels, cryptographic keys, and routing. Investigated connectivity outages and restored secure network operations."],
      ["Enterprise firewalls", "Independently configured Cisco ASA policies, ACLs, and routing across firewall contexts. Worked with Palo Alto Networks NGFW on policies, traffic analysis, threat prevention, and troubleshooting."],
      ["Security operations", "Investigated suspicious traffic and supported incident triage and NDR workflows using SecurityVision, Splunk, Zabbix, and Grafana."],
      ["Operational automation", "Built an internal JavaScript platform used by 10+ department employees. Expansion into a dedicated application was approved and is planned for approximately 40 additional prospective users; the expansion has not been completed."],
    ],
    stcRole: "Software Engineer",
    stcDate: "Oct 2023 — Feb 2024",
    stcSummary: "Turning unstructured exports into useful, structured data.",
    stcPoints: [
      ["Python automation", "Developed scripts using regular expressions to extract relevant information from JSON exports."],
      ["Data processing", "Automated filtering, cleaning, and transformation into structured JSON outputs."],
    ],
    details: "Explore the work",
    projectsEyebrow: "03 / Selected projects",
    projectsTitle: "Building tools that solve real problems.",
    projectsIntro: "Practical automation, built around the problems I encountered in security engineering.",
    demo: "Illustrative preview",
    deviation: "DEVIATION IDENTIFIED",
    project1Title: "Configuration audit,\nautomated.",
    project1Name: "Automated FPSU Configuration Audit Tool",
    project1Body: "A Python utility that compares Amicon FPSU configurations with reference files to surface deviations and potential misconfigurations.",
    project1Highlights: ["Compare device configurations against a reference", "Audit selected configuration sections", "Identify deviations for targeted security reviews"],
    project2Title: "Operations,\nconnected.",
    project2Name: "Security Operations Automation Platform",
    project2Body: "An internal platform for service request generation, equipment failure tracking, and operational records. Deployed to 10+ department employees.",
    project2Highlights: ["Generate service requests from a consistent workflow", "Track equipment failures and operational records", "Approved expansion: approximately 40 additional prospective users; not yet completed"],
    highlights: "Technical highlights",
    pythonTag: "Configuration analysis",
    internalTag: "Internal tooling",
    dashboardTitle: "Operations workspace",
    dashboardLabel: "SERVICE WORKFLOW",
    dashboardActive: "In progress",
    dashboardReview: "Under review",
    dashboardDone: "Recorded",
    dashboardRows: ["Service request", "Equipment diagnosis", "Operational record"],
    users: "deployed users",
    skillsEyebrow: "04 / Technical toolkit",
    skillsTitle: "Deep focus.\nConnected expertise.",
    skillsIntro: "The technologies and workflows I use to keep infrastructure secure, available, and easier to operate.",
    skillGroups: [
      { title: "Network security", description: "Policy, traffic, and protection", tags: ["Cisco ASA", "Cisco Firepower / FTD", "Palo Alto NGFW", "Panorama", "Firewall policies", "ACLs", "NAT", "Segmentation", "Threat prevention"] },
      { title: "Security operations", description: "From signals to investigation", tags: ["SecurityVision", "Splunk", "Zabbix", "Grafana", "Incident triage", "NDR workflows"] },
      { title: "Networking & VPN", description: "Reliable, secure connectivity", tags: ["Amicon FPSU", "IPsec", "GlobalProtect", "VPN tunnels", "Routing", "TCP/IP", "DNS", "DHCP", "VLAN", "VRF", "Cryptographic keys", "Outage recovery"] },
      { title: "Automation & diagnostics", description: "Useful tools, practical outcomes", tags: ["Python", "JavaScript", "HTML / CSS", "Regex", "JSON", "Wireshark", "tcpdump", "Nmap", "Git", "Windows", "Linux (basic)", "Traffic analysis"] },
    ],
    educationEyebrow: "05 / Education & growth",
    educationTitle: "A strong foundation.\nA learning mindset.",
    educationLabel: "Education",
    masters: "Master’s · Information Security",
    itmo: "ITMO University",
    mastersDate: "Sep 2023 — Jul 2025",
    mastersThesis: "Thesis: Python and machine learning for SYN flood detection using packet captures.",
    bachelors: "Bachelor’s · Information Security",
    gut: "St. Petersburg State University of Telecommunications",
    bachelorsDate: "Sep 2019 — Jul 2023",
    bachelorsThesis: "Thesis: AES-256 encryption and linear functions.",
    certificationsLabel: "Certifications & additional learning",
    certs: [
      { title: "Traffic Filtering · ANT0011", provider: "AntColony", date: "2025" },
      { title: "Firewall 10: Problem Solving & Troubleshooting", provider: "MasterLab", date: "2025" },
      { title: "Data Analysis", provider: "ITMO · Bonus Track", date: "2024" },
    ],
    languagesLabel: "Languages",
    languages: [["Russian", "Native"], ["English", "B2"], ["Spanish", "B1"]],
  },
  ru: {
    experienceEyebrow: "02 / Опыт",
    experienceTitle: "Опыт работы с реальной инфраструктурой.",
    experienceIntro: "Корпоративная инфраструктура. Сложные инциденты. Инструменты, которые упрощают ежедневную работу.",
    sberRole: "Старший инженер по сетевой и информационной безопасности",
    sberDate: "Март 2024 — Сентябрь 2026",
    sberSummary: "Поддержка инфраструктуры безопасности более 3 200 отделений.",
    sberPoints: [
      ["Защищённая связность", "Администрировал центральные узлы Амикон ФПСУ, VPN-туннели, криптографические ключи и маршрутизацию. Устранял сбои связности и восстанавливал защищённое взаимодействие."],
      ["Межсетевые экраны", "Самостоятельно настраивал политики, ACL и маршрутизацию Cisco ASA в разных контекстах. Работал с Palo Alto Networks NGFW: политики, анализ трафика, предотвращение угроз и диагностика."],
      ["Мониторинг безопасности", "Анализировал подозрительный трафик, участвовал в первичной обработке инцидентов и NDR-процессах с помощью SecurityVision, Splunk, Zabbix и Grafana."],
      ["Автоматизация процессов", "Разработал внутреннюю JavaScript-платформу для более 10 сотрудников отдела. Расширение в отдельное приложение примерно для 40 дополнительных потенциальных пользователей согласовано и запланировано, но ещё не завершено."],
    ],
    stcRole: "Инженер-программист",
    stcDate: "Октябрь 2023 — Февраль 2024",
    stcSummary: "Преобразование исходных выгрузок в полезные структурированные данные.",
    stcPoints: [
      ["Автоматизация на Python", "Разрабатывал скрипты с регулярными выражениями для извлечения необходимой информации из JSON-выгрузок."],
      ["Обработка данных", "Автоматизировал фильтрацию, очистку и преобразование данных в структурированный JSON."],
    ],
    details: "Подробнее о работе",
    projectsEyebrow: "03 / Избранные проекты",
    projectsTitle: "Инструменты, которые решают реальные задачи.",
    projectsIntro: "Практическая автоматизация задач, с которыми я сталкивался в работе инженера по безопасности.",
    demo: "Демонстрация интерфейса",
    deviation: "ОБНАРУЖЕНО ОТКЛОНЕНИЕ",
    project1Title: "Аудит конфигураций.\nАвтоматически.",
    project1Name: "Инструмент аудита конфигураций ФПСУ",
    project1Body: "Python-утилита для сравнения конфигураций Амикон ФПСУ с эталонными файлами и выявления отклонений и потенциальных ошибок настройки.",
    project1Highlights: ["Сравнение конфигураций устройств с эталоном", "Выборочная проверка разделов конфигурации", "Выявление отклонений для целевого анализа настроек безопасности"],
    project2Title: "Операционные процессы.\nВ единой системе.",
    project2Name: "Платформа автоматизации операций безопасности",
    project2Body: "Внутренняя платформа для формирования сервисных заявок, учёта отказов оборудования и оперативных записей. Используется более чем 10 сотрудниками отдела.",
    project2Highlights: ["Единый процесс формирования сервисных заявок", "Учёт отказов оборудования и оперативных записей", "Расширение примерно на 40 потенциальных пользователей согласовано, но ещё не завершено"],
    highlights: "Технические детали",
    pythonTag: "Анализ конфигураций",
    internalTag: "Внутренний инструмент",
    dashboardTitle: "Операционная панель",
    dashboardLabel: "ОБРАБОТКА ЗАЯВОК",
    dashboardActive: "В работе",
    dashboardReview: "Проверка",
    dashboardDone: "Записано",
    dashboardRows: ["Сервисная заявка", "Диагностика оборудования", "Оперативная запись"],
    users: "пользователей",
    skillsEyebrow: "04 / Технологии и навыки",
    skillsTitle: "Глубокая экспертиза.\nСистемный подход.",
    skillsIntro: "Технологии и процессы, которые помогают мне обеспечивать безопасность, доступность и удобство эксплуатации инфраструктуры.",
    skillGroups: [
      { title: "Сетевая безопасность", description: "Политики, трафик и защита", tags: ["Cisco ASA", "Cisco Firepower / FTD", "Palo Alto NGFW", "Panorama", "Политики МЭ", "ACL", "NAT", "Сегментация", "Предотвращение угроз"] },
      { title: "Операции безопасности", description: "От сигналов к расследованию", tags: ["SecurityVision", "Splunk", "Zabbix", "Grafana", "Анализ инцидентов", "NDR"] },
      { title: "Сети и VPN", description: "Надёжная защищённая связность", tags: ["Амикон ФПСУ", "IPsec", "GlobalProtect", "VPN-туннели", "Маршрутизация", "TCP/IP", "DNS", "DHCP", "VLAN", "VRF", "Криптографические ключи", "Восстановление связи"] },
      { title: "Автоматизация и диагностика", description: "Инструменты для реальных задач", tags: ["Python", "JavaScript", "HTML / CSS", "Regex", "JSON", "Wireshark", "tcpdump", "Nmap", "Git", "Windows", "Linux (базовый)", "Анализ трафика"] },
    ],
    educationEyebrow: "05 / Образование и развитие",
    educationTitle: "Прочная основа.\nПостоянное развитие.",
    educationLabel: "Образование",
    masters: "Магистратура · Информационная безопасность",
    itmo: "Университет ИТМО",
    mastersDate: "Сентябрь 2023 — Июль 2025",
    mastersThesis: "ВКР: обнаружение SYN flood на основе захваченного трафика с помощью Python и машинного обучения.",
    bachelors: "Бакалавриат · Информационная безопасность",
    gut: "Санкт-Петербургский государственный университет телекоммуникаций",
    bachelorsDate: "Сентябрь 2019 — Июль 2023",
    bachelorsThesis: "ВКР: шифрование AES-256 и линейные функции.",
    certificationsLabel: "Сертификаты и дополнительное обучение",
    certs: [
      { title: "Фильтрация трафика · ANT0011", provider: "AntColony", date: "2025" },
      { title: "Firewall 10: решение проблем и диагностика", provider: "MasterLab", date: "2025" },
      { title: "Анализ данных", provider: "ИТМО · Bonus Track", date: "2024" },
    ],
    languagesLabel: "Языки",
    languages: [["Русский", "Родной"], ["Английский", "B2"], ["Испанский", "B1"]],
  },
};

const skillIcons = [Network, Radar, Route, Braces];

function Heading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="ps-heading">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title ps-title">{title}</h2>
      {description && <p className="ps-section-description">{description}</p>}
    </div>
  );
}

function Highlights({ title, items }: { title: string; items: string[] }) {
  return (
    <details className="ps-project-details">
      <summary>{title}<ChevronDown size={16} aria-hidden="true" /></summary>
      <ul>{items.map((item) => <li key={item}><Check size={14} aria-hidden="true" /><span>{item}</span></li>)}</ul>
    </details>
  );
}

export function PortfolioSections({ lang }: { lang: Language }) {
  const t = copy[lang];
  return (
    <div className="container ps-sections">
      <section className="section-shell ps-experience" id="experience" aria-label={t.experienceTitle}>
        <Heading eyebrow={t.experienceEyebrow} title={t.experienceTitle} description={t.experienceIntro} />
        <div className="ps-timeline">
          <article className="ps-timeline-item ps-timeline-item-featured">
            <div className="ps-timeline-period"><span className="ps-node" /><span>{t.sberDate}</span><span className="ps-period-index">01 / 02</span></div>
            <details className="ps-job" open>
              <summary>
                <div className="ps-job-brand"><a className="ps-company-link" href="https://www.sberbank.ru/en/individualclients/bankdetails" target="_blank" rel="noopener noreferrer" onClick={event => event.stopPropagation()}><span className="ps-company-mark ps-sber-mark"><img src={assetPath("/assets/logos/sber.png")} alt="" width="32" height="32" loading="lazy"/></span><span className="ps-company-name">{lang === "ru" ? "Сбер" : "Sberbank"}</span><ArrowUpRight size={16} aria-hidden="true"/></a></div>
                <h3>{t.sberRole}</h3>
                <p className="ps-job-summary">{t.sberSummary}</p>
                <span className="ps-expand-label">{t.details}<ChevronDown size={15} aria-hidden="true" /></span>
              </summary>
              <div className="ps-job-body">
                {t.sberPoints.map(([title, text], i) => <div className="ps-job-point" key={title}><span className="ps-point-number">0{i + 1}</span><div><h4>{title}</h4><p>{text}</p></div></div>)}
                <div className="ps-job-tags"><span>Amicon FPSU</span><span>Cisco ASA</span><span>Palo Alto</span><span>Splunk</span><span>JavaScript</span></div>
              </div>
            </details>
          </article>
          <article className="ps-timeline-item">
            <div className="ps-timeline-period"><span className="ps-node" /><span>{t.stcDate}</span><span className="ps-period-index">02 / 02</span></div>
            <details className="ps-job">
              <summary>
                <div className="ps-job-brand"><a className="ps-company-link" href="https://www.stc-spb.ru/company/" target="_blank" rel="noopener noreferrer" onClick={event => event.stopPropagation()}><span className="ps-company-mark"><img src={assetPath("/assets/logos/stc.png")} alt="" width="32" height="32" loading="lazy"/></span><span className="ps-company-name">{lang === "ru" ? "СТЦ" : "STC"}</span><ArrowUpRight size={16} aria-hidden="true"/></a></div>
                <h3>{t.stcRole}</h3>
                <p className="ps-job-summary">{t.stcSummary}</p>
                <span className="ps-expand-label">{t.details}<ChevronDown size={15} aria-hidden="true" /></span>
              </summary>
              <div className="ps-job-body">
                {t.stcPoints.map(([title, text], i) => <div className="ps-job-point" key={title}><span className="ps-point-number">0{i + 1}</span><div><h4>{title}</h4><p>{text}</p></div></div>)}
                <div className="ps-job-tags"><span>Python</span><span>Regex</span><span>JSON</span></div>
              </div>
            </details>
          </article>
        </div>
      </section>

      <section className="section-shell ps-projects" id="projects" aria-label={t.projectsTitle}>
        <Heading eyebrow={t.projectsEyebrow} title={t.projectsTitle} description={t.projectsIntro} />
        <div className="ps-project-grid">
          <article className="ps-project-card ps-project-audit">
            <div className="ps-project-topline"><span><Terminal size={14} aria-hidden="true" /> PYTHON / 01</span><ArrowDownRight size={21} aria-hidden="true" /></div>
            <h3 className="ps-project-title">{t.project1Title}</h3>
            <div className="ps-terminal-preview" aria-label={t.demo}>
              <div className="ps-window-top"><span className="ps-window-dots"><i /><i /><i /></span><span>fpsu-audit.py</span><span className="ps-demo-label">{t.demo}</span></div>
              <div className="ps-terminal-body">
                <p className="ps-command"><span>›</span> python audit.py --section vpn</p>
                <p className="ps-code-comment"># compare / reference → device</p>
                <p className="ps-code-line"><span className="ps-code-number">01</span><span className="ps-code-purple">section</span> vpn_config:</p>
                <p className="ps-code-line"><span className="ps-code-number">02</span><span className="ps-code-neutral">&nbsp;&nbsp;interface:</span> tunnel_01</p>
                <p className="ps-code-line ps-code-delete"><span className="ps-code-number">−</span>&nbsp;&nbsp;policy: default</p>
                <p className="ps-code-line ps-code-add"><span className="ps-code-number">+</span>&nbsp;&nbsp;policy: reference</p>
                <p className="ps-code-line"><span className="ps-code-number">05</span><span className="ps-code-neutral">&nbsp;&nbsp;route:</span> reviewed</p>
                <div className="ps-terminal-result"><span className="ps-result-dot" /> {t.deviation} <span>↗</span></div>
              </div>
            </div>
            <div className="ps-project-content"><div className="ps-project-tags"><span>Python</span><span>Amicon FPSU</span><span>{t.pythonTag}</span></div><h4>{t.project1Name}</h4><p>{t.project1Body}</p><Highlights title={t.highlights} items={t.project1Highlights} /></div>
          </article>
          <article className="ps-project-card ps-project-operations">
            <div className="ps-project-topline"><span><Workflow size={14} aria-hidden="true" /> JAVASCRIPT / 02</span><ArrowDownRight size={21} aria-hidden="true" /></div>
            <h3 className="ps-project-title">{t.project2Title}</h3>
            <div className="ps-dashboard-preview" aria-label={t.demo}>
              <div className="ps-window-top"><span className="ps-dashboard-mark"><Network size={12} aria-hidden="true" /></span><span>{t.dashboardTitle}</span><span className="ps-demo-label">{t.demo}</span></div>
              <div className="ps-dashboard-body">
                <div className="ps-dashboard-heading"><span>{t.dashboardLabel}</span><span className="ps-online-indicator" /></div>
                <div className="ps-workflow-diagram"><span><FileCode2 size={20} aria-hidden="true" /></span><i /><span><Activity size={20} aria-hidden="true" /></span><i /><span><Check size={20} aria-hidden="true" /></span></div>
                <div className="ps-dashboard-records">{t.dashboardRows.map((name, i) => <div key={name}><span className="ps-record-icon"><span /></span><span>{name}</span><small className={`ps-record-status ps-status-${i}`}>{[t.dashboardActive, t.dashboardReview, t.dashboardDone][i]}</small></div>)}</div>
                <div className="ps-dashboard-foot"><div className="ps-avatar-stack"><span>AS</span><span>+9</span></div><span><strong>10+</strong> {t.users}</span><span className="ps-micro-chart"><i /><i /><i /><i /><i /><i /><i /><i /><i /></span></div>
              </div>
            </div>
            <div className="ps-project-content"><div className="ps-project-tags"><span>JavaScript</span><span>HTML / CSS</span><span>{t.internalTag}</span></div><h4>{t.project2Name}</h4><p>{t.project2Body}</p><Highlights title={t.highlights} items={t.project2Highlights} /></div>
          </article>
        </div>
      </section>

      <section className="section-shell ps-skills" id="skills" aria-label={t.skillsTitle}>
        <Heading eyebrow={t.skillsEyebrow} title={t.skillsTitle} description={t.skillsIntro} />
        <div className="ps-skills-grid">{t.skillGroups.map((group, i) => { const Icon = skillIcons[i]; return <article className="ps-skill-card" key={group.title}><div className="ps-skill-top"><span className="ps-skill-icon"><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></span><span className="ps-skill-index">0{i + 1}</span></div><h3>{group.title}</h3><p>{group.description}</p><ul>{group.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></article>; })}</div>
      </section>

      <section className="section-shell ps-education" id="education" aria-label={t.educationTitle}>
        <Heading eyebrow={t.educationEyebrow} title={t.educationTitle} />
        <div className="ps-education-grid">
          <div className="ps-degree-column"><h3 className="ps-list-heading"><GraduationCap size={17} aria-hidden="true" />{t.educationLabel}</h3><article className="ps-degree"><div className="ps-degree-meta"><span>01</span><span>{t.mastersDate}</span></div><h4>{t.itmo}</h4><p className="ps-degree-name">{t.masters}</p><p className="ps-thesis">{t.mastersThesis}</p></article><article className="ps-degree"><div className="ps-degree-meta"><span>02</span><span>{t.bachelorsDate}</span></div><h4>{t.gut}</h4><p className="ps-degree-name">{t.bachelors}</p><p className="ps-thesis">{t.bachelorsThesis}</p></article></div>
          <div className="ps-learning-column"><h3 className="ps-list-heading">{t.certificationsLabel}</h3><div className="ps-certificates">{t.certs.map((cert) => <article className="ps-certificate" key={cert.title}><span className="ps-cert-symbol"><Check size={14} aria-hidden="true" /></span><div><h4>{cert.title}</h4><p>{cert.provider}</p></div><span className="ps-cert-date">{cert.date}</span></article>)}</div><div className="ps-languages"><h3 className="ps-list-heading">{t.languagesLabel}</h3><div>{t.languages.map(([name, level]) => <p key={name}><span>{name}</span><strong>{level}</strong></p>)}</div></div></div>
        </div>
      </section>
    </div>
  );
}
