export type GuestbookTag = "궁금해요" | "힘내요" | "좋아요" | "조언해요";

export type GuestbookReply = {
  _id: string;
  content: string;
  createdAt: string;
  isAdmin: boolean;
};

export type GuestbookMessage = {
  _id: string;
  nickname: string;
  content: string;
  tags: GuestbookTag[];
  createdAt: string;
  updatedAt: string;
  replies: GuestbookReply[];
  isPinned: boolean;
  isFavorite: boolean;
  roomThemeKey: string;
  roomColor: string;
  profileKey: string;
  profileImage: string;
};

export type GuestbookSort = "latest" | "oldest" | "favorite";
