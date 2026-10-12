export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/main.js");

  // rok v patičce – doplní se při každém buildu
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  // "+420 602 292 351" -> "+420602292351"
  eleventyConfig.addFilter("tel", (s) => String(s).replace(/[^\d+]/g, ""));

  return {
    dir: { input: "src", output: "_site" },
  };
}
