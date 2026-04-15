
import { type FeedItem } from '../types';

const STANDARD_ACTIONS: FeedItem['actions'] = [
  { id: 'investigate', type: 'investigate', label: 'Investigate' },
  { id: 'task-personnel', type: 'task-personnel', label: 'Task Personnel' },
  { id: 'watch', type: 'watch', label: 'Watch' },
];

export const feedItems: FeedItem[] = [
  {
    id: '1',
    owner: {
      name: 'John Doe',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    title: 'Just spotted a massive pothole on 5th Ave.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    location: 'New York, NY',
    status: 'New',
    media: {
      type: 'image',
      src: 'https://plus.unsplash.com/premium_photo-1675697426189-21d696870759?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    caption: 'This needs to be fixed ASAP! It is a danger to motorists.',
    actions: STANDARD_ACTIONS,
  },
  {
    id: '2',
    owner: {
      name: 'Jane Smith',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    title: 'Illegal dumping at the park.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    location: 'Los Angeles, CA',
    status: 'For Verification',
    media: {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1611289392239-1c7d56a2d989?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    caption: 'Someone left a pile of trash near the playground. Can we get this cleaned up?',
    actions: STANDARD_ACTIONS,
  },
  {
    id: '3',
    owner: {
      name: 'Sam Wilson',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    title: 'Water pipe burst',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    location: 'Chicago, IL',
    status: 'Verified',
    media: {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1486338459733-31f64c639534?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    caption: 'A water pipe has burst on the corner of Elm and Maple. Water is flooding the street.',
    actions: STANDARD_ACTIONS,
  },
  {
    id: '4',
    owner: {
      name: 'Maria Garcia',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    title: 'Power outage in the neighborhood',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    location: 'Houston, TX',
    status: 'Immediate',
    media: {
      type: 'text',
      content: 'The power just went out in the entire neighborhood. Any updates on when it will be restored?',
    },
    caption: 'It has been more than 30 minutes and still not update from the utility company.',
    actions: STANDARD_ACTIONS,
  },
  {
    id: '5',
    owner: {
      name: 'David Lee',
      image: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    title: 'Fallen tree blocking the road',
    timestamp: new Date(Date.now() - 1000 * 10), // 10 seconds ago
    location: 'Miami, FL',
    status: 'Critical',
    media: {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1550189569-c1f03673c66f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    caption: 'A large tree has fallen and is blocking both lanes of traffic on Ocean Drive. Emergency services are needed immediately.',
    actions: STANDARD_ACTIONS,
  },
];

