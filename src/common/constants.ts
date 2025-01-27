import * as fs from "node:fs";
import type { Sport } from "./types.ts";

export const INTRODUCTORY_MESSAGE =
  "Welcome to GIGASKIBA! I help you record entries from your sports tracker app to the competition. \
Firstly, you need to accept this privacy policy to continue.";

export const PRIVACY_POLICY =
  "GIGASKIBA stores your name, Telegram user ID and username, \
guild and the year you started your studies in, in a database that is maintained by Prodeko. \
Additionally, for every entry that you make, its timestamp, the distance travelled, and the sport are saved to the same database. \
Images that you send are handled by Telegram. \
\
The developers of GIGASKABA and the competition's administrators have access to all the data that you have sent, \
and will perform spot checks to verify the integrity of the competition.";

export const START_REGISTRATION_MESSAGE =
  "You have not registered previously, so I'll ask you a few questions first.";

export const PRIVACY_RETRY_MESSAGE =
  "Sorry, you need to accept the privacy policy to continue.";

export const PRIVACY_REJECTED_MESSAGE =
  "Sorry, you need to accept the privacy policy to continue. Restart the chat with /start.";

export const HELP_TEXT = fs.readFileSync("./src/common/help.html").toString();
export const RULES_TEXT = fs.readFileSync("./src/common/rules.html").toString();

export const GUILDS = ["prodeko", "athene", "mysteeri", "vieras"] as const;

export const UNEXPECTED_GUILD_MESSAGE = "Please enter a valid guild.";

export const NOT_REGISTERED_MESSAGE =
  "Not a user yet! Use /start to make an user";

// Registration
export const CONFIRM_REGISTERATION_MESSAGE = "Is this information correct?";
export const ENTER_GUILD_MESSAGE = "Which guild do you represent?";
export const GUILD_MESSAGE = "Guild";
export const ENTER_FRESHMAN_YEAR_MESSAGE = "What is your freshman year?";
export const FRESHMAN_YEAR_MESSAGE = "Freshman year";
export const USE_BUTTONS_MESSAGE = "Please use the buttons above!";
export const LETS_TRY_AGAIN_MESSAGE = "Lets try again";
export const REGISTRATION_SUCCESSFUL_MESSAGE = "Welcome to GIGASKABA";

// Entry
export const SPORT_TYPE_MESSAGE =
  "Welcome back! How did you cover ground today?";
export const INVALID_SPORT_MESSAGE = "Please enter a valid sport.";
export const DISTANCE_MESSAGE = "What distance (km) did you";
export const NOT_A_NUMBER_MESSAGE = "Please enter a number in kilometers.";
export const POSITIVE_NUMBER_MESSAGE = "Please give a positive number 👀";
export const MAX_ENTRY_DISTANCE_KM = 300;
export const SUSPICIOUS_DISTANCE_MESSAGE =
  `Please give the distance in kilometers 👀. If you really did over ${MAX_ENTRY_DISTANCE_KM}km in one go, contact the admins`;
export const IMAGE_PROOF_MESSAGE = "Please send proof as an image.";
export const EXPECTED_IMAGE_MESSAGE =
  "Oops! I expected to receive a single image.";
export const ENTRY_ADDED_MESSAGE = "Entry added!";

const firstFreshmanYear = 1970;
const currentYear = new Date(Date.now()).getFullYear();
export const YEARS = [
  ...Array.from(Array(currentYear - firstFreshmanYear).keys()).map(
    (k) => `${firstFreshmanYear + k}`,
  ),
].reverse();
export const SPORTS = ["swim", "run", "walk", "ski", "skate", "cycle"] as const;
export const COEFFICIENTS: Record<Sport, number> = {
  swim: 5,
  run: 1.75,
  walk: 1.75,
  ski: 1,
  skate: 0.5,
  cycle: 0.5,
};
// The limit for the number of points that is needed to achieve the milestone
export const MILESTONE_LIMIT = 400;

export const INVALID_INPUT_STICKERS = [
  "CAACAgQAAxkBAAIDpGPZi6i22MLQy6eNj5DQEFhhv03uAAJkAAOBtmEJhHIBjFv2YK4tBA",
  "CAACAgQAAxkBAAIDpWPZi-IJLNMb0rhuRosmOxPRKYRjAAIRAAMIW6I0f79c9yzsNwItBA",
  "CAACAgQAAxkBAAIDpmPZjDUXOWL6SUoHPYmBXmLKqe4eAAJOAAM9f8Yax_59jQ1ZOa8tBA",
  "CAACAgQAAxkBAAIDqGPZjL0ZauQIswAB0WdpkDNyHJzdiAACIQADLCsdGV__YWNEO0hILQQ",
];

