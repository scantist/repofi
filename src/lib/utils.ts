import { type ClassValue, clsx } from "clsx"
import Decimal from "decimal.js"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true
})

const moneyFormatterWithoutGrouping = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false
})

export function getNumberWithUnit(num: number) {
  const absNum = Math.abs(num)
  if (absNum >= 1e9) {
    return { value: num / 1e9, unit: "B" } // Billion
  }
  if (absNum >= 1e6) {
    return { value: num / 1e6, unit: "M" } // A Million
  }
  if (absNum >= 1e3) {
    return { value: num / 1e3, unit: "K" } // A Thousand
  }
  return { value: num, unit: "" }
}

export function formatNumberWithUnit(num: number) {
  const { value, unit } = getNumberWithUnit(num)
  return `${formatMoney(value, false, false)}${unit}`
}
export function formatNumber(num: number) {
  const { value, unit } = getNumberWithUnit(num)
  return `${value}${unit}`
}

export const formatMoney = (amount: string | number, grouping = true, shortFormat = true): string => {
  const _amount = new Decimal(amount)
  const numberAmount = _amount.toNumber()

  return shortFormat ? formatNumberWithUnit(numberAmount) : grouping ? moneyFormatter.format(numberAmount) : moneyFormatterWithoutGrouping.format(numberAmount)
}

export const formatSignificantDigits = (value: string | number, sigDigits = 4): string => {
  const num = typeof value === "string" ? Number.parseFloat(value) : value
  if (Number.isNaN(num)) return "0"

  const formatted = num.toPrecision(sigDigits)
  return Number.parseFloat(formatted).toString() // Remove trailing zeros
}

export async function convertToBase64(file: File) {
  return new Promise<string | undefined>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    reader.onload = () => resolve(reader.result?.toString().split(",")[1])
    reader.onerror = () => reject(new Error("File reading error"))
  })
}

export const makeFileName = (file: File) => {
  const ext = file.name.split(".").pop() ?? ""
  const originalName = file.name.replace(`.${ext}`, "")
  return `${Date.now()}_${originalName
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .substring(0, 10)}.${ext}`
}

export function getSearchParam(key: string): string | null {
  if (typeof window === "undefined") return null
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(key)
}

export function* pageGenerator(current: number, total: number) {
  for (let i = 1; i <= total; ++i) {
    if (total <= 7 || i === 1 || i === total) {
      yield i
    } else if (i === 2) {
      yield current > 4 ? null : i
    } else if (i === total - 1) {
      yield current < total - 3 ? null : i
    } else if (Math.abs(current - i) < 2 || (current <= 4 && i <= 5) || (current >= total - 3 && i >= total - 4)) {
      yield i
    }
  }
}

/**
 * Get the UTC time
 * @param hours - The hours to add to the UTC time
 * @param minutes - The minutes to add to the UTC time
 * @param seconds - The seconds to add to the UTC time
 * @returns The UTC time
 */
export const getUTCTime = (hours = 0, minutes = 0, seconds = 0) => {
  const now = new Date()
  const utcMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes, seconds))
  return utcMidnight
}

export function chunkArray<T>(array: T[], size = 2): T[][] {
  return array.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size)
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = []
    }
    chunks[chunkIndex].push(item)
    return chunks
  }, [] as T[][])
}

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Prefix the logger with a prefix
 * @param logger - The logger to prefix
 * @param prefix - The prefix to add to the logger
 * @returns The prefixed logger
 */
export function prefixLogger(logger: Console, prefix: string): Console {
  return new Proxy(logger, {
    get(target, prop) {
      const originalMethod = target[prop as keyof Console]
      if (typeof originalMethod === "function" && ["log", "info", "warn", "error", "debug"].includes(prop as string)) {
        return (...args: unknown[]) => {
          // biome-ignore lint/complexity/noBannedTypes: <explanation>
          return (originalMethod as Function).call(target, prefix, ...args) as undefined
        }
      }
      return originalMethod
    }
  })
}

/**
 * Format numbers with adaptive decimal places
 * For numbers >= 0.01: display with 2 decimal places
 * For numbers < 0.01:
 * - Show up to the first non-zero digit
 * - If there are non-zero digits after the first non-zero digit, show one more digit
 * - If there are only zeros after the first non-zero digit, don't show extra zeros
 *
 * @param value
 * @returns
 */
export function formatAdaptiveDecimal(value: number | string): string {
  const num = typeof value === "string" ? Number.parseFloat(value) : value

  if (Number.isNaN(num)) {
    return "0.00"
  }

  const absNum = Math.abs(num)

  if (absNum >= 0.01) {
    return num.toFixed(2)
  }
  if (absNum === 0) {
    return "0.00"
  }
  const strNum = absNum.toString()

  if (strNum.includes("e")) {
    const parts = strNum.split("e")
    const mantissa = parts[0]
    const exponent = Number.parseInt(parts[1] ?? "0")

    if (exponent < 0) {
      const absExponent = Math.abs(exponent)
      const mantissaParts = mantissa?.split(".") ?? []
      const intPart = mantissaParts[0] ?? ""
      const decPart = mantissaParts[1] ?? ""

      let result = "0."
      for (let i = 0; i < absExponent - intPart.length; i++) {
        result += "0"
      }

      const significantDigits = (intPart + decPart).replace(/^0+/, "")

      let hasMoreNonZero = false
      for (let i = 1; i < significantDigits.length; i++) {
        if (significantDigits[i] !== "0") {
          hasMoreNonZero = true
          break
        }
      }

      if (hasMoreNonZero) {
        result += significantDigits.substring(0, 2)
      } else {
        result += significantDigits[0]
      }

      return num < 0 ? `-${result}` : result
    }
  }

  const decimalPart = strNum.includes(".") ? strNum.split(".")[1] : ""

  if (!decimalPart) {
    return num.toFixed(2)
  }

  let firstNonZeroPos = -1
  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart[i] !== "0") {
      firstNonZeroPos = i
      break
    }
  }

  if (firstNonZeroPos === -1) {
    return "0.00"
  }

  let hasMoreNonZero = false
  for (let i = firstNonZeroPos + 1; i < decimalPart.length; i++) {
    if (decimalPart[i] !== "0") {
      hasMoreNonZero = true
      break
    }
  }

  let result = "0."
  for (let i = 0; i < firstNonZeroPos; i++) {
    result += "0"
  }

  result += decimalPart[firstNonZeroPos]

  if (hasMoreNonZero) {
    result += decimalPart[firstNonZeroPos + 1]
  }

  return num < 0 ? `-${result}` : result
}

export const compareStringToUpperCase = (str1?: string | null, str2?: string | null): boolean => {
  const upperStr1 = str1?.toUpperCase() ?? ""
  const upperStr2 = str2?.toUpperCase() ?? ""

  return upperStr1 === upperStr2
}

export const extractOwnerRepo = (githubUrl?: string): string => {
  if (!githubUrl) return "Unknown Repo"

  try {
    const url = new URL(githubUrl)
    const pathSegments = url.pathname.split("/").filter(Boolean)
    return pathSegments.length >= 2 ? `${pathSegments[0]}/${pathSegments[1]}` : "Unknown Repo"
  } catch {
    return "Unknown Repo"
  }
}
