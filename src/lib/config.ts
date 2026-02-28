const config = {
  roleLevelIds: [
    "1477063790766985329",
    "1477063853354516490",
    "1477063892130599014",
    "1477063917074387087",
  ],
};

export function getMaxLevel(): number {
  return config.roleLevelIds.length;
}

export function getNthRoleId(level: number): string | undefined {
  return config.roleLevelIds[level - 1];
}
