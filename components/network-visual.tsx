import "./network-visual.css";

const fibers = [
  { d: "M 399 334 C 308 328 295 256 151 257", color: "cyan", delay: "-2s" },
  { d: "M 462 331 C 551 325 535 207 641 207", color: "cyan", delay: "-4.5s" },
  { d: "M 478 384 C 567 407 608 433 689 430", color: "amber", delay: "-1.2s" },
  { d: "M 422 428 C 425 524 452 575 548 575", color: "cyan", delay: "-3.1s" },
  { d: "M 348 405 C 277 420 311 530 183 530", color: "cyan", delay: "-5.8s" },
];

function Satellite({ x, y, amber = false, index }: { x: number; y: number; amber?: boolean; index: number }) {
  const accent = amber ? "var(--nv-0)" : "var(--nv-1)";
  return (
    <g className={`nv-satellite nv-satellite-${index}`} transform={`translate(${x} ${y})`}>
      <ellipse cy="24" rx="51" ry="23" fill={amber ? "url(#nv-amber-halo)" : "url(#nv-node-halo)"} />
      <path d="M-39 12 0-9 39 12 0 33Z" fill="var(--nv-2)" stroke="var(--nv-3)" strokeWidth=".7" />
      <path d="M-32 10 0-7 32 10 0 27Z" fill="var(--nv-4)" stroke={accent} strokeOpacity=".22" />
      <path d="M-23-14 0-27 23-14 0-1Z" fill="url(#nv-satellite-top)" stroke={accent} strokeOpacity=".65" strokeWidth=".8" />
      <path d="M-23-14 0-1 0 19-23 6Z" fill="url(#nv-satellite-left)" stroke={accent} strokeOpacity=".38" strokeWidth=".65" />
      <path d="M0-1 23-14 23 6 0 19Z" fill="url(#nv-satellite-right)" stroke={accent} strokeOpacity=".48" strokeWidth=".65" />
      <path d="M-23-14 0-1 23-14M0-1V19" fill="none" stroke={accent} strokeOpacity=".75" strokeWidth=".8" />
      <path d="M-17-14 0-23 17-14 0-5Z" fill={accent} fillOpacity=".06" stroke={accent} strokeOpacity=".25" strokeWidth=".6" />
      <path d="M-15 0-5 6M-15 5-5 11" stroke={accent} strokeOpacity=".45" strokeWidth="1.2" />
      <path d="M8 4 16 0" stroke={accent} strokeWidth="2" filter="url(#nv-small-glow)" />
      <circle cy="-14" r="2.6" fill={accent} filter="url(#nv-small-glow)" />
    </g>
  );
}

