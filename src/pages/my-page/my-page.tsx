import { authQueries } from '@apis/auth/auth-queries';
import { QK } from '@apis/constants/keys';
import { membersApi } from '@apis/members/members';
import { membersQueries } from '@apis/members/members-queries';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const photoSheet = useBottomSheet();
  const leaveSheet = useBottomSheet();
  const logoutSheet = useBottomSheet();
  const nicknameSheet = useBottomSheet();
  const nav = useNavigate();
  const logout = useLogout();

  const { data: me } = useQuery(authQueries.verify());
  const {
    data: mypage,
    refetch: refetchMypage,
    isFetching: isFetchingMypage,
  } = useQuery(membersQueries.mypage());

  const [nickname, setNickname] = useState<string>('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushToggling, setPushToggling] = useState(false);

  const serverNickname = mypage?.nickname ?? (me?.email ? me.email.split('@')[0] : '');
  const serverAvatar = mypage?.profileUrl;

  useEffect(() => {
    if (serverNickname && serverNickname !== nickname) {
      setNickname(serverNickname);
    }
  }, [serverNickname, nickname]);

  useEffect(() => {
    if (serverAvatar && serverAvatar !== avatar) {
      setAvatar(serverAvatar);
    }
  }, [serverAvatar, avatar]);

  const goTerms = () => nav('/mypage/terms-service');

  const { supported, permission, enablePush, disablePush, token } = useFcm({
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    autoRequest: false,
  });

  useEffect(() => {
    const enabled =
      permission === 'granted' &&
      !!(typeof window !== 'undefined' && (localStorage.getItem('fcm.token') || token));
    setPushEnabled(enabled);
  }, [permission, token]);

  const { showToast } = useToast?.() ?? {
    showToast: (msg: string) => alert(msg),
  };
  const qc = useQueryClient();

  const nicknameMut = useMutation({
    mutationFn: (name: string) => membersApi.updateNickname(name),
    onSuccess: async (res) => {
      const serverName = res?.data?.nickname ?? '';
      if (serverName) setNickname(serverName);
      await qc.invalidateQueries({ queryKey: QK.members.mypage() });
      showToast('닉네임이 변경되었어요.');
    },
    onError: () => showToast('닉네임 변경에 실패했어요. 다시 시도해 주세요.'),
  });
  const handleTogglePush = async (next: boolean) => {
    if (pushToggling) return;
    setPushToggling(true);
    try {
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
    } finally {
      setPushToggling(false);
    }
  };

  return (
    <div className={cn('min-h-dvh bg-gradient-bgd1 px-[2.4rem] pt-[1.6rem] pb-[12rem]')}>
      <main
        className="mx-auto w-full max-w-[43rem] flex-col gap-[3rem] pb-[6rem]"
        aria-busy={isFetchingMypage || pushToggling}
      >
        <div className="flex-col gap-[3.2rem]">
          <ProfileHeader name={nickname} avatarSrc={avatar ?? defaultProfile} />
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
            busy={pushToggling}
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
          // 업데이트 API 없음: 미리보기 후 조회만 다시
          const preview = await fileToDataUrl(file);
          setAvatar(preview);
          photoSheet.close();

          const res = await refetchMypage();
          const url = res.data?.profileUrl;
          if (url) setAvatar(url);
          showToast('업데이트 API 준비 전이라 조회만 새로고침 했어요.');
        }}
      />

      <NicknameChangeSheet
        isOpen={nicknameSheet.isOpen}
        onClose={nicknameSheet.close}
        onSubmit={async (name) => {
          const next = name.trim();
          if (!next || next === nickname) {
            nicknameSheet.close();
            return;
          }
          const prev = nickname;
          setNickname(next);
          try {
            await nicknameMut.mutateAsync(next);
          } catch {
            setNickname(prev);
          } finally {
            nicknameSheet.close();
          }
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
