"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    users: 40,
    orders: 24,
  },
  {
    name: "Feb",
    users: 30,
    orders: 13,
  },
  {
    name: "Mar",
    users: 20,
    orders: 18,
  },
  {
    name: "Apr",
    users: 27,
    orders: 24,
  },
  {
    name: "May",
    users: 18,
    orders: 12,
  },
  {
    name: "Jun",
    users: 23,
    orders: 19,
  },
  {
    name: "Jul",
    users: 34,
    orders: 32,
  },
  {
    name: "Aug",
    users: 45,
    orders: 36,
  },
  {
    name: "Sep",
    users: 65,
    orders: 42,
  },
  {
    name: "Oct",
    users: 60,
    orders: 52,
  },
  {
    name: "Nov",
    users: 48,
    orders: 43,
  },
  {
    name: "Dec",
    users: 52,
    orders: 41,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `${value}`}
        />
        <Tooltip />
        <Bar dataKey="users" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
