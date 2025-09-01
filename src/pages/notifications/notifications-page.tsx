import NotiBg from '@assets/images/noti-bg.png';
import TipInfo from '@components/tipinfo';

type Noti = { title: string; date: string };

const NOTIS: Noti[] = [
  { title: '감정 일기를 수정했습니다.', date: '2025.08.15' },
  { title: '새로운 댓글이 달렸습니다.', date: '2025.08.09' },
  { title: '감정 일기를 등록했습니다.', date: '2025.08.07' },
  { title: '감정 일기를 등록했습니다.', date: '2025.08.01' },
  { title: '마음:ON의 새로운 가족이 되었습니다.', date: '2025.08.01' },
];

export default function NotificationsPage() {
  return (
    <div className="fixed-layout inset-0 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${NotiBg})` }}
      />

      <main className="scrollbar-hide relative z-[1] mx-auto flex h-full w-full max-w-[43rem] flex-col overflow-y-auto">
        <section className="flex w-full flex-col gap-[1.5rem] px-[2.5rem] pt-[9rem] pb-[10rem]">
          {NOTIS.map((n) => (
            <TipInfo key={`${n.title}-${n.date}`} title={n.title} text={n.date} />
          ))}
        </section>
      </main>
    </div>
  );
}
