import * as React from "react"

interface ResponsiveContainerProps {
  width: string
  height: number
  children: React.ReactNode
}

interface BarChartProps {
  data: any[]
  children: React.ReactNode
}

interface AxisProps {
  dataKey?: string
  stroke?: string
  fontSize?: number
  tickLine?: boolean
  axisLine?: boolean
  tickFormatter?: (value: number) => string
}

interface BarProps {
  dataKey: string
  fill: string
  radius?: number[]
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children, ...props }) => (
  <div style={{ width: props.width, height: props.height }}>{children}</div>
)

export const BarChart: React.FC<BarChartProps> = ({ children, data }) => (
  <div data-chart-data={JSON.stringify(data)}>{children}</div>
)

export const XAxis: React.FC<AxisProps> = (props) => {
  const { dataKey, stroke, fontSize, tickLine, axisLine, tickFormatter, ...rest } = props
  return <div data-axis="x" {...rest} />
}

export const YAxis: React.FC<AxisProps> = (props) => {
  const { dataKey, stroke, fontSize, tickLine, axisLine, tickFormatter, ...rest } = props
  return <div data-axis="y" {...rest} />
}

export const Tooltip: React.FC = () => null

export const Bar: React.FC<BarProps> = (props) => {
  const { dataKey, fill, radius, ...rest } = props
  return <div data-bar data-key={dataKey} style={{ backgroundColor: fill, borderRadius: radius?.join('px ') }} {...rest} />
}