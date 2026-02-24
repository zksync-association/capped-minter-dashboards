/** Valid minter type slugs for deploy routes and factory config. */
export const DEPLOY_TYPES = [
  "capped-v3",
  "capped-v2",
  "delay",
  "rate-limit",
] as const;

export type MinterType = (typeof DEPLOY_TYPES)[number];

/** Params for capped-v3 and capped-v2 deploy. */
export type DeployCappedParams = {
  mintable: `0x${string}`;
  admin: `0x${string}`;
  cap: bigint;
  startTime: number;
  expirationTime: number;
};

/** Params for delay minter deploy. */
export type DeployDelayParams = {
  mintable: `0x${string}`;
  admin: `0x${string}`;
  mintDelay: number;
};

/** Params for rate-limit minter deploy. */
export type DeployRateLimitParams = {
  mintable: `0x${string}`;
  admin: `0x${string}`;
  mintRateLimit: bigint;
  mintRateLimitWindow: number;
};

/** Map minter type to its deploy params. */
export type DeployParamsByType = {
  "capped-v3": DeployCappedParams;
  "capped-v2": DeployCappedParams;
  delay: DeployDelayParams;
  "rate-limit": DeployRateLimitParams;
};

/** Union of all deploy params (e.g. for generic helpers). */
export type DeployMinterParams = DeployParamsByType[MinterType];
