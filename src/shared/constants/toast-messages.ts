export const TOAST_MSG = {
  PUSH: {
    ENV_MISSING: '아직 푸시 설정 기능이 추가되지 않았어요.',
    NOT_SUPPORTED: '현재 브라우저에서는 푸시 알림을 지원하지 않아요.',
    ENABLE_SUCCESS: '푸시 알림을 켰어요.',
    ENABLE_DENIED: '브라우저 알림이 차단되어 있어요. 사이트 권한에서 알림을 허용해 주세요.',
    ENABLE_FAIL: '푸시 알림을 활성화하지 못했어요. 잠시 후 다시 시도해 주세요.',
    DISABLE_SUCCESS: '푸시 알림을 껐어요.',
  },
  AUTH: {
    LOGOUT_SUCCESS: '로그아웃을 완료했어요.',
  },
} as const;

export type ToastMsgKey =
  | 'PUSH.ENV_MISSING'
  | 'PUSH.NOT_SUPPORTED'
  | 'PUSH.ENABLE_SUCCESS'
  | 'PUSH.ENABLE_DENIED'
  | 'PUSH.ENABLE_FAIL'
  | 'PUSH.DISABLE_SUCCESS'
  | 'AUTH.LOGOUT_SUCCESS';
