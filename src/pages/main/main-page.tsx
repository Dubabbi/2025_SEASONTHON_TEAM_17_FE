import Calendar from '@components/calendar/calendar';
import { useState } from 'react';

export default function MainPage() {
  const [selected, setSelected] = useState(new Date());

  return (
    <div className="flex-col px-[2.4rem] py-[2rem]">
      <div className="flex-col gap-[1.5rem]">
        <h1 className="heading1-700">월별 기록</h1>
        <section>
          <Calendar
            value={selected}
            onChange={setSelected}
            marked={['2025-08-01', '2025-08-08', '2025-08-09', '2025-08-15', '2025-08-27']}
          />
        </section>
      </div>{' '}
      <div className="flex-col gap-[1.5rem]">
        <h1 className="heading1-700">월별 기록</h1>
        <section>
          <Calendar
            value={selected}
            onChange={setSelected}
            marked={['2025-08-01', '2025-08-08', '2025-08-09', '2025-08-15', '2025-08-27']}
          />
        </section>
      </div>
    </div>
  );
}
