const files = {
  logo: "f03cc.png",
  avatar: "97bc9.png",
  overview: "dc7a0.svg",
  applications: "c85b1.svg",
  active: "30502.svg",
  completed: "38c88.svg",
  profile: "3c294.svg",
  settings: "487ed.svg",
  shield: "e607e.svg",
  chevron: "bce8b.svg",
  bell: "82805.svg",
  search: "b30b4.svg",
  send: "05c93.svg",
  briefcase: "8cb64.svg",
  check: "9baa1.svg",
  star: "03247.svg",
  more: "5a082.svg",
  arrow: "9e83f.svg",
};
export function asset(name) {
  return new URL(
    `../../../assets/figma/dashboard/${files[name]}`,
    import.meta.url,
  ).href;
}
