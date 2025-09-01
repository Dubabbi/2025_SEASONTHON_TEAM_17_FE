import LeaveConfirmSheet from '@components/bottom-sheet/leave-confirm-sheet';
import LogoutConfirmSheet from '@components/bottom-sheet/logout-confirm-sheet';
import NicknameChangeSheet from '@components/bottom-sheet/nickname-change-sheet';
import ProfilePhotoSheet from '@components/bottom-sheet/profile-photo-sheet';
import { PrimaryCTA } from '@components/button/cta-button';
import useBottomSheet from '@hooks/use-bottom-sheet';
import { useState } from 'react';

export default function ProfilePage() {
  const photoSheet = useBottomSheet();
  const leaveSheet = useBottomSheet();
  const logoutSheet = useBottomSheet();
  const nicknameSheet = useBottomSheet();

  const [nickname, setNickname] = useState('');
  const trimmed = nickname.trim();

  const handleNicknameSubmit = () => {
    console.log('submit nickname:', trimmed);
    nicknameSheet.close();
  };

  return (
    <div className="flex-col-center gap-[3rem]">
      <PrimaryCTA onClick={photoSheet.open}>프로필 사진 변경</PrimaryCTA>

      <PrimaryCTA className="bg-primary-800" onClick={nicknameSheet.open}>
        닉네임 변경
      </PrimaryCTA>

      <PrimaryCTA className="bg-error-default" onClick={leaveSheet.open}>
        탈퇴하기
      </PrimaryCTA>

      <PrimaryCTA className="bg-primary-800" onClick={logoutSheet.open}>
        로그아웃
      </PrimaryCTA>

      <ProfilePhotoSheet
        isOpen={photoSheet.isOpen}
        onClose={photoSheet.close}
        onSubmit={(file) => {
          console.log('selected file:', file);
          photoSheet.close();
        }}
      />

      <LeaveConfirmSheet
        isOpen={leaveSheet.isOpen}
        onClose={leaveSheet.close}
        onConfirm={() => {
          // TODO: 탈퇴 API
          leaveSheet.close();
        }}
      />

      <LogoutConfirmSheet
        isOpen={logoutSheet.isOpen}
        onClose={logoutSheet.close}
        onLogout={() => {
          // TODO: 로그아웃 처리
          logoutSheet.close();
        }}
      />

      <NicknameChangeSheet
        isOpen={nicknameSheet.isOpen}
        onClose={nicknameSheet.close}
        onSubmit={(name) => {
          console.log('submit nickname:', name);
          nicknameSheet.close();
        }}
      />
    </div>
  );
}