/** Original, CSS-animated infrastructure illustration. No runtime rendering loop. */
export function NetworkVisual() {
  return (
    <div className="network-visual network-infrastructure-diagram" aria-hidden="true">
      <svg viewBox="0 0 800 720" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <radialGradient id="nv-ground-halo"><stop stopColor="var(--nv-5)" stopOpacity=".17" /><stop offset="1" stopColor="var(--nv-6)" stopOpacity="0" /></radialGradient>
          <radialGradient id="nv-cyan-halo"><stop stopColor="var(--nv-7)" stopOpacity=".14" /><stop offset="1" stopColor="var(--nv-8)" stopOpacity="0" /></radialGradient>
          <radialGradient id="nv-node-halo"><stop stopColor="var(--nv-9)" stopOpacity=".24" /><stop offset="1" stopColor="var(--nv-9)" stopOpacity="0" /></radialGradient>
          <radialGradient id="nv-amber-halo"><stop stopColor="var(--nv-10)" stopOpacity=".2" /><stop offset="1" stopColor="var(--nv-10)" stopOpacity="0" /></radialGradient>
          <linearGradient id="nv-platform" x1="185" y1="313" x2="587" y2="484" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-11)" stopOpacity=".38" /><stop offset=".46" stopColor="var(--nv-12)" stopOpacity=".47" /><stop offset="1" stopColor="var(--nv-13)" stopOpacity=".6" /></linearGradient>
          <linearGradient id="nv-platform-edge" x1="214" y1="308" x2="587" y2="463" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-14)" stopOpacity=".65" /><stop offset=".5" stopColor="var(--nv-15)" stopOpacity=".15" /><stop offset="1" stopColor="var(--nv-16)" stopOpacity=".66" /></linearGradient>
          <linearGradient id="nv-chip-top" x1="320" y1="264" x2="488" y2="352" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-17)" /><stop offset=".55" stopColor="var(--nv-18)" /><stop offset="1" stopColor="var(--nv-19)" /></linearGradient>
          <linearGradient id="nv-chip-left" x1="325" y1="299" x2="410" y2="415" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-20)" /><stop offset="1" stopColor="var(--nv-21)" /></linearGradient>
          <linearGradient id="nv-chip-right" x1="480" y1="304" x2="409" y2="414" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-22)" /><stop offset="1" stopColor="var(--nv-23)" /></linearGradient>
          <linearGradient id="nv-core-top" x1="354" y1="256" x2="456" y2="307" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-24)" stopOpacity=".9" /><stop offset=".46" stopColor="var(--nv-25)" stopOpacity=".42" /><stop offset="1" stopColor="var(--nv-26)" stopOpacity=".86" /></linearGradient>
          <linearGradient id="nv-core-left" x1="350" y1="274" x2="407" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-27)" stopOpacity=".53" /><stop offset="1" stopColor="var(--nv-28)" stopOpacity=".8" /></linearGradient>
          <linearGradient id="nv-core-right" x1="455" y1="274" x2="406" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-29)" stopOpacity=".45" /><stop offset="1" stopColor="var(--nv-30)" stopOpacity=".88" /></linearGradient>
          <linearGradient id="nv-satellite-top" x1="-23" y1="-27" x2="23" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-31)" /><stop offset="1" stopColor="var(--nv-32)" /></linearGradient>
          <linearGradient id="nv-satellite-left" x1="-23" y1="-14" x2="0" y2="19" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-33)" /><stop offset="1" stopColor="var(--nv-34)" /></linearGradient>
          <linearGradient id="nv-satellite-right" x1="23" y1="-14" x2="0" y2="19" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-35)" /><stop offset="1" stopColor="var(--nv-36)" /></linearGradient>
          <linearGradient id="nv-beam" x1="405" y1="128" x2="405" y2="353" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-37)" stopOpacity="0" /><stop offset="1" stopColor="var(--nv-37)" stopOpacity=".1" /></linearGradient>
          <linearGradient id="nv-fiber" x1="150" y1="200" x2="690" y2="540" gradientUnits="userSpaceOnUse"><stop stopColor="var(--nv-38)" stopOpacity=".15" /><stop offset=".5" stopColor="var(--nv-39)" stopOpacity=".65" /><stop offset="1" stopColor="var(--nv-40)" stopOpacity=".3" /></linearGradient>
          <radialGradient id="nv-grid-fade"><stop stopColor="var(--text)" stopOpacity=".65" /><stop offset="1" stopColor="var(--text)" stopOpacity="0" /></radialGradient>
          <mask id="nv-grid-mask"><ellipse cx="415" cy="472" rx="385" ry="222" fill="url(#nv-grid-fade)" /></mask>
          <filter id="nv-small-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="nv-edge-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="nv-soft-blur"><feGaussianBlur stdDeviation="15" /></filter>
        </defs>

        <ellipse cx="435" cy="349" rx="295" ry="278" fill="url(#nv-cyan-halo)" />
        <ellipse cx="426" cy="474" rx="313" ry="158" fill="url(#nv-ground-halo)" />
        <ellipse cx="565" cy="421" rx="150" ry="106" fill="url(#nv-amber-halo)" opacity=".55" />

        <g mask="url(#nv-grid-mask)" stroke="var(--nv-41)" strokeWidth=".65" opacity=".34">
          {Array.from({ length: 17 }, (_, i) => (
            <path key={`a${i}`} d={`M ${-250 + i * 65} 290 L ${450 + i * 65} 660`} />
          ))}
          {Array.from({ length: 18 }, (_, i) => (
            <path key={`b${i}`} d={`M ${-30 + i * 65} 660 L ${670 + i * 65} 290`} />
          ))}
        </g>

        <g stroke="var(--nv-42)" strokeWidth=".7" opacity=".23">
          <path d="M122 384 400 235 705 394 429 544Z" strokeDasharray="3 9" />
          <path d="M97 422 399 260 727 434" strokeDasharray="1 8" />
          <path d="M401 175V225M401 505V614M99 377 147 403M662 305 710 331" />
        </g>

        <g>
          {fibers.map(({ d, color, delay }, i) => (
            <g key={d}>
              <path d={d} stroke={color === "amber" ? "var(--nv-43)" : "var(--nv-44)"} strokeWidth="5" opacity=".15" />
              <path d={d} stroke={color === "amber" ? "var(--nv-45)" : "url(#nv-fiber)"} strokeWidth="1.2" />
              <path d={d} stroke={color === "amber" ? "var(--nv-46)" : "var(--nv-47)"} strokeWidth="2" pathLength="1000" className="nv-packet" style={{ animationDelay: delay, animationDuration: `${5.8 + i * .6}s` }} filter="url(#nv-small-glow)" />
            </g>
          ))}
          <path d="M151 257C236 204 281 211 315 245M641 207C705 238 710 333 689 430M183 530C299 631 440 635 548 575" stroke="var(--nv-48)" strokeWidth=".8" strokeDasharray="3 8" opacity=".4" />
        </g>

        <g className="nv-platform-stack">
          <ellipse cx="407" cy="454" rx="176" ry="56" fill="var(--nv-49)" opacity=".7" filter="url(#nv-soft-blur)" />
          <path d="M405 292 613 399 405 509 197 399Z" fill="url(#nv-platform)" stroke="url(#nv-platform-edge)" strokeWidth=".85" opacity=".46" />
          <path d="M197 399V408L405 519 613 408V399M405 509V519" stroke="var(--nv-50)" strokeOpacity=".28" strokeWidth=".8" />
          <path d="M405 273 613 380 405 490 197 380Z" fill="url(#nv-platform)" stroke="url(#nv-platform-edge)" strokeWidth=".9" opacity=".7" />
          <path d="M197 380V386L405 497 613 386V380M405 490V497" stroke="var(--nv-51)" strokeOpacity=".21" strokeWidth=".7" />
          <path d="M405 251 613 358 405 468 197 358Z" fill="url(#nv-platform)" stroke="url(#nv-platform-edge)" strokeWidth="1" />
          <path d="M197 358V365L405 476 613 365V358M405 468V476" stroke="url(#nv-platform-edge)" strokeOpacity=".6" strokeWidth=".8" />
          <path d="M215 358 405 261 595 358 405 458Z" stroke="var(--nv-52)" strokeOpacity=".11" strokeWidth=".65" />

          <g stroke="var(--nv-53)" strokeWidth=".7" strokeOpacity=".37">
            <path d="M258 354 325 319M278 365 339 333M298 376 355 346M320 388 370 359M340 399 385 373" />
            <path d="M451 333 511 301M466 346 533 313M482 359 553 325" />
            <path d="M447 414 483 395 515 412 552 392M427 425 479 398M287 376 261 389 285 403 311 389" />
            <path d="M360 295 333 281 297 300M333 310 305 296" />
          </g>
          <g fill="var(--nv-54)" opacity=".6">
            <circle cx="258" cy="354" r="2" /><circle cx="278" cy="365" r="1.5" /><circle cx="298" cy="376" r="1.5" />
            <circle cx="511" cy="301" r="1.6" /><circle cx="533" cy="313" r="1.6" /><circle cx="552" cy="392" r="2" />
          </g>
          <path d="M203 361 283 403" stroke="var(--nv-55)" strokeWidth="2" strokeLinecap="round" filter="url(#nv-edge-glow)" opacity=".8" />
          <path d="M544 397 606 364" stroke="var(--nv-56)" strokeWidth="2" strokeLinecap="round" filter="url(#nv-edge-glow)" opacity=".9" />
        </g>

        <g className="nv-core">
          <path d="M321 307 405 263 489 307 405 351Z" fill="url(#nv-chip-top)" stroke="var(--nv-57)" strokeWidth=".9" strokeOpacity=".8" />
          <path d="M321 307 405 351V408L321 364Z" fill="url(#nv-chip-left)" stroke="var(--nv-58)" strokeWidth=".8" />
          <path d="M405 351 489 307V364L405 408Z" fill="url(#nv-chip-right)" stroke="var(--nv-59)" strokeWidth=".8" />
          <path d="M321 317 405 361 489 317M321 357 405 401 489 357" stroke="var(--nv-60)" strokeOpacity=".14" />
          <g stroke="var(--nv-61)" strokeWidth="2.1" strokeOpacity=".39">
            {Array.from({ length: 9 }, (_, i) => (
              <path key={`pin${i}`} d={`M${330 + i * 7.5} ${326 + i * 3.93}v12 M${414 + i * 7.5} ${370 - i * 3.93}v12`} />
            ))}
          </g>
          <path d="M336 307 405 271 474 307 405 343Z" fill="var(--nv-62)" stroke="var(--nv-63)" strokeOpacity=".3" strokeWidth=".6" />
          <path d="M345 307 405 275 465 307 405 339Z" stroke="var(--nv-64)" strokeWidth="2.4" opacity=".55" filter="url(#nv-edge-glow)" />
          <path d="M405 129 349 273V307L405 338 461 307V273Z" fill="url(#nv-beam)" opacity=".65" />

          <path d="M349 273 405 243 461 273 405 304Z" fill="url(#nv-core-top)" stroke="var(--nv-65)" strokeWidth="1.2" />
          <path d="M349 273 405 304V361L349 330Z" fill="url(#nv-core-left)" stroke="var(--nv-66)" strokeOpacity=".8" strokeWidth="1" />
          <path d="M405 304 461 273V330L405 361Z" fill="url(#nv-core-right)" stroke="var(--nv-67)" strokeOpacity=".7" strokeWidth="1" />
          <path d="M405 243V300M349 273 405 304 461 273M405 304V361" stroke="var(--nv-68)" strokeWidth="1.2" filter="url(#nv-small-glow)" />
          <path d="M358 273 405 248 452 273 405 299Z" stroke="var(--nv-69)" strokeOpacity=".48" strokeWidth=".6" />
          <path d="M362 280V322L399 343M447 282V323L413 343" stroke="var(--nv-70)" strokeOpacity=".45" strokeWidth=".7" />
          <path d="M355 295 397 318M355 306 397 329M355 317 397 340M415 318 454 297M415 329 454 308" stroke="var(--nv-71)" strokeOpacity=".15" strokeWidth=".6" />
          <path d="M449 280 461 273V330L435 345" stroke="var(--nv-72)" strokeWidth="1.4" filter="url(#nv-small-glow)" opacity=".85" />
          <path d="M355 272 405 246 432 261" stroke="var(--nv-73)" strokeWidth="1.8" filter="url(#nv-small-glow)" />
          <path d="M370 365 392 377" stroke="var(--nv-74)" strokeWidth="2" filter="url(#nv-small-glow)" />
          <circle cx="380" cy="300" r="2" fill="var(--nv-75)" filter="url(#nv-small-glow)" />
          <circle cx="432" cy="329" r="1.7" fill="var(--nv-76)" filter="url(#nv-small-glow)" />
        </g>

        <Satellite x={151} y={257} index={0} />
        <Satellite x={641} y={207} index={1} />
        <Satellite x={689} y={430} amber index={2} />
        <Satellite x={548} y={575} index={3} />
        <Satellite x={183} y={530} index={4} />

        <g className="nv-dust" fill="var(--nv-77)">
          <circle cx="248" cy="214" r="1.2" opacity=".5" /><circle cx="563" cy="155" r="1" opacity=".4" />
          <circle cx="584" cy="278" r="1.5" opacity=".35" /><circle cx="264" cy="478" r="1" opacity=".5" />
          <circle cx="619" cy="526" r="1.2" opacity=".4" /><circle cx="456" cy="193" r="1" opacity=".5" />
          <circle cx="326" cy="573" r="1.3" opacity=".4" /><circle cx="722" cy="353" r="1" opacity=".4" />
        </g>
        <g fill="var(--nv-78)" fontSize="7" fontFamily="var(--mono)" letterSpacing="0" opacity=".6">
          <text x="118" y="308">Edge / 01</text>
          <text x="612" y="257">Edge / 02</text>
          <text x="369" y="544">Secure core</text>
        </g>
      </svg>
    </div>
  );
}
