"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowDownRight, ArrowUpRight, Check, LoaderCircle, Mail, Send } from "lucide-react";
import { LinkedInIcon as Linkedin } from "@/components/social-icons";
import { STATIC_SITE } from "@/lib/site-config";
import { contactEs, staticContactCopy } from "@/lib/contact-es";
import type { Language } from "@/lib/i18n";
import {
  CONTACT_EMAIL,
  CONTACT_LIMITS,
  CONTACT_LINKEDIN,
  validateContactInput,
  buildContactDraft,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from "@/lib/contact";
import "./contact-section.css";

const emptyValues: ContactValues = { name: "", email: "", company: "", role: "", jobLink: "", message: "", website: "" };
const copy = {
  es: { ...contactEs, title: <>Construyamos<br />algo <em>seguro.</em></> },
  en: {
    eyebrow: "06 / LET’S CONNECT",
    title: <>Let’s build<br />something <em>secure.</em></>,
    description: "Looking for someone who connects network security, infrastructure, and automation? Let’s talk about your team’s next challenge.",
    emailLabel: "EMAIL ME DIRECTLY",
    linkedinLabel: "FIND ME ON LINKEDIN",
    linkedin: "Artem Shuvalov",
    note: "Open to network security and infrastructure roles.",
    formTitle: "Start a conversation",
    formIntro: "Have a role in mind? I’d love to hear about it.",
    requiredNote: "* Required fields",
    optional: "optional",
    labels: { name: "Your name", email: "Email address", company: "Company", role: "Role / opportunity", jobLink: "Link to the role", message: "Your message", website: "Website" },
    placeholders: { name: "Alex Morgan", email: "alex@company.com", company: "Your company", role: "e.g. Network Security Engineer", jobLink: "https://…", message: "Tell me a little about the role, your team, or what you’re building.", website: "" },
    send: "Send message",
    sending: "Sending…",
    privacy: "Your details are used only to respond to your enquiry.",
    successTitle: "Message sent. Thank you!",
    success: "I’ll get back to you at the email address you provided.",
    errorTitle: "Your message hasn’t been sent.",
    unavailable: "The contact service is temporarily unavailable. You can reach me directly by email.",
    rateLimited: "There have been several requests. Please try again later, or email me directly.",
    failed: "Please try again, or use the direct email link. Your message is still here.",
    validation: "Please check the highlighted fields.",
    direct: "Email Artem directly",
    errors: { required: "Please complete this field.", invalid: "Please enter a valid value.", too_long: "Please shorten this field.", email: "Please enter a valid email address.", jobLink: "Please use a complete http:// or https:// link." },
  },
  ru: {
    eyebrow: "06 / НА СВЯЗИ",
    title: <>Давайте создавать<br /><em>безопасное.</em></>,
    description: "Ищете специалиста по сетевой безопасности, инфраструктуре и автоматизации? Давайте обсудим следующую задачу вашей команды.",
    emailLabel: "НАПИШИТЕ МНЕ НАПРЯМУЮ",
    linkedinLabel: "МОЙ ПРОФИЛЬ LINKEDIN",
    linkedin: "Артём Шувалов",
    note: "Открыт к предложениям в сетевой безопасности и инфраструктуре.",
    formTitle: "Начнём разговор",
    formIntro: "Есть интересная вакансия? Буду рад узнать о ней.",
    requiredNote: "* Обязательные поля",
    optional: "необязательно",
    labels: { name: "Ваше имя", email: "Электронная почта", company: "Компания", role: "Вакансия / предложение", jobLink: "Ссылка на вакансию", message: "Ваше сообщение", website: "Сайт" },
    placeholders: { name: "Александр Иванов", email: "alex@company.com", company: "Название компании", role: "Например, инженер сетевой безопасности", jobLink: "https://…", message: "Расскажите немного о вакансии, вашей команде или проекте.", website: "" },
    send: "Отправить сообщение",
    sending: "Отправляем…",
    privacy: "Ваши данные используются только для ответа на обращение.",
    successTitle: "Сообщение отправлено. Спасибо!",
    success: "Я отвечу на указанный вами адрес электронной почты.",
    errorTitle: "Сообщение пока не отправлено.",
    unavailable: "Сервис временно недоступен. Вы можете написать мне напрямую по электронной почте.",
    rateLimited: "Получено несколько запросов. Попробуйте позже или напишите мне напрямую.",
    failed: "Попробуйте ещё раз или напишите на почту. Ваше сообщение сохранено в форме.",
    validation: "Пожалуйста, проверьте выделенные поля.",
    direct: "Написать Артёму напрямую",
    errors: { required: "Пожалуйста, заполните это поле.", invalid: "Проверьте значение поля.", too_long: "Пожалуйста, сократите текст.", email: "Введите корректный адрес электронной почты.", jobLink: "Укажите полную ссылку с http:// или https://." },
  },
};

type Feedback = "success" | "draft" | "not_configured" | "rate_limited" | "validation" | "failed" | null;
type VisibleField = Exclude<ContactField, "website">;
const visibleFields: VisibleField[] = ["name", "email", "company", "role", "jobLink", "message"];

export function ContactSection({ lang }: { lang: Language }) {
  const t = copy[lang];
  const s = staticContactCopy[lang];
  const [values, setValues] = useState<ContactValues>(emptyValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [draft, setDraft] = useState<ReturnType<typeof buildContactDraft> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const submission = useRef<{ payload: string; key: string } | null>(null);

  function updateField(field: ContactField, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) {
      const result = validateContactInput(next);
      setErrors((current) => ({ ...current, [field]: result.valid ? undefined : result.errors[field] }));
    }
    if (feedback) setFeedback(null);
  }

  function focusFirstError(fieldErrors: ContactErrors) {
    const first = visibleFields.find((field) => fieldErrors[field]);
    const element = first ? formRef.current?.elements.namedItem(first) : null;
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.focus({ preventScroll: false });
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const result = validateContactInput(values);
    if (!result.valid) {
      setErrors(result.errors);
      setFeedback("validation");
      focusFirstError(result.errors);
      return;
    }
    setErrors({});
    setFeedback(null);
    if (STATIC_SITE) {
      setDraft(buildContactDraft(result.values, lang));
      setFeedback("draft");
      return;
    }
    submitting.current = true;
    setPending(true);
    const payload = JSON.stringify(result.values);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      let attempt = submission.current;
      if (!attempt || attempt.payload !== payload) {
        attempt = { payload, key: crypto.randomUUID() };
        submission.current = attempt;
      }
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.key },
        body: payload,
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null) as { ok?: boolean; code?: string; errors?: ContactErrors } | null;
      if (response.ok && data?.ok === true) {
        setFeedback("success");
        setValues(emptyValues);
        submission.current = null;
      } else if (data?.code === "validation" && data.errors) {
        const safeErrors: ContactErrors = {};
        for (const field of visibleFields) {
          const error = data.errors[field];
          if (error === "required" || error === "invalid" || error === "too_long") safeErrors[field] = error;
        }
        setErrors(safeErrors);
        setFeedback(Object.keys(safeErrors).length ? "validation" : "failed");
        focusFirstError(safeErrors);
      } else {
        setFeedback(data?.code === "not_configured" ? "not_configured" : data?.code === "rate_limited" ? "rate_limited" : "failed");
      }
    } catch {
      setFeedback("failed");
    } finally {
      window.clearTimeout(timeout);
      submitting.current = false;
      setPending(false);
    }
  }

  function fieldError(field: VisibleField) {
    const error = errors[field];
    if (!error) return undefined;
    if (error === "invalid" && (field === "email" || field === "jobLink")) return t.errors[field];
    return t.errors[error];
  }

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-shell">
        <div className="contact-intro">
          <p className="contact-eyebrow"><span />{t.eyebrow}</p>
          <h2 id="contact-title">{t.title}</h2>
          <p className="contact-description">{t.description}</p>
          <div className="contact-links">
            <a className="contact-link" href={`mailto:${CONTACT_EMAIL}`}>
              <span className="contact-link-icon"><Mail size={20} strokeWidth={1.5} /></span>
              <span><span className="contact-link-label">{t.emailLabel}</span><span className="contact-link-value">{CONTACT_EMAIL}</span></span>
              <ArrowUpRight size={18} strokeWidth={1.5} className="contact-link-arrow" />
            </a>
            <a className="contact-link" href={CONTACT_LINKEDIN} target="_blank" rel="noopener noreferrer">
              <span className="contact-link-icon"><Linkedin size={19} strokeWidth={1.5} /></span>
              <span><span className="contact-link-label">{t.linkedinLabel}</span><span className="contact-link-value">{t.linkedin}</span></span>
              <ArrowUpRight size={18} strokeWidth={1.5} className="contact-link-arrow" />
            </a>
          </div>
          <p className="contact-availability"><span />{t.note}</p>
          <ArrowDownRight className="contact-decoration" size={88} strokeWidth={0.7} aria-hidden="true" />
        </div>

        <form className="contact-form" ref={formRef} onSubmit={submit} noValidate aria-busy={pending}>
          <div className="contact-form-header"><span className="contact-form-tag">{s.tag}</span><span className="contact-form-dots" aria-hidden="true"><i /><i /><i /></span></div>
          <h3>{t.formTitle}</h3>
          <p className="contact-form-intro">{STATIC_SITE ? (s.intro) : t.formIntro}</p>
          <div className="contact-fields">
            {visibleFields.map((field) => {
              const required = field === "name" || field === "email" || field === "message";
              const error = fieldError(field);
              const properties = {
                id: `contact-${field}`,
                name: field,
                value: values[field],
                onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField(field, event.target.value),
                onBlur: () => {
                  if (!values[field] && !required) return;
                  const validation = validateContactInput(values);
                  setErrors((current) => ({ ...current, [field]: validation.valid ? undefined : validation.errors[field] }));
                },
                placeholder: t.placeholders[field],
                required,
                maxLength: CONTACT_LIMITS[field],
                "aria-invalid": !!error,
                "aria-describedby": error ? `contact-${field}-error` : undefined,
                disabled: pending,
              };
              return (
                <div className={`contact-field${field === "message" || field === "jobLink" ? " contact-field-full" : ""}`} key={field}>
                  <label htmlFor={`contact-${field}`}>{t.labels[field]} {required ? <span className="contact-required">*</span> : <span className="contact-optional">({t.optional})</span>}</label>
                  {field === "message" ? <textarea {...properties} rows={4} /> : <input {...properties} type={field === "email" ? "email" : field === "jobLink" ? "url" : "text"} autoComplete={field === "name" ? "name" : field === "email" ? "email" : field === "company" ? "organization" : "off"} />}
                  {error && <p className="contact-field-error" id={`contact-${field}-error`}>{error}</p>}
                </div>
              );
            })}
          </div>
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="contact-website">{t.labels.website}</label>
            <input id="contact-website" name="website" value={values.website} onChange={(event) => updateField("website", event.target.value)} tabIndex={-1} autoComplete="off" maxLength={CONTACT_LIMITS.website} />
          </div>
          <p className="contact-required-note">{t.requiredNote}</p>

          {feedback === "draft" && draft && <div className="contact-feedback is-success contact-draft" role="status">
            <div><strong>{s.title}</strong>
              <p>{s.instructions}</p>
              <a href={draft.href}>{s.open}<ArrowUpRight size={14} aria-hidden="true"/></a>
              <label htmlFor="contact-draft">{s.text}</label>
              <textarea id="contact-draft" readOnly value={`${draft.subject}\n\n${draft.body}`} rows={6} onFocus={event => event.currentTarget.select()}/>
            </div>
          </div>}
          {feedback && feedback !== "draft" && <div className={`contact-feedback${feedback === "success" ? " is-success" : " is-error"}`} role={feedback === "success" ? "status" : "alert"}>
            {feedback === "success" ? <><Check size={19} aria-hidden="true" /><div><strong>{t.successTitle}</strong><p>{t.success}</p></div></> : <div><strong>{feedback === "validation" ? t.validation : t.errorTitle}</strong>{feedback !== "validation" && <><p>{feedback === "not_configured" ? t.unavailable : feedback === "rate_limited" ? t.rateLimited : t.failed}</p><a href={`mailto:${CONTACT_EMAIL}`}>{t.direct}<ArrowUpRight size={14} aria-hidden="true" /></a></>}</div>}
          </div>}

          <button className="contact-submit" type="submit" disabled={pending}>
            <span>{pending ? t.sending : STATIC_SITE ? (s.prepare) : t.send}</span>{pending ? <LoaderCircle size={17} className="contact-spinner" aria-hidden="true" /> : <Send size={17} strokeWidth={1.7} aria-hidden="true" />}
          </button>
          <p className="contact-privacy">{STATIC_SITE ? (s.privacy) : t.privacy}</p>
        </form>
      </div>
    </section>
  );
}
