import { store } from '@/utils'
import { Box, Paper, Skeleton, Typography, useTheme } from '@mui/material'
import React, { PureComponent } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

function divideMonthIntoWeeks(year: number, month: number): Date[][] {
  const weeks: Date[][] = []

  // Get the first and last day of the month
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const lastDayOfMonth = new Date(year, month, 0)

  let currentWeek: Date[] = []
  const currentDate = new Date(firstDayOfMonth)

  // Iterate through each day of the month
  while (currentDate <= lastDayOfMonth) {
    currentWeek.push(new Date(currentDate))

    // If it's the last day of the week (Saturday), start a new week
    if (currentDate.getDay() === 6) {
      weeks.push(currentWeek)
      currentWeek = []
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Add the last week if it's not already included
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  return weeks
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
  }
  return date.toLocaleDateString('es-DO', options)
}
export default function MonthlyChart() {
  const theme = useTheme()
  const state = store.useState()
  const today = new Date()
  const currentMonthName = today.toLocaleString('es-DO', { month: 'long' })

  today.setMonth(today.getMonth() - 1)
  const previousMonthName = today.toLocaleString('es-DO', { month: 'long' })
  const data = Object.keys(state.dashboard.weekStatus.weeklySummaries)
    .map(key => {
      const year = new Date().getFullYear()
      const month = 1
      const weekNumber = parseInt(key, 10)

      // Ensure weekNumber is within a valid range
      if (weekNumber < 1) {
        // Handle the case where weekNumber is less than 1
        return null // or handle as appropriate
      }

      const weekRanges = divideMonthIntoWeeks(year, month)

      if (weekNumber > weekRanges.length) {
        return null
      }

      const startDate = weekRanges[weekNumber - 1][0]
      const endDate =
        weekRanges[weekNumber - 1][weekRanges[weekNumber - 1].length - 1]

      const weeklySummaryState = state.dashboard.weekStatus.weeklySummaries[key]

      if (!weeklySummaryState) {
        console.error(
          `Weekly summary state is undefined for week ${weekNumber}`,
        )
        return null
      }

      const weeklySummary: any = {}
      weeklySummary.name = ` (${formatDate(startDate)} - ${formatDate(
        endDate,
      )})`
      weeklySummary[previousMonthName] =
        weeklySummaryState.lastMonthSales.toFixed(2)
      weeklySummary[currentMonthName] =
        weeklySummaryState.thisMonthSales.toFixed(2)

      return weeklySummary
    })
    .filter(item => item !== null)

  if (state.dashboard.loadingWeekStatus) {
    return (
      <Box
        sx={{ height: { xs: '300px', sm: '100%' } }}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        component={Paper}>
        <Skeleton
          animation={'wave'}
          width={'100%'}
          height={'100%'}
          variant="rectangular"
          sx={{ '& span': { height: '100%' } }}
        />
      </Box>
    )
  }
  return (
    <Box
      width="100%"
      maxWidth={'100vw'}
      maxHeight={'400px'}
      component={Paper}
      display={'flex'}
      sx={{
        '& .recharts-bar-rectangle:hover': {
          background: theme.palette.background.default,
        },
        height: { xs: '200px', sm: '100%' },
      }}
      padding={theme.spacing(2)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={400} data={data}>
          <defs>
            <linearGradient id="pastMonth" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={theme.palette.secondary.main}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={theme.palette.secondary.main}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="thisMonth" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={theme.palette.primary.main}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={theme.palette.primary.main}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            cursor={{ fill: theme.palette.background.default }}
            contentStyle={{ background: theme.palette.background.paper }}
          />
          <Legend />
          <Bar
            type="monotone"
            dataKey={currentMonthName}
            stackId="2"
            stroke={theme.palette.primary.main}
            fill={theme.palette.primary.main}
          />
          <Bar
            type="monotone"
            dataKey={previousMonthName}
            stackId="1"
            stroke={theme.palette.secondary.main}
            style={{ background: theme.palette.background.paper }}
            fill={theme.palette.secondary.main}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
