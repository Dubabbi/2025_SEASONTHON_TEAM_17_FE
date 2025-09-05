import AngryIcon from '@assets/icons/angry.svg?react';
import ExcitingIcon from '@assets/icons/exciting.svg?react';
import HappyIcon from '@assets/icons/happy.svg?react';
import SadIcon from '@assets/icons/sad.svg?react';
import SurpriseIcon from '@assets/icons/surprise.svg?react';
import TiredIcon from '@assets/icons/tired.svg?react';
import ChipButton from '@components/chips/chip-button';

const CHIPS_META = [
  { id: 'HAPPY', label: '행복', Icon: HappyIcon },
  { id: 'SAD', label: '우울', Icon: SadIcon },
  { id: 'EXCITE', label: '신남', Icon: ExcitingIcon },
  { id: 'ANGRY', label: '분노', Icon: AngryIcon },
  { id: 'TIRED', label: '피곤', Icon: TiredIcon },
  { id: 'SURPRISE', label: '놀람', Icon: SurpriseIcon },
] as const;

export type EmotionId = (typeof CHIPS_META)[number]['id'];
export type ReactionCounts = Record<EmotionId, number>;

interface Props {
  counts: ReactionCounts;
  myToggles: Set<EmotionId>;
  onToggle: (id: EmotionId) => void;
  order?: EmotionId[];
  className?: string;
  size?: 'small' | 'large';
}

export default function ReactionBarChipsLite({
  counts,
  myToggles,
  onToggle,
  order = ['HAPPY', 'SAD', 'ANGRY', 'EXCITE', 'TIRED', 'SURPRISE'],
  className,
  size = 'small',
}: Props) {
  const map = Object.fromEntries(CHIPS_META.map((m) => [m.id, m]));
  return (
    <div className={`flex flex-wrap gap-[1rem] ${className ?? ''}`}>
      {order.map((id) => {
        const meta = map[id];
        if (!meta) return null;
        const active = myToggles.has(id);
        const value = counts[id] ?? 0;
        return (
          <ChipButton
            key={id}
            size={size}
            Icon={meta.Icon}
            isSelected={active}
            onClick={() => onToggle(id)}
          >
            {`${meta.label} (${value})`}
          </ChipButton>
        );
      })}
    </div>
  );
}
