import CheckIcon from '@assets/icons/toast-check.svg?react';

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="pt-[1rem]">
      <div className="w-full flex-row-center gap-[0.8rem] rounded-[16px] bg-primary-500 px-[2rem] py-[1.6rem] shadow-md">
        <CheckIcon className="h-[2.4rem] w-[2.4rem]" />
        <span className="heading3-500 text-gray-50">{message}</span>
      </div>
    </div>
  );
}
