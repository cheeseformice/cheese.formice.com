export const getExperienceNeeded = (level: number) => {
  if (level >= 1 && level <= 29) return 32 + (level - 1) * (level + 2);
  else if (level >= 30 && level <= 59) return 900 + 5 * (level - 29) * (level + 30);
  return 14250 + (15 * (level - 59) * (level + 60)) / 2;
};

export const getLevel = (experience: number): number => {
  let c = 0;
  if (experience <= 0) return 0;
  for (let i = 1; i >= 0; i++) {
    const exp = getExperienceNeeded(i);
    if (exp + c >= experience) return i;
    else c += exp;
  }
  return 0;
};

export const getTotalExperienceNeeded = (level: number) => {
  let exp = 0;
  for (let i = 1; i <= level; i++) exp += getExperienceNeeded(i);
  return exp;
};
