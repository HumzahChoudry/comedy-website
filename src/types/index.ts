export interface SiteConfig {
  name: string;
  tagline: string;
  bio: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  contactEmail: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    youtube: string;
    tiktok: string;
    facebook: string;
  };
  seoDescription: string;
  footerText: string;
}

export interface Photo {
  id: string;
  src: string;
  alt: string;
  caption: string;
  uploadedAt: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  addedAt: string;
  featured: boolean;
}

export interface TourDate {
  id: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl: string;
  soldOut: boolean;
  notes: string;
}
