import { fcmQueries } from '@apis/fcm/fcm-queries';
import NotiBg from '@assets/images/noti-bg.png';
import TipInfo from '@components/tipinfo';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

export default function NotificationsPage() {
  const { data = [] } = useQuery(fcmQueries.notifications());

  const notis = data.map((n) => ({
    id: n.id,
    title: n.body,
    date: dayjs(n.createdAt).format('YYYY.MM.DD'),
  }));

  return (
    <div className="fixed-layout inset-0 overflow-hidden">
      <div aria-hidden className="absolute inset-0">
        <img src={NotiBg} alt="" className="h-full w-full object-cover object-center" />
      </div>

      <main className="scrollbar-hide relative z-[1] mx-auto flex h-full w-full max-w-[43rem] flex-col overflow-y-auto">
        <section className="flex w-full flex-col gap-[1.5rem] px-[2.5rem] pt-[9rem] pb-[10rem]">
          {notis.map((n) => (
            <TipInfo key={n.id} title={n.title} text={n.date} />
          ))}
        </section>
      </main>
    </div>
  );
}
