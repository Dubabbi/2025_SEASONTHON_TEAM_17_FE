import Calendar from '@components/calendar/calendar';
import TipInfo from '@components/tipinfo';
import { useState } from 'react';

export default function DiaryRecordPage() {
  const [selected, setSelected] = useState(new Date());

  return (
    <div className="flex-col gap-[3rem] px-[2.4rem] pt-[2.2rem] pb-[17rem]">
      <TipInfo
        title="나의 감정 일기 기록 이용 TIP"
        text="아래 날짜를 클릭하면 당시 기록한 감정 일기를 볼 수 있어요"
      />
      <div className="flex-col gap-[1.5rem]">
        <h1 className="heading1-700">월별 기록</h1>
        <section>
          <Calendar
            value={selected}
            onChange={setSelected}
            marked={[
              '2025-08-01',
              '2025-08-08',
              '2025-08-09',
              '2025-08-15',
              '2025-08-27',
              '2025-09-03',
              '2025-09-14',
            ]}
          />
        </section>
      </div>
      <div>{/* TODO: 다이어리 컴포넌트 추가 */}</div>
    </div>
  );
}
