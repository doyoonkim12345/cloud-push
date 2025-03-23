import boxen from "boxen";
import * as picocolors from "picocolors";

export const link = (url: string) => {
  return picocolors.green(picocolors.underline(url));
};

export const banner = boxen(
  [
    `${picocolors.bold("eas-update")}`,
    "",
    `Github: ${link("https://github.com/gronxb/hot-updater")}`,
    "Give a ⭐️ if you like it!",
  ].join("\n"),
  {
    padding: 1,
    borderStyle: "round",
    borderColor: "green",
    textAlignment: "center",
  }
);
