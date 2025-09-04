import NotiBg from '@assets/images/noti-bg.png';
import Button from '@components/button/button';
import FriendsHeader from '@pages/friends/components/friends-header';
import FriendsTabs from '@pages/friends/components/friends-tab';
import SearchBar from '@pages/friends/components/search-bar';

export default function FriendsPage() {
  return (
    <div className="min-h-dvh flex-col pb-[15rem]" style={{ backgroundImage: `url(${NotiBg})` }}>
      <FriendsHeader />
      <div className="flex-col-center gap-[1.5rem] px-[2.4rem] py-[1.5rem]">
        <SearchBar placeholder="친구를 검색해 보세요" />
        <FriendsTabs />
        <div className="w-full flex-row-between">
          <span className="heading1-700">내 친구 목록</span>
          <Button className="body2-500 rounded-full bg-gray-50 px-[1.6rem] py-[0.55rem] text-primary-800 outline outline-primary-800">
            전체 보기
          </Button>
        </div>
      </div>
    </div>
  );
}
