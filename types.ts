export enum ContentType {
  BLOG_POST = "Blog Post",
  INSTAGRAM_CAPTION = "Instagram Caption",
  AD_COPY = "Ad Copy",
  YOUTUBE_DESCRIPTION = "YouTube Description",
  PRODUCT_DESCRIPTION = "Product Description",
}

export enum Tone {
  PROFESSIONAL = "Professional",
  FUNNY = "Funny",
  FRIENDLY = "Friendly",
  PERSUASIVE = "Persuasive",
  CASUAL = "Casual",
}

export enum ContentLength {
  SHORT = "Short",
  MEDIUM = "Medium",
  LONG = "Long",
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface HistoryItem {
  id: string;
  topic: string;
  contentType: ContentType;
  tone: Tone;
  length: ContentLength;
  content: string;
  timestamp: number;
}
