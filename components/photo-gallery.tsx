"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { assetPath } from "@/lib/site-config";
import type { Language } from "@/lib/i18n";
import "./photo-gallery.css";

const photos = [
  { file: "photos/img_1.webp", thumb: "img_1", width: 903, height: 1280, position: "50% 35%" },
  ...["3031", "4076", "6199", "7570", "8010", "9584", "9915"].map(number => ({ file: `photos/img_${number}.webp`, thumb: `img_${number}`, width: number === "7570" ? 1280 : 960, height: 1280, position: "50% 42%" })),
  { file: "artem-portrait.webp", thumb: "formal", width: 791, height: 996, position: "50% 24%" },
  { file: "artem-window.webp", thumb: "window", width: 626, height: 671, position: "50% 50%" },
];
const copy = {
  en: { gallery: "Photo gallery", photo: "Photo of Artem Shuvalov", previous: "Previous photo", next: "Next photo", select: "Show photo", name: "Artem Shuvalov", role: "Network security engineer", noScript: "Enable JavaScript to browse all ten photos." },
  ru: { gallery: "Фотогалерея", photo: "Фотография Артёма Шувалова", previous: "Предыдущее фото", next: "Следующее фото", select: "Показать фото", name: "Артём Шувалов", role: "Сетевая безопасность", noScript: "Включите JavaScript, чтобы просмотреть все десять фотографий." },
  es: { gallery: "Galería de fotos", photo: "Fotografía de Artem Shuvalov", previous: "Foto anterior", next: "Foto siguiente", select: "Mostrar foto", name: "Artem Shuvalov", role: "Ingeniero de seguridad de redes", noScript: "Activa JavaScript para ver las diez fotografías." },
};

export function PhotoGallery({ lang }: { lang: Language }) {
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);
  const photoId = useId();
  const touchStart = useRef<{ x: number; y: number; id: number; time: number } | null>(null);
  const t = copy[lang];
  const photo = photos[selected];

  useEffect(() => { setReady(true); }, []);

  function step(direction: number) {
    setSelected(current => (current + photos.length + direction) % photos.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!ready || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "ArrowRight") step(1);
    else if (event.key === "Home") setSelected(0);
    else if (event.key === "End") setSelected(photos.length - 1);
    else return;
    event.preventDefault();
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (!ready || event.touches.length !== 1 || (event.target instanceof Element && event.target.closest("button"))) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY, id: touch.identifier, time: event.timeStamp };
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = Array.from(event.changedTouches).find(item => item.identifier === start.id);
    if (!touch) return;
    const horizontal = touch.clientX - start.x;
    const vertical = touch.clientY - start.y;
    if (Math.abs(horizontal) >= 44 && Math.abs(horizontal) > Math.abs(vertical) * 1.5 && event.timeStamp - start.time < 800) {
      step(horizontal < 0 ? 1 : -1);
    }
  }

  return <div className="photo-gallery" role="group" aria-label={t.gallery} onKeyDown={handleKeyDown}>
    <div className="about-image-main gallery-main" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { touchStart.current = null; }}>
      <img id={photoId} src={assetPath(`/assets/${photo.file}`)} alt={`${t.photo}, ${selected + 1}`} width={photo.width} height={photo.height} style={{ objectPosition: photo.position }} loading="lazy" decoding="async" draggable={false}/>
      <div className="portrait-caption"><span>{t.name}<small>{t.role}</small></span></div>
      <div className="gallery-controls">
        <button type="button" disabled={!ready} onClick={() => setSelected((selected + photos.length - 1) % photos.length)} aria-label={t.previous} aria-controls={photoId}><ArrowLeft size={16} aria-hidden="true"/></button>
        <span aria-live="polite" aria-atomic="true">{selected + 1} / {photos.length}</span>
        <button type="button" disabled={!ready} onClick={() => setSelected((selected + 1) % photos.length)} aria-label={t.next} aria-controls={photoId}><ArrowRight size={16} aria-hidden="true"/></button>
      </div>
    </div>
    <div className="gallery-thumbnails">{photos.map((item, index) => <button key={item.file} type="button" disabled={!ready} aria-label={`${t.select} ${index + 1}`} aria-pressed={selected === index} aria-controls={photoId} onClick={() => setSelected(index)}><img src={assetPath(`/assets/photos/${item.thumb}-thumb.webp`)} alt="" width="112" height="128" loading="lazy"/></button>)}</div>
    <noscript><p>{t.noScript}</p></noscript>
    <div className="image-corner" aria-hidden="true"/>
  </div>;
}
