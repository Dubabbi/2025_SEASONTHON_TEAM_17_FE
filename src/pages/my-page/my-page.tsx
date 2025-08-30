import LeaveConfirmSheet from '@components/bottom-sheet/leave-confirm-sheet';
import LogoutConfirmSheet from '@components/bottom-sheet/logout-confirm-sheet';
import ProfilePhotoSheet from '@components/bottom-sheet/profile-photo-sheet';
import { PrimaryCTA } from '@components/button/cta-button';
import useBottomSheet from '@hooks/use-bottom-sheet';

export default function ProfilePage() {
  const photoSheet = useBottomSheet();
  const leaveSheet = useBottomSheet();
  const logout = useBottomSheet();
  return (
    <div className="flex-col-center gap-[3rem]">
      <PrimaryCTA onClick={photoSheet.open}>프로필 사진 변경</PrimaryCTA>

      <PrimaryCTA className="bg-error-default" onClick={leaveSheet.open}>
        탈퇴하기
      </PrimaryCTA>
      <PrimaryCTA className="bg-primary-800" onClick={logout.open}>
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
          leaveSheet.close();
        }}
      />
      <LogoutConfirmSheet
        isOpen={logout.isOpen}
        onClose={logout.close}
        onLogout={() => {
          logout.close();
        }}
      />
    </div>
  );
}
