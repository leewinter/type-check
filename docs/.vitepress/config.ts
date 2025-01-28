import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Type Check",
  base: "/type-check/",
  description: "Type checking and validation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting-started" },
    ],

    sidebar: [
      {
        text: "Docs",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Type Checking", link: "/type-checking" },
          { text: "Validation", link: "/validation" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/leewinter/type-check" },
    ],
  },
});
