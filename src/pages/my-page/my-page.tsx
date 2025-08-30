import DiaryCompleteSheet from '@components/bottom-sheet/diary-complete-sheet';
import LeaveConfirmSheet from '@components/bottom-sheet/leave-confirm-sheet';
import LogoutConfirmSheet from '@components/bottom-sheet/logout-confirm-sheet';
import ProfilePhotoSheet from '@components/bottom-sheet/profile-photo-sheet';
import { PrimaryCTA } from '@components/button/cta-button';
import useBottomSheet from '@hooks/use-bottom-sheet';

export default function ProfilePage() {
  const photoSheet = useBottomSheet();
  const leaveSheet = useBottomSheet();
  const logout = useBottomSheet();
  const sheet = useBottomSheet();
  return (
    <div className="flex-col-center gap-[3rem]">
      <PrimaryCTA onClick={photoSheet.open}>프로필 사진 변경</PrimaryCTA>
      <PrimaryCTA className="bg-error-default" onClick={leaveSheet.open}>
        탈퇴하기
      </PrimaryCTA>
      <PrimaryCTA className="bg-primary-800" onClick={logout.open}>
        로그아웃
      </PrimaryCTA>
      <PrimaryCTA className="bg-primary-800" onClick={sheet.open}>
        작성 완료 보기
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
      <DiaryCompleteSheet
        isOpen={sheet.isOpen}
        onClose={sheet.close}
        onGoRecords={() => {
          // TODO: 기록 페이지로 이동
          sheet.close();
        }}
        onGoMain={() => {
          // TODO: 메인 페이지로 이동
          sheet.close();
        }}
      />
    </div>
  );
}
