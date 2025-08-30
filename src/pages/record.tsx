import Calendar from '@components/calendar/calendar';
import { useState } from 'react';

export default function MonthlyRecordPage() {
  const [selected, setSelected] = useState(new Date());

  return (
    <main className="mx-auto w-full max-w-[440px] p-4">
      <section>
        <Calendar
          value={selected}
          onChange={setSelected}
          marked={['2025-08-01', '2025-08-08', '2025-08-09', '2025-08-15', '2025-08-27']}
        />
      </section>
    </main>
  );
}
