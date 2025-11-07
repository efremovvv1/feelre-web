import SetHeaderTitleI18n from '@/modules/web-ui/components/SetHeaderTitleI18n';
import PrivacyContent from './PrivacyContent';

export const metadata = {
  title: 'Privacy Policy — FEELRE',
  description: 'How FEELRE handles your personal data responsibly.',
};

export default function PrivacyPage() {
  return (
    <>
      <SetHeaderTitleI18n path="legal.privacy.title" />
      <PrivacyContent />
    </>
  );
}