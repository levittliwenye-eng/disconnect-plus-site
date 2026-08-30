export type LocaleText = {
  en: string;
  zh: string;
};

export type LinkItem = {
  label: string;
  url: string;
};

export type Song = {
  id: string;
  title: LocaleText;
  duration: string;
  release: string;
  audioUrl: string;
  lyrics?: LocaleText;
  links: LinkItem[];
  featured: boolean;
};

export type NewsItem = {
  id: string;
  date: string;
  category: LocaleText;
  title: LocaleText;
  summary: LocaleText;
  url?: string;
  pinned: boolean;
};

export type VisualItem = {
  id: string;
  title: LocaleText;
  type: LocaleText;
  imageUrl: string;
  videoUrl?: string;
  description: LocaleText;
};

export type Member = {
  id: string;
  name: LocaleText;
  role: LocaleText;
  imageUrl: string;
  bio: LocaleText;
};

export type Show = {
  id: string;
  date: string;
  city: LocaleText;
  venue: LocaleText;
  title: LocaleText;
  ticketUrl?: string;
  status: "upcoming" | "past" | "secret";
};

export type PluginProject = {
  id: string;
  name: LocaleText;
  type: LocaleText;
  status: LocaleText;
  description: LocaleText;
  imageUrl: string;
  repoUrl: string;
  active: boolean;
  links: LinkItem[];
};

export type Product = {
  id: string;
  name: LocaleText;
  type: LocaleText;
  price: string;
  availability?: LocaleText;
  imageUrl: string;
  stock: number;
  active: boolean;
  externalUrl?: string;
};

export type OrderIntent = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  customerName: string;
  contact: string;
  notes: string;
  status: "new" | "contacted" | "paid" | "fulfilled" | "cancelled";
  createdAt: string;
};

export type SiteSettings = {
  contactEmail: string;
  bookingEmail: string;
  location: LocaleText;
  socials: LinkItem[];
};

export type CmsContent = {
  songs: Song[];
  news: NewsItem[];
  plugins: PluginProject[];
  visuals: VisualItem[];
  members: Member[];
  shows: Show[];
  products: Product[];
  settings: SiteSettings;
};
