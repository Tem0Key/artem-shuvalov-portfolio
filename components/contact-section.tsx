"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Copy, Info, LoaderCircle, Mail, Send, X } from "lucide-react";
import { GitHubIcon, LinkedInIcon as Linkedin } from "@/components/social-icons";
import { STATIC_SITE } from "@/lib/site-config";
import { contactEs, staticContactCopy } from "@/lib/contact-es";
import type { Language } from "@/lib/i18n";
import {
  CONTACT_EMAIL,
  CONTACT_LIMITS,
  CONTACT_LINKEDIN,
  CONTACT_GITHUB,
  validateContactInput,
  buildContactDraft,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from "@/lib/contact";
import "./contact-section.css";

const emptyValues: ContactValues = { name: "", email: "", company: "", role: "", jobLink: "", message: "", website: "" };
const copy = {
  es: { ...contactEs, title: "Conectemos" },
  en: {
    title: "Let’s connect",
    description: "Looking for someone who connects network security, infrastructure, and automation? Let’s talk about your team’s next challenge.",
    emailLabel: "Email me directly",
    linkedinLabel: "Find me on LinkedIn",
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
    title: "На связи",
    description: "Ищете специалиста по сетевой безопасности, инфраструктуре и автоматизации? Давайте обсудим следующую задачу вашей команды.",
    emailLabel: "Напишите мне напрямую",
    linkedinLabel: "Мой профиль LinkedIn",
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

type Feedback = "success" | "not_configured" | "rate_limited" | "validation" | "failed" | null;
type VisibleField = Exclude<ContactField, "website">;
const visibleFields: VisibleField[] = ["name", "email", "company", "role", "jobLink", "message"];

export function ContactSection({ lang }: { lang: Language }) {
  const t = copy[lang];
  const s = staticContactCopy[lang];
  const [values, setValues] = useState<ContactValues>(emptyValues);
  const [hydrated, setHydrated] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [draftValues, setDraftValues] = useState<ContactValues | null>(null);
  const draft = draftValues ? buildContactDraft(draftValues, lang) : null;
  const [copied, setCopied] = useState<string | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropPointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const submission = useRef<{ payload: string; key: string } | null>(null);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!draftValues) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => { dialog?.close(); };
  }, [draftValues]);

  async function copyDraftField(field: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);
      setCopyFailed(false);
    } catch {
      setCopied(null);
      setCopyFailed(true);
    }
  }

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
    if (!hydrated || submitting.current) return;
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
      setCopied(null);
      setCopyFailed(false);
      setDraftValues(result.values);
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

  function keepDraftFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab" || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || !event.currentTarget.open) return;
    const dialog = event.currentTarget;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>("a[href], button, input, textarea, select, [tabindex]"))
      .filter(element => element.tabIndex >= 0 && !element.matches(":disabled, [aria-disabled='true']") && !element.closest("[hidden], [inert]") && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) { event.preventDefault(); return; }
    const active = document.activeElement;
    // Some browsers move focus to browser chrome at a native modal's tab boundary.
    if (event.shiftKey && (active === first || active === dialog || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || active === dialog || !dialog.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <section className="contact-section" id="contact" tabIndex={-1} aria-labelledby="contact-title">
      <div className="contact-shell">
        <div className="contact-intro">
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
            <a className="contact-link" href={CONTACT_GITHUB} target="_blank" rel="noopener noreferrer">
              <span className="contact-link-icon"><GitHubIcon size={20} /></span>
              <span><span className="contact-link-label">{s.githubLabel}</span><span className="contact-link-value">Tem0Key</span></span>
              <ArrowUpRight size={18} strokeWidth={1.5} className="contact-link-arrow" />
            </a>
          </div>
          <p className="contact-availability">{t.note}</p>
          <ArrowDownRight className="contact-decoration" size={88} strokeWidth={0.7} aria-hidden="true" />
        </div>

        <form className="contact-form" ref={formRef} method="post" onSubmit={submit} noValidate aria-busy={pending}>
          <h3>{t.formTitle}</h3>
          <p className="contact-form-intro">{STATIC_SITE ? (s.intro) : t.formIntro}</p>
          <noscript><p className="contact-noscript">{s.noScript} <a href={`mailto:${CONTACT_EMAIL}`}>{t.direct}</a></p></noscript>
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
                  const validation = validateContactInput(values);
                  setErrors((current) => ({ ...current, [field]: validation.valid ? undefined : validation.errors[field] }));
                },
                placeholder: t.placeholders[field],
                required,
                maxLength: CONTACT_LIMITS[field],
                "aria-invalid": !!error,
                "aria-describedby": error ? `contact-${field}-error` : undefined,
                disabled: !hydrated || pending,
              };
              return (
                <div className={`contact-field${field === "message" || field === "jobLink" ? " contact-field-full" : ""}`} key={field}>
                  <label htmlFor={`contact-${field}`}>{t.labels[field]} {required ? <span className="contact-required">*</span> : <span className="contact-optional">({t.optional})</span>}</label>
                  {field === "message" ? <textarea {...properties} rows={4} /> : <input {...properties} type={field === "email" ? "email" : field === "jobLink" ? "url" : "text"} autoComplete={field === "name" ? "name" : field === "email" ? "email" : field === "company" ? "organization" : "off"} />}
                  <p className="contact-field-error" id={`contact-${field}-error`} aria-live="polite" aria-atomic="true">{error ?? "\u00a0"}</p>
                </div>
              );
            })}
          </div>
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="contact-website">{t.labels.website}</label>
            <input id="contact-website" name="website" value={values.website} onChange={(event) => updateField("website", event.target.value)} tabIndex={-1} autoComplete="off" maxLength={CONTACT_LIMITS.website} disabled={!hydrated || pending} />
          </div>
          <p className="contact-required-note">{t.requiredNote}</p>

          {feedback && feedback !== "validation" && <div className={`contact-feedback${feedback === "success" ? " is-success" : " is-error"}`} role={feedback === "success" ? "status" : "alert"}>
            {feedback === "success" ? <><Check size={19} aria-hidden="true" /><div><strong>{t.successTitle}</strong><p>{t.success}</p></div></> : <div><strong>{t.errorTitle}</strong><p>{feedback === "not_configured" ? t.unavailable : feedback === "rate_limited" ? t.rateLimited : t.failed}</p><a href={`mailto:${CONTACT_EMAIL}`}>{t.direct}<ArrowUpRight size={14} aria-hidden="true" /></a></div>}
          </div>}
          <p className="contact-validation-status" role="alert">{feedback === "validation" ? t.validation : "\u00a0"}</p>

          <button className="contact-submit" type="submit" disabled={!hydrated || pending}>
            <span>{pending ? t.sending : STATIC_SITE ? s.prepare : t.send}</span>{pending ? <LoaderCircle size={17} className="contact-spinner" aria-hidden="true" /> : STATIC_SITE ? <Mail size={17} strokeWidth={1.7} aria-hidden="true" /> : <Send size={17} strokeWidth={1.7} aria-hidden="true" />}
          </button>
          <p className="contact-privacy">{STATIC_SITE ? (s.privacy) : t.privacy}</p>
        </form>
      </div>
      <dialog className="contact-draft-dialog" ref={dialogRef} aria-labelledby="contact-draft-title" aria-describedby="contact-draft-description" onClose={() => setDraftValues(null)} onKeyDown={keepDraftFocus}
        onPointerDown={event => {
          const rect = event.currentTarget.getBoundingClientRect();
          const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
          backdropPointer.current = event.target === event.currentTarget && outside ? { id: event.pointerId, x: event.clientX, y: event.clientY } : null;
        }}
        onPointerUp={event => {
          const start = backdropPointer.current;
          backdropPointer.current = null;
          if (!start || start.id !== event.pointerId || event.target !== event.currentTarget || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
        }}
        onPointerCancel={() => { backdropPointer.current = null; }}>
        {draft && <>
          <div className="contact-draft-heading">
            <span className="contact-draft-info"><Info size={22} aria-hidden="true" /></span>
            <button type="button" className="contact-draft-close" onClick={() => dialogRef.current?.close()} aria-label={s.close} autoFocus><X size={20} aria-hidden="true" /></button>
          </div>
          <h3 id="contact-draft-title">{s.title}</h3>
          <p id="contact-draft-description">{s.instructions}</p>
          <div className="contact-draft-fields">
            {([
              { id: "recipient", label: s.recipient, value: CONTACT_EMAIL },
              { id: "subject", label: s.subject, value: draft.subject },
              { id: "body", label: s.text, value: draft.body },
            ]).map(({ id, label, value }) => <div className="contact-draft-field" key={id}>
              <div className="contact-draft-field-heading">
                <label htmlFor={`contact-draft-${id}`}>{label}</label>
                <button type="button" onClick={() => copyDraftField(id, value)} aria-label={`${s.copy}: ${label}`}>
                  {copied === id ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied === id ? s.copied : s.copy}
                </button>
              </div>
              {id === "body" ? <textarea id={`contact-draft-${id}`} readOnly value={value} rows={9} onFocus={event => event.currentTarget.select()} /> : <input id={`contact-draft-${id}`} readOnly value={value} onFocus={event => event.currentTarget.select()} />}
            </div>)}
          </div>
          <p className="contact-draft-copy-status" role="status">{copyFailed ? s.copyFailed : copied ? s.copied : ""}</p>
          <a className="contact-draft-open" href={draft.href}>{s.open}<ArrowUpRight size={16} aria-hidden="true" /></a>
        </>}
      </dialog>
    </section>
  );
}
