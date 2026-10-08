import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isAddress as viemIsAddress, parseUnits } from "viem"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getChainId(): number {
  return Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 324
}

export function getBlockExplorerAddressUrl(address: string): string {
  const ZKSYNC_MAINNET_EXPLORER = "https://explorer.zksync.io"
  const ZKSYNC_SEPOLIA_EXPLORER = "https://sepolia.explorer.zksync.io"
  const base =
    getChainId() === 300
      ? ZKSYNC_SEPOLIA_EXPLORER
      : ZKSYNC_MAINNET_EXPLORER
  return `${base}/address/${address}`
}

export function formatTokenAmount(
  value: bigint,
  decimals = 18,
  symbol = "ZK"
): string {
  const divisor = BigInt(10 ** decimals)
  const whole = value / divisor
  return `${Number(whole).toLocaleString()} ${symbol}`
}

export function parseTokenAmount(value: string, decimals = 18): bigint {
  const trimmed = value.trim()
  const [, fraction = ""] = trimmed.split(".")
  if (fraction.length > decimals) {
    throw new Error(`Token amount cannot have more than ${decimals} decimal places`)
  }
  return parseUnits(trimmed, decimals)
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function truncateAddress(address: string): string {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Deploy form validation (undefined = valid, string = error message)

/** Valid: 0x + 40 hex characters (EIP-55 optional). */
export function validateAddress(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return "Required"
  if (!viemIsAddress(trimmed))
    return "Invalid Ethereum address (0x + 40 hex characters)"
  return undefined
}

/** Same as address but must not be the zero address. */
export function validateAdmin(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return "Required"
  if (!viemIsAddress(trimmed))
    return "Invalid Ethereum address (0x + 40 hex characters)"
  if (trimmed.toLowerCase() === ZERO_ADDRESS.toLowerCase())
    return "Admin cannot be the zero address"
  return undefined
}

/** Human-readable number for cap or rate limit. Must be > 0. */
export function validatePositiveNumber(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return "Required"
  let amount: bigint
  try {
    amount = parseTokenAmount(trimmed)
  } catch {
    return "Must be a valid token amount"
  }
  if (amount <= 0n) return "Must be greater than 0"
  return undefined
}

/** Start time must be >= current time (Unix seconds). */
export function validateStartTime(
  value: number | null,
  nowSeconds: number
): string | undefined {
  if (value == null) return "Required"
  if (value < nowSeconds) return "Start time must be in the future"
  return undefined
}

/** Expiration time must be >= start time (Unix seconds). */
export function validateExpirationTime(
  value: number | null,
  startTime: number | null
): string | undefined {
  if (value == null) return "Required"
  if (startTime != null && value < startTime)
    return "Expiration must be on or after start time"
  return undefined
}

/** Duration in seconds (e.g. mint delay, rate limit window). Must be > 0. */
export function validateDurationSeconds(
  totalSeconds: number
): string | undefined {
  if (totalSeconds <= 0)
    return "Must be greater than 0 (set at least one of days, hours, minutes)"
  return undefined
}