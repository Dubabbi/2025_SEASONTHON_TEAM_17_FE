import defaultProfile from '@assets/icons/3d-hand.svg';
import LeaveConfirmSheet from '@components/bottom-sheet/leave-confirm-sheet';
import LogoutConfirmSheet from '@components/bottom-sheet/logout-confirm-sheet';
import NicknameChangeSheet from '@components/bottom-sheet/nickname-change-sheet';
import ProfilePhotoSheet from '@components/bottom-sheet/profile-photo-sheet';
import { useToast } from '@contexts/toast-context';
import useBottomSheet from '@hooks/use-bottom-sheet';
import useFcm from '@hooks/use-fcm';
import { cn } from '@libs/cn';
import InquiryAlertsSection from '@pages/my-page/components/inquiry-alerts-section';
import ProfileHeader from '@pages/my-page/components/profile-header';
import SectionTitle from '@pages/my-page/components/section-title';
import SettingRow from '@pages/my-page/components/setting-row';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function getMissingFcmEnvKeys() {
  const e = import.meta.env as Record<string, string | undefined>;
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_VAPID_KEY',
  ];
  return required.filter((k) => !e[k] || String(e[k]).trim() === '');
}

type MockProfile = {
  name: string;
  avatarUrl: string;
  provider: 'kakao';
  pushEnabled: boolean;
};

const MOCK_PROFILE: MockProfile = {
  name: '사용자',
  avatarUrl: defaultProfile,
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

  const goTerms = () => nav('/mypage/terms-service');
  const { supported, permission, enablePush, disablePush } = useFcm({
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    autoRequest: false,
  });
  const { showToast } = useToast?.() ?? {
    showToast: (msg: string) => alert(msg),
  };

  const handleTogglePush = async (next: boolean) => {
    if (next) {
      const missing = getMissingFcmEnvKeys();
      if (missing.length > 0) {
        showToast('아직 푸시 설정 기능이 추가되지 않았어요.');
        return;
      }

      if (supported === false) {
        showToast('현재 브라우저에서는 푸시 알림을 지원하지 않아요.');
        return;
      }

      const ok = await enablePush();
      if (!ok) {
        if (permission === 'denied') {
          showToast('브라우저 알림이 차단되어 있어요. 사이트 권한에서 알림을 허용해 주세요.');
        } else {
          showToast('푸시 알림을 활성화하지 못했어요. 잠시 후 다시 시도해 주세요.');
        }
        return;
      }
      setPushEnabled(true);
      showToast('푸시 알림을 켰어요.');
    } else {
      await disablePush();
      setPushEnabled(false);
      showToast('푸시 알림을 껐어요.');
    }
  };

  return (
    <div className={cn('min-h-dvh bg-gradient-bgd1 px-[2.4rem] pt-[1.6rem] pb-[12rem]')}>
      <main className="mx-auto w-full max-w-[43rem] flex-col gap-[3rem] pb-[6rem]">
        <div className="flex-col gap-[3.2rem]">
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
            onTogglePush={handleTogglePush} // 👈 기존 setPushEnabled 대신 이 핸들러 전달
            onOpenTerms={goTerms}
          />

          <section>
            <SectionTitle>로그아웃 및 탈퇴하기</SectionTitle>

            <SettingRow label="로그아웃" labelStyle="cursor-pointer" onClick={logoutSheet.open} />

            <SettingRow
              label="탈퇴하기"
              labelStyle="cursor-pointer"
              onClick={leaveSheet.open}
              className="border-b-0"
            />
          </section>
        </div>

        <footer className="detail flex-col-center text-gray-400">
          ©&nbsp;2025 MAEUM_ON. All rights reserved.
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
