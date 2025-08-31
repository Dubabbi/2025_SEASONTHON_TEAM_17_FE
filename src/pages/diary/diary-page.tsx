import Button from '@components/button/button';
import Calendar from '@components/calendar/calendar';
import Banner from '@pages/diary/components/banner';
import { useState } from 'react';

export default function DiaryPage() {
  const [selected, setSelected] = useState(new Date());

  return (
    <div className="min-h-dvh w-full flex-col bg-cover bg-gradient-bgd1 bg-no-repeat pb-[8rem]">
      <Banner gradientClass="bg-gradient-bgd3" />
      <div className="flex-col px-[2rem]">
        <div className="flex-row-between">
          <div className="flex-col gap-[0.4rem] pt-[3.2rem] pb-[2rem]">
            <h1 className="heading1-700 text-gray-900">나의 감정 일기 기록</h1>
            <p className="body2-500 text-gray-500">날짜별로 정리하고 간단하게 확인할 수 있어요</p>
          </div>
          <Button className="body2-500 rounded-full bg-primary-100 px-[1.6rem] py-[0.55rem] text-primary-800">
            전체 기록 보기
          </Button>
        </div>
        <Calendar
          value={selected}
          onChange={setSelected}
          marked={['2025-08-01', '2025-08-08', '2025-08-09', '2025-08-15', '2025-08-27']}
        />
      </div>
    </div>
  );
}
