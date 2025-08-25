import type { StaticImageData } from 'next/image';

import profileImage1 from '../../../../public/images/profileImages/profile-image1.png';
import profileImage2 from '../../../../public/images/profileImages/profile-image2.png';
import profileImage3 from '../../../../public/images/profileImages/profile-image3.png';

export type ProfileImg = string | StaticImageData;

export default function randomProfileImage(): ProfileImg {
  const randomImages = [
    {
      path: profileImage1,
      random: 60,
      name: '첫번째 프로필 이미지',
    },
    {
      path: profileImage2,
      random: 30,
      name: '두번째 프로필 이미지',
    },
    {
      path: profileImage3,
      random: 10,
      name: '세번째 프로필 이미지',
    },
  ];

  const totalRandom = randomImages.reduce((acc, cur) => acc + cur.random, 0);
  const randomValue = Math.random() * totalRandom;

  let cumulative = 0;
  for (const image of randomImages) {
    cumulative += image.random;
    if (randomValue < cumulative) {
      return image.path;
    }
  }
  return "<span className='text-4xl text-gray-500'>🙂</span>";
}
