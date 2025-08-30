import ProfilePhotoSheet from '@components/bottom-sheet/profile-photo-sheet';
import { PrimaryCTA } from '@components/button/cta-button';
import useBottomSheet from '@hooks/use-bottom-sheet';

export default function ProfilePage() {
  const { isOpen, open, close } = useBottomSheet();

  return (
    <div className="flex-col-center py-[20rem]">
      <PrimaryCTA onClick={open}>프로필 사진 변경</PrimaryCTA>
      <ProfilePhotoSheet
        isOpen={isOpen}
        onClose={close}
        onSubmit={(file) => {
          // 업로드 API 호출 등
          console.log('selected file:', file);
        }}
      />
    </div>
  );
}
