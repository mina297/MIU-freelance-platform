const files = {
  menu: "b25ea.svg",
  logo: "f03cc.png",
  avatar: "97bc9.png",
  reviewAvatar: "5cb28.png",
  overview: "dc7a0.svg",
  jobs: "67905.svg",
  applicants: "3b762.svg",
  active: "30502.svg",
  completed: "38c88.svg",
  profile: "3c294.svg",
  settings: "487ed.svg",
  shield: "e607e.svg",
  chevron: "bce8b.svg",
  bell: "82805.svg",
  plus: "b64c3.svg",
  briefcase: "8cb64.svg",
  users: "3fb0b.svg",
  clock: "47382.svg",
  checkCircle: "9baa1.svg",
  more: "5a082.svg",
  check: "7b694.svg",
  star: "f02e4.svg",
};
export function asset(name) {
  return new URL(`../../assets/figma/dashboard/${files[name]}`, import.meta.url)
    .href;
}
