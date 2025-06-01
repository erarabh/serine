'use client'
import { useState } from 'react'

type ToggleVoiceProps = {
  enabled: boolean
  onToggle: (value: boolean) => void
}

const ToggleVoice = ({ enabled, onToggle }: ToggleVoiceProps) => {
  const [checked, setChecked] = useState(enabled)

  const handleChange = () => {
    setChecked(!checked)
    onToggle(!checked)
  }

  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        className="form-checkbox text-purple-600"
        checked={checked}
        onChange={handleChange}
      />
      <span className="text-black">Voice</span>
    </label>
  )
}

export default ToggleVoice
