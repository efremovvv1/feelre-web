export type Role = "user" | "assistant";

export type BubbleMessage = {
  kind: "bubble";
  id: string;
  role: Role;
  text: string;
  chips?: string[];
};

export type CardsMessage = {
  kind: "cards";
  id: string;
  text?: string;         // маленький заголовок для выдачи
  items: {
    id: string;
    title: string;
    image?: string;
    price?: string;
    badges?: string[];
    why?: string;
    link?: string;
  }[];
};

export type ChatItem = BubbleMessage | CardsMessage;