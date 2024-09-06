import { store } from '@/utils'
import { Box, Paper, useTheme } from '@mui/material'
import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from 'recharts'

function AnnualChart() {
  const theme = useTheme()
  const state = store.useState()
  const yearData = state.dashboard.weekStatus.yearRevenue
  const data = Object.keys(yearData).map((o: string) => {
    return {
      name: yearData[o].name,
      value: yearData[o].value.toFixed(2),
    }
  })
  return (
    <Box
      width="100%"
      height="100%"
      component={Paper}
      padding={theme.spacing(2)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}>
          <defs>
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
            contentStyle={{ background: theme.palette.background.paper }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stackId="1"
            stroke={theme.palette.primary.main}
            fill="url(#thisMonth)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default AnnualChart
