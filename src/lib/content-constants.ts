import {
  Instagram, Music2, Youtube, Twitter, Linkedin, Mail, FileText,
  MessageSquare, Mic, Globe, type LucideIcon,
} from "lucide-react";

export const PLATFORMS = [
  "instagram", "tiktok", "youtube", "x", "linkedin",
  "email", "blog", "threads", "podcast", "other",
] as const;
export type Platform = typeof PLATFORMS[number];

export const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube", x: "X",
  linkedin: "LinkedIn", email: "Email", blog: "Blog",
  threads: "Threads", podcast: "Podcast", other: "Other",
};

export const PLATFORM_ICON: Record<Platform, LucideIcon> = {
  instagram: Instagram, tiktok: Music2, youtube: Youtube, x: Twitter,
  linkedin: Linkedin, email: Mail, blog: FileText,
  threads: MessageSquare, podcast: Mic, other: Globe,
};

export const CONTENT_TYPES = [
  "reel","carousel","static","story","long_video","short",
  "email_blast","blog_post","podcast_ep","thread","other",
] as const;
export type ContentType = typeof CONTENT_TYPES[number];

export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  reel: "Reel", carousel: "Carousel", static: "Static", story: "Story",
  long_video: "Long video", short: "Short", email_blast: "Email blast",
  blog_post: "Blog post", podcast_ep: "Podcast ep", thread: "Thread",
  other: "Other",
};

// Filter content_type options by chosen platform
export const TYPES_BY_PLATFORM: Record<Platform, ContentType[]> = {
  instagram: ["reel", "carousel", "static", "story"],
  tiktok:    ["short", "long_video"],
  youtube:   ["long_video", "short"],
  x:         ["thread", "static"],
  linkedin:  ["static", "carousel", "long_video", "thread"],
  email:     ["email_blast"],
  blog:      ["blog_post"],
  threads:   ["thread", "static"],
  podcast:   ["podcast_ep"],
  other:     ["other"],
};

export const CONTENT_STATUSES = [
  "idea","drafting","ready","scheduled","posted","archived",
] as const;
export type ContentStatus = typeof CONTENT_STATUSES[number];

export const STATUS_LABEL: Record<ContentStatus, string> = {
  idea: "Idea", drafting: "Drafting", ready: "Ready",
  scheduled: "Scheduled", posted: "Posted", archived: "Archived",
};

export const STATUS_COLOR: Record<ContentStatus, string> = {
  idea:      "hsl(30 8% 50%)",
  drafting:  "hsl(40 60% 50%)",
  ready:     "hsl(160 50% 42%)",
  scheduled: "hsl(210 70% 50%)",
  posted:    "hsl(140 55% 42%)",
  archived:  "hsl(30 5% 60%)",
};

export const CONTENT_MEDIA_BUCKET = "content-media";

export const PLATFORM_CHAR_LIMIT: Partial<Record<Platform, number>> = {
  x: 280,
  threads: 500,
  instagram: 2200,
  linkedin: 3000,
  tiktok: 2200,
  youtube: 5000,
};
