import AddImageIcon from '@assets/icons/add-image.svg?react';
import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import { PrimaryCTA } from '@components/button/cta-button';
import { cn } from '@libs/cn';
import { useEffect, useMemo, useRef, useState } from 'react';

interface ProfilePhotoSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (file: File) => void;
  className?: string;
}

export default function ProfilePhotoSheet({
  isOpen,
  onClose,
  onSubmit,
  className,
}: ProfilePhotoSheetProps) {
  const [file, setFile] = useState<File | null>(null);
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  useEffect(() => {
    if (!isOpen) setFile(null);
  }, [isOpen]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleSubmit = () => {
    if (file && onSubmit) onSubmit(file);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} className={cn('px-[2rem] pb-[4rem]', className)}>
      <h2 className="heading2-600 px-[2.4rem] text-gray-900">변경할 프로필 사진을 올려주세요</h2>

      <div className="flex-col-center gap-[0.9rem] pt-[1.8rem] pb-[1.4rem]">
        <input
          ref={inputRef}
          id="profile-file"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <label
          htmlFor="profile-file"
          className={cn(
            'flex-row-center cursor-pointer',
            'h-[6.4rem] w-[6.4rem] rounded-full',
            'border border-gray-300 bg-gray-50',
            'box-shadow',
          )}
        >
          {url ? (
            <img src={url} alt="미리보기" className="h-full w-full rounded-full object-cover" />
          ) : (
            <AddImageIcon className="h-[2.4rem] w-[2.4rem] text-gray-600" />
          )}
        </label>
        <span className="body2-600 text-gray-900">사진 올리기</span>
      </div>

      <div className="pt-[0.4rem]">
        <PrimaryCTA onClick={handleSubmit} disabled={!file} className="bg-primary-800">
          프로필 사진 변경하기
        </PrimaryCTA>
      </div>
    </BottomSheet>
  );
}
