import type React from 'react';
import { forwardRef } from 'react';

export interface TipInfoProps {
  title: React.ReactNode;
  text?: React.ReactNode;
  className?: string;
}

const WRAP_BASE =
  'px-[2.8rem] py-[2rem] bg-gray-50 bg-white rounded-[8px] outline outline-1 outline-offset-[-1px] outline-primary-500 flex-col-items-start gap-[1rem] overflow-hidden';

const TITLE_BASE = 'heading3-500 text-primary-500';
const TEXT_BASE = 'detail text-gray-500';

const TipInfo = forwardRef<HTMLDivElement, TipInfoProps>(function TipInfo(
  { title, text, className },
  ref,
) {
  return (
    <div ref={ref} className={[WRAP_BASE, className].filter(Boolean).join(' ')}>
      <div className={TITLE_BASE}>{title}</div>
      {text ? <div className={TEXT_BASE}>{text}</div> : null}
    </div>
  );
});

export default TipInfo;
