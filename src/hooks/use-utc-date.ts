import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc' // Plugin for UTC support

dayjs.extend(utc)

/**
 * A custom React hook for managing UTC dates.
 * @param initialDate Optional initial date (default is the current date).
 * @returns A tuple containing the UTC date string and a function to update the date.
 */

export const useUTCDate = (initialDate: Dayjs = dayjs()): string => {
  // State to store the UTC date string
  const utcDateString = initialDate.utc().format()
  /**
   * Function to update the UTC date string.
   * @param date New date value in Day.js format.
   */

  return utcDateString
}

/**
 * Function to get the current UTC date string.
 * @returns The current UTC date string in "YYYY-MM-DDTHH:mm:ss.SSSZ" format.
 */
export const getUTCDateString = (): string => {
  // Get the current date in UTC format and return its string representation
  return dayjs().utc().format()
}

export default getUTCDateString
