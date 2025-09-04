import type { Friend } from '@pages/friends/components/friends-list-item';

export const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    name: '마몬',
    email: 'mamon@maeum.on',
    avatarUrl: null,
  },
  { id: '2', name: '마몬', email: 'mamon2@maeum.on', avatarUrl: null },
  {
    id: '3',
    name: '마몬',
    email: 'mamon3@maeum.on',
    avatarUrl: null,
  },
  { id: '4', name: '마몬', email: 'mamon4@maeum.on', avatarUrl: null },
];

export const MOCK_SENT: Friend[] = [
  { id: '11', name: '마몬', email: 'sent1@maeum.on', avatarUrl: null },
  {
    id: '12',
    name: '마몬',
    email: 'sent2@maeum.on',
    avatarUrl: null,
  },
];

export const MOCK_RECEIVED: Friend[] = [
  {
    id: '21',
    name: '마몬',
    email: 'recv1@maeum.on',
    avatarUrl: null,
  },
  { id: '22', name: '마몬', email: 'recv2@maeum.on', avatarUrl: null },
];
