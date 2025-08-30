import Indicator from '@assets/icons/indicator.svg?react';

interface BottomSheetIndicatorProps {
  onClick?: () => void;
}

const BottomSheetIndicator = ({ onClick }: BottomSheetIndicatorProps) => {
  return (
    <button type="button" className="flex-col-center cursor-pointer py-[2.4rem]" onClick={onClick}>
      <Indicator className="h-[0.4rem] w-[8rem] text-gray-200" />
    </button>
  );
};

export default BottomSheetIndicator;
