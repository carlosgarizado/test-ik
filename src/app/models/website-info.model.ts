export interface IWebsiteInfo {
  id: number;
  name: string;
  domain: string;
  logo: string;
  banner: string;
  secondary_logo: string;
  brand_colors: IBrandColors;
  terms: string | null;
  privacy_policy: string | null;
  created: string;
  updated: string;
  company: number;
  captcha_key: string;
}
export interface IBrandColors {
  primary: string;
  secondary: string;
  [key: string]: string;
}
