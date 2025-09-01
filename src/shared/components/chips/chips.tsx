import AngryIcon from '@assets/icons/angry.svg?react';
import ExcitingIcon from '@assets/icons/exciting.svg?react';
import HappyIcon from '@assets/icons/happy.svg?react';
import SadIcon from '@assets/icons/sad.svg?react';
import SurpriseIcon from '@assets/icons/surprise.svg?react';
import TiredIcon from '@assets/icons/tired.svg?react';
import ChipButton from '@components/chips/chip-button';

interface ChipsProps {
  size: 'small' | 'large';
  selected?: string[];
  emotions?: string[];
  onChange?: (selected: string[]) => void;
}

const chipsData = [
  { id: 'HAPPY', label: '행복', icon: HappyIcon },
  { id: 'SAD', label: '우울', icon: SadIcon },
  { id: 'EXCITE', label: '신남', icon: ExcitingIcon },
  { id: 'ANGRY', label: '분노', icon: AngryIcon },
  { id: 'TIRED', label: '피곤', icon: TiredIcon },
  { id: 'SURPRISE', label: '놀람', icon: SurpriseIcon },
];

const Chips = ({ size, selected = [], emotions, onChange }: ChipsProps) => {
  const handleClick = (id: string) => {
    if (selected.includes(id)) {
      onChange?.(selected.filter((chipId) => chipId !== id));
    } else {
      onChange?.([...selected, id]);
    }
  };

  const filteredChips = emotions
    ? chipsData.filter((item) => emotions.includes(item.id))
    : chipsData;

  return (
    <div className="flex flex-wrap gap-[1rem]">
      {filteredChips.map((item, _) => (
        <ChipButton
          key={item.id}
          size={size}
          Icon={item?.icon}
          isSelected={selected.includes(item.id)}
          onClick={() => handleClick(item?.id)}
        >
          {item?.label}
        </ChipButton>
      ))}
      {!emotions && size === 'small' && <ChipButton size={size}>직접 입력</ChipButton>}
    </div>
  );
};

export default Chips;
