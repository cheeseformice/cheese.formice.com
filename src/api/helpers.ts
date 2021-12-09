import { LeaderboardType } from "./interfaces";
import { PlayerChangelogs, PlayerChangelogTypes } from "./players";
import { TribeChangelogs, TribeChangelogTypes } from "./tribes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fixIndices = (item: any, translationMap: Record<number, number>) => {
  if (typeof item !== "object") {
    return;
  }
  if (!Array.isArray(item)) {
    for (const key in item) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      fixIndices(item[key], translationMap);
    }
    return;
  }

  for (let i = 0; i < item.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const entry = item[i];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    entry[0] = translationMap[entry[0]];
  }
};

export function orderChangelogs<T extends TribeChangelogTypes[] | PlayerChangelogTypes[]>(
  logs: TribeChangelogs<T[number]> | PlayerChangelogs<T[number]>
): void {
  const orderedDates = Object.assign([], logs.dates).sort().reverse(); // shallow copy, sort & reverse

  const translationMap: Record<number, number> = {};
  for (let i = 0; i < logs.dates.length; i++) {
    const date = logs.dates[i];
    for (let j = 0; j < orderedDates.length; j++) {
      if (orderedDates[j] == date) {
        translationMap[i] = j;
        break;
      }
    }
  }

  for (const _key in logs) {
    const key = _key as keyof typeof logs;

    if (
      key !== "id" &&
      key !== "name" &&
      key !== "dates" &&
      // @ts-expect-error---
      key !== "cfmRoles" &&
      // @ts-expect-error---
      key !== "tfmRoles"
    ) {
      const item = logs[key];
      fixIndices(item, translationMap);
    }
  }

  logs.dates = orderedDates;
}

export function snakeCaseToCamelCase(input: string): string {
  return input
    .split("_")
    .reduce(
      (res, word, i) =>
        i === 0
          ? word.toLowerCase()
          : `${res}${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`,
      ""
    );
}

export function camelCaseDict<T = Record<string, unknown>>(dict: T): T {
  for (const key in dict) {
    const converted = snakeCaseToCamelCase(key) as keyof typeof dict;
    if (converted === key) {
      continue;
    }

    dict[converted] = dict[key];
    delete dict[key];
  }
  return dict;
}

export const leaderboardTypes: LeaderboardType[] = [
  "stats",
  "rounds",
  "cheese",
  "first",
  "bootcamp",
  "shaman",
  "racing",
  "survivor",
  "defilante",
  "overall",
];
