"use client";

import { useState } from "react";
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
  en: { gallery: "Photo gallery", photo: "Photo of Artem Shuvalov", previous: "Previous photo", next: "Next photo", select: "Show photo", name: "ARTEM SHUVALOV", role: "NETWORK SECURITY ENGINEER" },
  ru: { gallery: "Фотогалерея", photo: "Фотография Артёма Шувалова", previous: "Предыдущее фото", next: "Следующее фото", select: "Показать фото", name: "АРТЁМ ШУВАЛОВ", role: "СЕТЕВАЯ БЕЗОПАСНОСТЬ" },
  es: { gallery: "Galería de fotos", photo: "Fotografía de Artem Shuvalov", previous: "Foto anterior", next: "Foto siguiente", select: "Mostrar foto", name: "ARTEM SHUVALOV", role: "INGENIERO DE SEGURIDAD DE REDES" },
};

export function PhotoGallery({ lang }: { lang: Language }) {
  const [selected, setSelected] = useState(0);
  const t = copy[lang];
  const photo = photos[selected];
  return <div className="photo-gallery" role="group" aria-label={t.gallery}>
    <div className="about-image-main gallery-main">
      <img src={assetPath(`/assets/${photo.file}`)} alt={`${t.photo} · ${selected + 1}`} width={photo.width} height={photo.height} style={{ objectPosition: photo.position }} loading="lazy"/>
      <div className="portrait-caption"><span className="status-dot"/><span>{t.name}<small>{t.role}</small></span></div>
      <div className="gallery-controls">
        <button type="button" onClick={() => setSelected((selected + photos.length - 1) % photos.length)} aria-label={t.previous}><ArrowLeft size={16}/></button>
        <span aria-live="polite">{selected + 1} / {photos.length}</span>
        <button type="button" onClick={() => setSelected((selected + 1) % photos.length)} aria-label={t.next}><ArrowRight size={16}/></button>
      </div>
    </div>
    <div className="gallery-thumbnails">{photos.map((item, index) => <button key={item.file} type="button" aria-label={`${t.select} ${index + 1}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><img src={assetPath(`/assets/photos/${item.thumb}-thumb.webp`)} alt="" width="112" height="128" loading="lazy"/></button>)}</div>
    <div className="image-corner" aria-hidden="true"/>
  </div>;
}
