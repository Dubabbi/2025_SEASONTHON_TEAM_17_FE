import Intro from '@components/intro';

export default function MainPage() {
  return (
    <div>
      <div className="heading1-700 flex-row-center py-6 text-primary-300">
        <p className="heading1-700 text-primary-300">메인 페이지</p>
      </div>
      <Intro />
    </div>
  );
}
