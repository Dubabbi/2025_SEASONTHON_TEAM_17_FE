import Diary3D from '@assets/icons/3d-diary.svg';
import Heart3D from '@assets/icons/3d-heart.svg';
import AddImageIcon from '@assets/icons/add-image.svg?react';
import ArrowIcon from '@assets/icons/arrow.svg?react';
import BookIcon from '@assets/icons/book.svg?react';
import ChatIcon from '@assets/icons/chat.svg?react';
import HeartIcon from '@assets/icons/heart.svg?react';
import HomeIcon from '@assets/icons/home.svg?react';
import ProfileIcon from '@assets/icons/profile.svg?react';
import { ButtonExample } from '@components/button/ex-button';

export default function MainPage() {
  return (
    <div>
      <div className="heading1-700 flex-row-center text-primary-300">
        <p className="heading1-700 text-primary-300">메인 페이지</p>
        <img alt="3D 아이콘" className="h-[10rem] w-[10rem]" src={Diary3D} />
        <img alt="3D 아이콘" className="h-[10rem] w-[10rem]" src={Heart3D} />
      </div>
      <div className="flex-row-between p-[2rem]">
        <ArrowIcon className="h-[2.8rem] w-[2.8rem] text-primary-800" />
        <BookIcon className="h-[2.8rem] w-[2.8rem] text-primary-800" />
        <ChatIcon className="h-[2.8rem] w-[2.8rem] text-primary-800" />
        <HeartIcon className="h-[2.8rem] w-[2.8rem] text-primary-800" />
        <HomeIcon className="h-[2.8rem] w-[2.8rem] text-primary-800" />
        <ProfileIcon className="h-[2.8rem] w-[2.8rem] text-primary-800" />
        <AddImageIcon className="h-[2.8rem] w-[2.8rem] text-primary-800" />
      </div>
      <div className="flex-row-between p-[2rem]">
        <ArrowIcon className="h-[2.8rem] w-[2.8rem] text-gray-800" />
        <BookIcon className="h-[2.8rem] w-[2.8rem] text-gray-800" />
        <ChatIcon className="h-[2.8rem] w-[2.8rem] text-gray-800" />
        <HeartIcon className="h-[2.8rem] w-[2.8rem] text-gray-800" />
        <HomeIcon className="h-[2.8rem] w-[2.8rem] text-gray-800" />
        <ProfileIcon className="h-[2.8rem] w-[2.8rem] text-gray-800" />
        <AddImageIcon className="h-[2.8rem] w-[2.8rem] text-gray-800" />
      </div>
      <ButtonExample />
    </div>
  );
}
