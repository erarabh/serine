'use client'
import { FC } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  start: Date
  end: Date
  onChange: (start: Date, end: Date) => void
}

export const DateRangePicker: FC<Props> = ({ start, end, onChange }) => (
  <div className="flex gap-2">
    <DatePicker
      selected={start}
      selectsStart
      startDate={start}
      endDate={end}
      onChange={(d) => d && onChange(d, end)}
      className="border px-2 py-1 rounded"
    />
    <DatePicker
      selected={end}
      selectsEnd
      startDate={start}
      endDate={end}
      minDate={start}
      onChange={(d) => d && onChange(start, d)}
      className="border px-2 py-1 rounded"
    />
  </div>
)