import LeaveConfirmSheet from '@components/bottom-sheet/leave-confirm-sheet';
import LogoutConfirmSheet from '@components/bottom-sheet/logout-confirm-sheet';
import NicknameChangeSheet from '@components/bottom-sheet/nickname-change-sheet';
import ProfilePhotoSheet from '@components/bottom-sheet/profile-photo-sheet';
import useBottomSheet from '@hooks/use-bottom-sheet';
import { cn } from '@libs/cn';
import InquiryAlertsSection from '@pages/my-page/components/inquiry-alerts-section';
import ProfileHeader from '@pages/my-page/components/profile-header';
import SectionTitle from '@pages/my-page/components/section-title';
import SettingRow from '@pages/my-page/components/setting-row';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const photoSheet = useBottomSheet();
  const leaveSheet = useBottomSheet();
  const logoutSheet = useBottomSheet();
  const nicknameSheet = useBottomSheet();
  const nav = useNavigate();

  const [nickname, setNickname] = useState('사용자');
  const [pushEnabled, setPushEnabled] = useState(true);

  const goTerms = () => nav('/terms');

  return (
    <div className={cn('inset-0 overflow-y-auto bg-gradient-bgd1')}>
      <main className="mx-auto w-full max-w-[43rem] pb-[6rem]">
        <div className="px-[2.4rem] pt-[2.8rem] pb-[1.2rem]">
          <ProfileHeader name={nickname} avatarSrc="/assets/sample/minions.png" />
        </div>

        <section>
          <SectionTitle>회원정보 변경</SectionTitle>

          <SettingRow
            label="닉네임"
            subText={nickname}
            onClick={nicknameSheet.open}
            showChevron
            ariaLabel="닉네임 변경"
          />

          <SettingRow
            label="프로필 사진 변경"
            right={<span className="body2-500 text-gray-500">변경하기</span>}
            onClick={photoSheet.open}
            showChevron
            ariaLabel="프로필 사진 변경"
          />
        </section>

        <InquiryAlertsSection
          pushEnabled={pushEnabled}
          onTogglePush={setPushEnabled}
          onOpenTerms={goTerms}
        />

        <section>
          <SectionTitle>로그아웃 및 탈퇴하기</SectionTitle>

          <SettingRow label="로그아웃" onClick={logoutSheet.open} showChevron />

          <SettingRow
            label="탈퇴하기"
            onClick={leaveSheet.open}
            showChevron
            className="border-b-0"
          />
        </section>

        <footer className="px-[2.4rem] pt-[2.4rem] pb-[3.2rem]">
          <p className="detail text-gray-400">©&nbsp;2025 MAEUM_ON. All rights reserved.</p>
        </footer>
      </main>

      <ProfilePhotoSheet
        isOpen={photoSheet.isOpen}
        onClose={photoSheet.close}
        onSubmit={(file) => {
          console.log('selected file:', file);
          photoSheet.close();
        }}
      />

      <NicknameChangeSheet
        isOpen={nicknameSheet.isOpen}
        onClose={nicknameSheet.close}
        onSubmit={(name) => {
          setNickname(name);
          console.log('submit nickname:', name);
          nicknameSheet.close();
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
    </div>
  );
}
