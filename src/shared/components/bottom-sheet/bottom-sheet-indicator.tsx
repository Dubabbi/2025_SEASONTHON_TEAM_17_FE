import Indicator from '@assets/icons/indicator.svg?react';

interface BottomSheetIndicatorProps {
  onClick?: () => void;
}

const BottomSheetIndicator = ({ onClick }: BottomSheetIndicatorProps) => {
  return (
    <button type="button" className="flex-col-center cursor-pointer py-[1.2rem]" onClick={onClick}>
      <Indicator className="h-[0.4rem] w-[8rem]" />
    </button>
  );
};

export default BottomSheetIndicator;
