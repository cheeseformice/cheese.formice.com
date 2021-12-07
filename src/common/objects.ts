export function meetsExpectation(
  exp: Record<string, unknown>,
  obj: Record<string, unknown>
): boolean {
  for (const key in exp) {
    const expValue = exp[key];
    const objValue = obj[key];

    if (typeof expValue !== typeof objValue) {
      return false;
    }

    if (typeof expValue === "object") {
      if (Array.isArray(expValue) !== Array.isArray(objValue)) {
        return false;
      }

      if (Array.isArray(expValue) && Array.isArray(objValue)) {
        const found: Record<string | number, boolean> = {};

        for (let i = 0; i < objValue.length; i++) {
          found[objValue[i] as string | number] = true;
        }

        for (let i = 0; i < expValue.length; i++) {
          if (found[expValue[i] as string | number]) {
            // any of the elements was found
            return true;
          }
        }
        return false;
      }

      // both dictionaries
      if (
        !meetsExpectation(
          expValue as unknown as Record<string, unknown>,
          objValue as Record<string, unknown>
        )
      ) {
        return false;
      }
    } else if (expValue !== objValue) {
      return false;
    }
  }
  return true;
}

export function isEqual(a: unknown, b: unknown): boolean {
  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === "object") {
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) {
        return false;
      }
      if (a.length !== b.length) {
        return false;
      }

      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i])) {
          return false;
        }
      }

      return true;
    } else {
      const dictA = a as Record<string, unknown>;
      const dictB = b as Record<string, unknown>;

      const checked: Record<string, boolean> = {};

      for (const key in dictA) {
        checked[key] = true;
        if (!isEqual(dictA[key], dictB[key])) {
          return false;
        }
      }
      for (const key in dictB) {
        if (!checked[key]) {
          // missing key in a
          return false;
        }
      }

      return true;
    }
  } else {
    return a === b;
  }
}

export function getDifferences(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  prefix = ""
): string[] {
  if (prefix) {
    prefix += ".";
  }

  const updates = [];
  const keys: Record<string, boolean> = {};

  for (const key in a) {
    keys[key] = true;
  }
  for (const key in b) {
    keys[key] = true;
  }

  for (const key in keys) {
    const full = `${prefix}${key}`;

    const childA = a[key];
    const childB = b[key];

    if (typeof childA === "object" && typeof childB == "object") {
      if (!Array.isArray(childA) && !Array.isArray(childB)) {
        const childUpdates = getDifferences(
          childA as Record<string, unknown>,
          childB as Record<string, unknown>,
          full
        );
        if (childUpdates.length > 0) {
          updates.push(full);
          updates.push(...childUpdates);
        }
        continue;
      }
    }

    if (!isEqual(childA, childB)) {
      updates.push(full);
    }
  }

  return updates;
}
