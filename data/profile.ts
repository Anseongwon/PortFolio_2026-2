export type ContactIconName = "email" | "github" | "instagram" | "blog";

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  icon: ContactIconName;
  isPlaceholder?: boolean;
};

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: "ansung0508@naver.com",
    href: "mailto:ansung0508@naver.com",
    icon: "email",
  },
  {
    label: "GitHub",
    value: "github.com/Anseongwon",
    href: "https://github.com/Anseongwon",
    icon: "github",
  },
  {
    label: "Blog",
    value: "blog.naver.com/asvvstudy",
    href: "https://blog.naver.com/asvvstudy",
    icon: "blog",
  },
  {
    label: "Instagram",
    value: "instagram.com/seongvvon",
    href: "https://www.instagram.com/seongvvon/",
    icon: "instagram",
  },
];
