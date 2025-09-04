import NotiBg from '@assets/images/noti-bg.png';
import FriendsHeader from '@pages/friends/components/friends-header';

export default function FriendsPage() {
  return (
    <div className="min-h-dvh flex-col pb-[15rem]" style={{ backgroundImage: `url(${NotiBg})` }}>
      <FriendsHeader />

      <section className="flex-col px-[2rem] pt-[2rem]" />
    </div>
  );
}
