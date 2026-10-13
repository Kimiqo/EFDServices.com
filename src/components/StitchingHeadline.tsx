import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { headlineLines } from '../data/headlineGlyphs';

const dottedHold = 1400;
const finishedHold = 4200;
const resetDuration = 1000;

type HeadlineLine = { text: string; width: number; accent?: boolean; glyphs: { letter: string; path: string }[] };

const subscribeToMobile = (onChange: () => void) => {
  const media = window.matchMedia('(max-width: 600px)');
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
const getMobileSnapshot = () => window.matchMedia('(max-width: 600px)').matches;

export default function StitchingHeadline({ lines: desktopLines = headlineLines, mobileLines }: { lines?: HeadlineLine[]; mobileLines?: HeadlineLine[] }) {
  const isMobile = useSyncExternalStore(subscribeToMobile, getMobileSnapshot, () => false);
  const lines = isMobile && mobileLines ? mobileLines : desktopLines;
  const glyphs = useMemo(() => lines.flatMap((line, lineIndex) => line.glyphs.map(glyph => ({ ...glyph, lineIndex }))), [lines]);
  const lineOffsets = useMemo(() => lines.map((_, lineIndex) => lines.slice(0, lineIndex).reduce((count, line) => count + line.glyphs.length, 0)), [lines]);
  const id = useId().replace(/:/g, '');
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const revealRefs = useRef<(SVGPathElement | null)[]>([]);
  const fillRefs = useRef<(SVGPathElement | null)[]>([]);
  const guideRefs = useRef<(SVGPathElement | null)[]>([]);
  const threadRefs = useRef<(SVGGElement | null)[]>([]);
  const needleRefs = useRef<(SVGGElement | null)[]>([]);
  const elapsedRef = useRef(0);
  const [lengths, setLengths] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    elapsedRef.current = 0;
    setLengths(glyphs.map((_, index) => pathRefs.current[index]?.getTotalLength() || 1));
  }, [glyphs]);

  useEffect(() => {
    if (lengths.length !== glyphs.length) return;
    // Slow enough to watch the needle follow each curve, serif and counter.
    const durations = lengths.map(length => Math.max(650, Math.min(2200, length * 4.5)));
    const startTimes: number[] = [];
    let sewingEnd = dottedHold;
    durations.forEach(duration => { startTimes.push(sewingEnd); sewingEnd += duration; });
    const resetStart = sewingEnd + finishedHold;
    const cycleDuration = resetStart + resetDuration;

    const setGlyph = (index: number, progress: number, opacity = 1) => {
      revealRefs.current[index]?.setAttribute('stroke-dashoffset', String(100 * (1 - progress)));
      fillRefs.current[index]?.setAttribute('opacity', progress >= 1 ? String(opacity) : '0');
      guideRefs.current[index]?.setAttribute('opacity', progress >= 1 ? String(0.85 * (1 - opacity)) : '0.85');
      threadRefs.current[index]?.setAttribute('opacity', String(opacity));
    };
    if (reducedMotion || paused) {
      glyphs.forEach((_, index) => setGlyph(index, 1));
      needleRefs.current.forEach(needle => needle?.setAttribute('opacity', '0'));
      return;
    }

    let frame = 0;
    let lastTime: number | null = null;
    let visible = false;
    const animate = (time: number) => {
      if (lastTime !== null) elapsedRef.current += Math.min(time - lastTime, 60);
      lastTime = time;
      const cycle = elapsedRef.current % cycleDuration;
      const fade = cycle >= resetStart ? 1 - (cycle - resetStart) / resetDuration : 1;
      needleRefs.current.forEach(needle => needle?.setAttribute('opacity', '0'));

      glyphs.forEach((glyph, index) => {
        const progress = Math.max(0, Math.min((cycle - startTimes[index]) / durations[index], 1));
        // Advance in short stitches, with the needle landing at exactly the new thread tip.
        const stitchCount = Math.max(1, Math.ceil(lengths[index] / 6));
        const sewn = progress >= 1 ? 1 : Math.floor(progress * stitchCount) / stitchCount;
        setGlyph(index, sewn, fade);
        if (progress > 0 && progress < 1) {
          const point = pathRefs.current[index]?.getPointAtLength(sewn * lengths[index]);
          const needle = needleRefs.current[glyph.lineIndex];
          if (point && needle) {
            const puncture = 1 - 0.16 * Math.sin(progress * stitchCount * Math.PI * 2);
            needle.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(-28) scale(${puncture})`);
            needle.setAttribute('opacity', '1');
          }
        }
      });
      frame = requestAnimationFrame(animate);
    };
    const syncPlayback = () => {
      cancelAnimationFrame(frame);
      lastTime = null;
      if (visible && !document.hidden) frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      syncPlayback();
    }, { threshold: 0.15 });
    if (rootRef.current) observer.observe(rootRef.current);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', syncPlayback);
    };
  }, [lengths, paused, reducedMotion, glyphs]);

  return (
    <div className="stitch-heading-wrap" ref={rootRef}>
      <h1 className="stitch-headline">
        <span className="sr-only">{lines.map(line => line.text).join(' ')}</span>
        {lines.map((line, lineIndex) => (
          <svg key={line.text} aria-hidden="true" preserveAspectRatio="xMinYMid meet" viewBox={`0 0 ${line.width} 120`} style={{ width: `${line.width / 100}em` }} className={`stitch-headline-line${(line.accent ?? lineIndex === lines.length - 1) ? ' stitch-headline-orange' : ''}`}>
            <defs>
              <pattern id={`${id}-thread-${lineIndex}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
                <rect width="4" height="4" fill="currentColor" />
                <path d="M0 0H4" stroke="#fff" strokeWidth="0.8" opacity="0.3" />
                <path d="M0 3H4" stroke="#0b1220" strokeWidth="0.6" opacity="0.35" />
              </pattern>
              {line.glyphs.map((glyph, letterIndex) => {
                const index = lineOffsets[lineIndex] + letterIndex;
                return <mask key={index} id={`${id}-reveal-${index}`} maskUnits="userSpaceOnUse" x="-12" y="-12" width={line.width + 24} height="144"><path ref={element => { revealRefs.current[index] = element; }} d={glyph.path} fill="none" stroke="white" strokeWidth="7" pathLength="100" strokeDasharray="100" strokeDashoffset="100" /></mask>;
              })}
            </defs>
            {line.glyphs.map((glyph, letterIndex) => {
              const index = lineOffsets[lineIndex] + letterIndex;
              return <g key={index}>
                <path ref={element => { guideRefs.current[index] = element; }} d={glyph.path} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeDasharray="0.1 5" opacity="0.85" />
                <path ref={element => { fillRefs.current[index] = element; }} d={glyph.path} fill={`url(#${id}-thread-${lineIndex})`} opacity="0" className="stitched-letter-fill" />
                <g ref={element => { threadRefs.current[index] = element; }} mask={`url(#${id}-reveal-${index})`}>
                  <path ref={element => { pathRefs.current[index] = element; }} d={glyph.path} fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="butt" strokeDasharray="3.5 2.5" />
                  <path d={glyph.path} fill="none" stroke="#fff" strokeWidth="0.55" strokeLinecap="butt" strokeDasharray="3.5 2.5" opacity="0.45" transform="translate(-0.4 -0.4)" />
                </g>
              </g>;
            })}
            <g ref={element => { needleRefs.current[lineIndex] = element; }} opacity="0">
              <path d="M0 -27C17 -42 28 -14 43 -29" fill="none" stroke="#ffab76" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M0 0L-2.2 -28Q0 -34 2.2 -28Z" fill="#e2e8f1" stroke="#8499b7" strokeWidth="0.6" />
              <ellipse cx="0" cy="-27" rx="0.85" ry="2" fill="#0b1220" />
              <circle cx="0" cy="0" r="1.8" fill="#ffab76" />
            </g>
          </svg>
        ))}
      </h1>
      {!reducedMotion && <button type="button" className="headline-animation-control" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume headline stitching animation' : 'Pause headline stitching animation'} aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />}<span>{paused ? 'Resume stitching' : 'Pause stitching'}</span></button>}
    </div>
  );
}
