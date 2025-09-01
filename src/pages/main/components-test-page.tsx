import Diary3D from '@assets/icons/3d-diary.svg';
import Heart3D from '@assets/icons/3d-heart.svg';
import AddImageIcon from '@assets/icons/add-image.svg?react';
import ArrowIcon from '@assets/icons/arrow.svg?react';
import BookIcon from '@assets/icons/book.svg?react';
import ChatIcon from '@assets/icons/chat.svg?react';
import HeartIcon from '@assets/icons/heart.svg?react';
import HomeIcon from '@assets/icons/home.svg?react';
import ProfileIcon from '@assets/icons/profile.svg?react';
import InputField from '@components/inputfield';
import TextField from '@components/textfield';
import { useState } from 'react';

export default function TestPage() {
  const [Text, setText] = useState('');
  const [TitleText, setTitleText] = useState('');
  const [content, setContent] = useState('');

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

      <div className="flex-col p-[0.8rem]">
        <section className="flex-col gap-[0.4rem]">
          <InputField
            value={Text}
            onChange={(e) => setText(e.target.value)}
            variant={!Text ? 'default' : Text === '중복' ? 'error' : 'success'}
            placeholder="닉네임을 입력해주세요."
            helperText={
              !Text
                ? '2~10자 이내로 입력해주세요.'
                : Text === '중복'
                  ? '중복된 닉네임입니다.'
                  : '사용 가능한 닉네임입니다.'
            }
          />
        </section>

        <section className="flex-col gap-[0.4rem]">
          <InputField
            value={TitleText}
            onChange={(e) => setTitleText(e.target.value)}
            variant={!TitleText ? 'default' : TitleText.length >= 5 ? 'error' : 'success'}
            placeholder="제목을 입력해 주세요."
            helperText={
              TitleText
                ? TitleText.length >= 5
                  ? '제목이 100자 이상입니다.'
                  : '제목이 100자 이내입니다.'
                : undefined
            }
          />
        </section>

        <div className="flex-col gap-[1.2rem] p-[0.8rem]">
          <section className="flex-col gap-[1.2rem]">
            <TextField
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant={!content ? 'default' : content.length < 10 ? 'error' : 'success'}
              placeholder="내용을 입력해주세요."
              helperText={
                !content
                  ? '내용은 최소 100자 이상으로 적어야 합니다.'
                  : content.length < 10
                    ? `현재 ${content.length}자 (100자 이상 입력해야 합니다.)`
                    : `100자 넘었습니다. (현재 ${content.length}자)`
              }
            />
          </section>
        </div>
      </div>
    </div>
  );
}
