export const conversations = [
  {
    id: '1',
    user: {
      fullName: 'Sarah Wilson',
      profilePic: '/avatars/03.png',
      isOnline: true
    },
    lastMessage: 'Thanks for the study tips! They really helped me with my calculus exam.',
    time: '2 minutes ago',
    unreadCount: 2,
    isPinned: true,
    isArchived: false
  },
  {
    id: '2',
    user: {
      fullName: 'Mike Johnson',
      profilePic: '/avatars/02.png',
      isOnline: false
    },
    lastMessage: 'I have some practice problems that might help. DM me if you want them!',
    time: '1 hour ago',
    unreadCount: 0,
    isPinned: false,
    isArchived: false
  },
  {
    id: '3',
    user: {
      fullName: 'Alex Chen',
      profilePic: '/avatars/04.png',
      isOnline: true
    },
    lastMessage: 'Hey! Are you going to the tech meetup this weekend?',
    time: '3 hours ago',
    unreadCount: 1,
    isPinned: false,
    isArchived: false
  },
  {
    id: '4',
    user: {
      fullName: 'Emma Davis',
      profilePic: '/avatars/05.png',
      isOnline: false
    },
    lastMessage: 'The React tutorial you shared was amazing!',
    time: '1 day ago',
    unreadCount: 0,
    isPinned: true,
    isArchived: false
  },
  {
    id: '5',
    user: {
      fullName: 'Tom Brown',
      profilePic: '/avatars/06.png',
      isOnline: false
    },
    lastMessage: 'Can you help me with the physics assignment?',
    time: '2 days ago',
    unreadCount: 0,
    isPinned: false,
    isArchived: true
  }
];

export const messages = [
  {
    id: '1',
    senderId: 'current',
    content: 'Hey Sarah! How did your calculus exam go?',
    time: '10:30 AM',
    isRead: true,
    conversationId: '1'
  },
  {
    id: '2',
    senderId: '1',
    content: 'It went really well! Thanks for asking. The study tips you shared were super helpful.',
    time: '10:32 AM',
    isRead: true,
    conversationId: '1'
  },
  {
    id: '3',
    senderId: 'current',
    content: 'That\'s awesome! I\'m so glad they helped. What was the hardest part?',
    time: '10:35 AM',
    isRead: true,
    conversationId: '1'
  },
  {
    id: '4',
    senderId: '1',
    content: 'The integration by parts problems were tricky, but I managed to work through them step by step.',
    time: '10:37 AM',
    isRead: true,
    conversationId: '1'
  },
  {
    id: '5',
    senderId: '1',
    content: 'Thanks for the study tips! They really helped me with my calculus exam.',
    time: '2 minutes ago',
    isRead: false,
    conversationId: '1'
  }
];
