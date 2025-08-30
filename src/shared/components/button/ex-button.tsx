import {
  ErrorCTA,
  GrayCTA,
  KakaoStartCTA,
  MaeumStartCTA,
  PrimaryCTA,
  PrimaryStrongCTA,
} from '@components/button/cta-button';
export function ButtonExample() {
  return (
    <div className="flex-col-center gap-[2rem] px-[2rem]">
      <KakaoStartCTA />
      <MaeumStartCTA />
      <PrimaryCTA>감정 일기 작성하기</PrimaryCTA>

      <GrayCTA>작성 완료</GrayCTA>

      <PrimaryStrongCTA>작성 완료</PrimaryStrongCTA>

      <PrimaryCTA className="bg-primary-800">나의 감정 일기 기록 보러 가기</PrimaryCTA>

      <ErrorCTA>취소</ErrorCTA>
      <div className="grid w-full flex-row-around grid-cols-2 gap-[2.5rem]">
        <ErrorCTA className="heading2-600 bg-gray-50 text-error-default outline outline-error-default">
          취소
        </ErrorCTA>
        <ErrorCTA labelClassName="heading2-600">로그아웃</ErrorCTA>
      </div>
    </div>
  );
}
