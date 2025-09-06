import { authQueries } from '@apis/auth/auth-queries';
import defaultProfile from '@assets/icons/3d-hand.svg';
import LeaveConfirmSheet from '@components/bottom-sheet/leave-confirm-sheet';
import LogoutConfirmSheet from '@components/bottom-sheet/logout-confirm-sheet';
import NicknameChangeSheet from '@components/bottom-sheet/nickname-change-sheet';
import ProfilePhotoSheet from '@components/bottom-sheet/profile-photo-sheet';
import { TOAST_MSG } from '@constants/toast-messages';
import { useToast } from '@contexts/toast-context';
import useBottomSheet from '@hooks/use-bottom-sheet';
import useFcm from '@hooks/use-fcm';
import { cn } from '@libs/cn';
import InquiryAlertsSection from '@pages/my-page/components/inquiry-alerts-section';
import ProfileHeader from '@pages/my-page/components/profile-header';
import SectionTitle from '@pages/my-page/components/section-title';
import SettingRow from '@pages/my-page/components/setting-row';
import useLogout from '@pages/my-page/hooks/use-logout';
import { syncFcmWithServer, unsyncFcmFromServer } from '@pages/my-page/utils/fcm-sync';
import { fileToDataUrl, getMissingFcmEnvKeys } from '@pages/my-page/utils/file-to-data';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const logout = useLogout();
  const { data: me } = useQuery(authQueries.verify());

  const [nickname, setNickname] = useState(MOCK_PROFILE.name);
  const [avatar, setAvatar] = useState(MOCK_PROFILE.avatarUrl);
  const [pushEnabled, setPushEnabled] = useState(MOCK_PROFILE.pushEnabled);

  useEffect(() => {
    if (me?.email) {
      const name = me.email.split('@')[0] || MOCK_PROFILE.name;
      setNickname(name);
    }
  }, [me?.email]);

  const goTerms = () => nav('/mypage/terms-service');

  const { supported, permission, enablePush, disablePush, token } = useFcm({
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    autoRequest: false,
  });

  const { showToast } = useToast?.() ?? {
    showToast: (msg: string) => alert(msg),
  };

  const handleTogglePush = async (next: boolean) => {
    if (next) {
      const missing = getMissingFcmEnvKeys();
      if (missing.length > 0) return showToast(TOAST_MSG.PUSH.ENV_MISSING);
      if (supported === false) return showToast(TOAST_MSG.PUSH.NOT_SUPPORTED);

      const ok = await enablePush();
      if (!ok) {
        return showToast(
          permission === 'denied' ? TOAST_MSG.PUSH.ENABLE_DENIED : TOAST_MSG.PUSH.ENABLE_FAIL,
        );
      }

      const t = localStorage.getItem('fcm.token') || token;
      if (t) await syncFcmWithServer(t);
      setPushEnabled(true);
      showToast(TOAST_MSG.PUSH.ENABLE_SUCCESS);
    } else {
      await unsyncFcmFromServer();
      await disablePush();
      setPushEnabled(false);
      showToast(TOAST_MSG.PUSH.DISABLE_SUCCESS);
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
              clickTarget="right"
              ariaLabel="닉네임 변경"
            />

            <SettingRow
              label="프로필 사진 변경"
              right={<span className="body2-500 text-gray-500">변경하기</span>}
              onClick={photoSheet.open}
              showIcon
              clickTarget="right"
              ariaLabel="프로필 사진 변경"
            />
          </section>

          <InquiryAlertsSection
            pushEnabled={pushEnabled}
            onTogglePush={handleTogglePush}
            onOpenTerms={goTerms}
          />

          <section>
            <SectionTitle>로그아웃 및 탈퇴하기</SectionTitle>

            <SettingRow
              label="로그아웃"
              labelStyle="cursor-pointer"
              clickTarget="label"
              onClick={logoutSheet.open}
            />

            <SettingRow
              label="탈퇴하기"
              labelStyle="cursor-pointer"
              onClick={leaveSheet.open}
              className="border-b-0"
              clickTarget="label"
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
        onLogout={async () => {
          await logout();
          showToast(TOAST_MSG.AUTH.LOGOUT_SUCCESS);
          logoutSheet.close();
        }}
      />
    </div>
  );
}
