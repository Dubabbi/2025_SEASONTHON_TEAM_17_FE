import sample from '@assets/images/default-profile.png';
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

type MockProfile = {
  name: string;
  avatarUrl: string;
  provider: 'kakao';
  pushEnabled: boolean;
};

const MOCK_PROFILE: MockProfile = {
  name: '사용자',
  avatarUrl: sample,
  provider: 'kakao',
  pushEnabled: true,
};

export default function ProfilePage() {
  const photoSheet = useBottomSheet();
  const leaveSheet = useBottomSheet();
  const logoutSheet = useBottomSheet();
  const nicknameSheet = useBottomSheet();
  const nav = useNavigate();

  const [nickname, setNickname] = useState(MOCK_PROFILE.name);
  const [avatar, setAvatar] = useState(MOCK_PROFILE.avatarUrl);
  const [pushEnabled, setPushEnabled] = useState(MOCK_PROFILE.pushEnabled);

  const goTerms = () => nav('/terms');

  return (
    <div className={cn('min-h-dvh bg-gradient-bgd1 pt-[1.6rem] pb-[5rem]')}>
      <main className="mx-auto w-full max-w-[43rem] pb-[6rem]">
        <ProfileHeader name={nickname} avatarSrc={avatar} />

        <section>
          <SectionTitle>회원정보 변경</SectionTitle>

          <SettingRow
            label="닉네임"
            subText={nickname}
            onClick={nicknameSheet.open}
            showIcon
            ariaLabel="닉네임 변경"
          />

          <SettingRow
            label="프로필 사진 변경"
            right={<span className="body2-500 text-gray-500">변경하기</span>}
            onClick={photoSheet.open}
            showIcon
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

          <SettingRow label="로그아웃" onClick={logoutSheet.open} showIcon />

          <SettingRow label="탈퇴하기" onClick={leaveSheet.open} showIcon className="border-b-0" />
        </section>

        <footer className="px-[2.4rem] pt-[2.4rem] pb-[3.2rem]">
          <p className="detail text-gray-400">©&nbsp;2025 MAEUM_ON. All rights reserved.</p>
        </footer>
      </main>

      <ProfilePhotoSheet
        isOpen={photoSheet.isOpen}
        onClose={photoSheet.close}
        onSubmit={async (file) => {
          const url = await fileToDataUrl(file);
          setAvatar(url);
          photoSheet.close();
        }}
      />

      <NicknameChangeSheet
        isOpen={nicknameSheet.isOpen}
        onClose={nicknameSheet.close}
        onSubmit={(name) => {
          setNickname(name);
          nicknameSheet.close();
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
        isOpen={logoutSheet.isOpen}
        onClose={logoutSheet.close}
        onLogout={() => {
          logoutSheet.close();
        }}
      />
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