export const STICKERS = [
  "CAACAgQAAxkBAAN9Y9fD79mLlcT-b1IuCwFcibPjfMgAAqEAA3YD_QnFW3eOjjP74C0E",
  "CAACAgQAAxkBAAN-Y9fD7-av5d8U1rXPT3vZ2MEDJxMAAqIAA3YD_Qkit76i7qnQgy0E",
  "CAACAgQAAxkBAAN_Y9fD79-0KRil-x60pHYvzbIuJDMAAqMAA3YD_Qm1yB95YuQCGC0E",
  "CAACAgQAAxkBAAOAY9fD77UwtMqfjQKZziaUSKNOoEoAAqQAA3YD_QnkMvucX0JcNC0E",
  "CAACAgQAAxkBAAOBY9fD74uwVaVDuuUxfR0DKZ-Q1pYAAqYAA3YD_QmhAcspclIAAYwtBA",
  "CAACAgQAAxkBAAOCY9fD76JMsz5qijtnqBMt0lSmf0MAAqcAA3YD_QnQjSNtZf3d8C0E",
  "CAACAgQAAxkBAAODY9fD7wt5bCOoX5-txba1XsAYufMAAqgAA3YD_QkPL-EGHEHXDC0E",
  "CAACAgQAAxkBAAOEY9fD78i4BNZqqVPikxpDWnbznHMAAqkAA3YD_Qk0SkPJeJJnoy0E",
  "CAACAgQAAxkBAAOFY9fD78Gi86589n83zuNSPP0LyGEAAqoAA3YD_Qm_nPQ-RlORRy0E",
  "CAACAgQAAxkBAAOGY9fD70dIEtFNLdksBUf6UEpK7ZQAAqsAA3YD_QnGuQdKAecEMS0E",
  "CAACAgQAAxkBAAOHY9fD74gqGOgpBM4TONRpcYG892AAAqwAA3YD_QlifLD2FljFaS0E",
  "CAACAgQAAxkBAAOIY9fD70EjiAzudqVxUH6yJ_-zWewAAq0AA3YD_Ql4pQepwAABYsgtBA",
  "CAACAgQAAxkBAAOJY9fD73_PnYY8kMoab_Xcy3jWsKUAAq4AA3YD_QmBjYq7KektTy0E",
  "CAACAgQAAxkBAAOKY9fD77HzqlbP5xBJWIvm1ezpJj0AAq8AA3YD_QnfIaqOyQ65Zi0E",
  "CAACAgQAAxkBAAOLY9fD7xN-gbr-NnQnCGt8Y0z8vQQAArAAA3YD_QnNtyDlf2mJES0E",
  "CAACAgQAAxkBAAOMY9fD71kC5wjOUmfJuEypty7kuF0AArEAA3YD_Qn0QcauVbCS_y0E",
  "CAACAgQAAxkBAAONY9fD7y23X8MOXJKthbTmcmnr4P0AArIAA3YD_QkE512wVcyk8y0E",
  "CAACAgQAAxkBAAOOY9fD-z_B4t5dO1I5vCpU8H-xEsUAArcAA3YD_QkpbD2ZcMEY3y0E",
  "CAACAgQAAxkBAAOPY9fD-8Gxi1wobUhGf6SGO9jr2joAArUAA3YD_Qk6cHc9YgaPmy0E",
  "CAACAgQAAxkBAAOQY9fD-7oKU9wgbR64nxIZtJ90MmEAArMAA3YD_Qmi5HPNDVrqoi0E",
  "CAACAgQAAxkBAAORY9fD-xXPAAGPOI_2ZwL-DEOb5iELAAK5AAN2A_0JPgf30FmV0XgtBA",
  "CAACAgQAAxkBAAOSY9fD-5BHgaKEATXV_Ys5Z4BoU4QAArMAA3YD_Qmi5HPNDVrqoi0E",
  "CAACAgQAAxkBAAOTY9fD-w4yQIcacAAC2fpmG0VS_xkAAroAA3YD_QkuQk4-3DHFSS0E",
  "CAACAgQAAxkBAAOUY9fD-74sMDEM7pgbsZpXkNLXR-gAArsAA3YD_QmgvVTZJUFO3i0E",
  "CAACAgQAAxkBAAOVY9fD--l59eGwttTsdjAFm-kgygkAArwAA3YD_QknYW1HKkg_Fy0E",
  "CAACAgQAAxkBAAOWY9fD--x9tFQn1bmLq514sOXhkYcAAr0AA3YD_QkPexUPfgnk-C0E",
  "CAACAgQAAxkBAAOXY9fD_O0dpunkIe-KX6KPFtd18jYAArQAA3YD_Qlj7w8AAZq-lZ4tBA",
  "CAACAgQAAxkBAAOYY9fD_OcSmvdzyx9KzqqnRiVIBhcAArYAA3YD_Qln5fqoyAABnb0tBA",
  "CAACAgQAAxkBAAOZY9fD-zt6-Y5Zt16dF_gjXq0fRK4AAvcIAAL5DNFRffa-0TwJdIQtBA",
  "CAACAgQAAxkBAAOaY9fD-5vCGYtsDGC93Hj5z7UgJVwAAmELAAI4HMhRrDe9CUvhy-ItBA",
  "CAACAgQAAxkBAAObY9fD-wRbwnrZmIQHjH5F_m-zQBwAApcKAAIXCchRHKL5lZZBevgtBA",
  "CAACAgQAAxkBAAOcY9fD-7GmENUnLmHuIUMQrM9QqWAAAg8LAALeh9FRNE8JjUJoGHstBA",
  "CAACAgQAAxkBAAOdY9fD-yBHKZhq_si4mK1ELsJTQ0oAApYNAAKj8clRCLrkMqtXjrgtBA",
  "CAACAgQAAxkBAAOeY9fD-yhtDLBTCSBX6r71r4gE0p0AAusJAALJedFR-VGYM02nQ10tBA",
];
