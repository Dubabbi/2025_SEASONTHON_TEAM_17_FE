import SectionTitle from '@pages/my-page/components/section-title';
import SettingRow from '@pages/my-page/components/setting-row';
import ToggleSwitch from '@pages/my-page/components/toggle-switch';

type InquiryAlertsSectionProps = {
  pushEnabled: boolean;
  onTogglePush: (next: boolean) => void;
  onOpenTerms: () => void;
};

export default function InquiryAlertsSection({
  pushEnabled,
  onTogglePush,
  onOpenTerms,
}: InquiryAlertsSectionProps) {
  return (
    <section>
      <SectionTitle>문의 및 알림</SectionTitle>

      <SettingRow
        label="푸시 알림 활성화/비활성화"
        right={<ToggleSwitch checked={pushEnabled} onChange={onTogglePush} label="푸시 알림" />}
      />

      <SettingRow label="서비스 이용약관" onClick={onOpenTerms} showChevron />
    </section>
  );
}
