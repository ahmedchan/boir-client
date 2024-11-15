/* eslint-disable react/prop-types */
import { useMemo } from "react"

const RE_DIGIT = new RegExp(/^\d+$/)

const OtpInput = ({ value, valueLength, disabled, onChange }) => {
  const inputClasses = `
         block
         w-full 
         text-center
         font-bold 
         border border-borderColor
         rounded 
         bg-white 
      `

  const valueItems = useMemo(() => {
    const valueArray = value.split("")
    const items = []

    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i]

      if (RE_DIGIT.test(char)) {
        items.push(char)
      } else {
        items.push("")
      }
    }

    return items
  }, [value, valueLength])

  const focusToNextInput = (target) => {
    const nextElementSibling = target.nextElementSibling

    if (nextElementSibling) {
      nextElementSibling.focus()
    }
  }

  const focusToPrevInput = (target) => {
    const previousElementSibling = target.previousElementSibling

    if (previousElementSibling) {
      previousElementSibling.focus()
    }
  }

  const inputOnChange = (e, idx) => {
    const target = e.target
    let targetValue = target.value.trim()
    const isTargetValueDigit = RE_DIGIT.test(targetValue)

    if (!isTargetValueDigit && targetValue !== "") {
      return
    }

    targetValue = isTargetValueDigit ? targetValue : " "

    const targetValueLength = targetValue.length

    if (targetValueLength === 1) {
      const newValue =
        value.substring(0, idx) + targetValue + value.substring(idx + 1)
      onChange(newValue)

      if (!isTargetValueDigit) {
        return
      }
      focusToNextInput(target)

      const nextElementSibling = target.nextElementSibling

      if (nextElementSibling) {
        nextElementSibling.focus()
      }
    } else if (targetValueLength === valueLength) {
      onChange(targetValue)

      target.blur()
    }
  }

  const inputOnKeyDown = (e) => {
    const { key } = e
    const target = e.target

    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault()
      return focusToNextInput(target)
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault()
      return focusToPrevInput(target)
    }

    const targetValue = target.value

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(0, targetValue.length)

    if (e.key !== "Backspace" || target.value !== "") {
      return
    }

    const previousElementSibling = target.previousElementSibling

    if (previousElementSibling) {
      previousElementSibling.focus()
    }

    if (e.key !== "Backspace" || targetValue !== "") {
      return
    }

    focusToPrevInput(target)
  }

  const inputOnFocus = (e) => {
    const { target } = e

    target.setSelectionRange(0, target.value.length)
  }

  return (
    <div
      className="otp-group d-flex gap-2 "
      style={{ direction: "ltr" }}
    >
      {valueItems?.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          style={{maxWidth: "68px", height: '42px'}}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          placeholder={"-"}
          disabled={disabled}
          maxLength={valueLength}
          className={inputClasses}
          value={digit}
          onChange={(e) => inputOnChange(e, idx)}
          onKeyDown={inputOnKeyDown}
          onFocus={inputOnFocus}
        />
      ))}
    </div>
  )
}

export default OtpInput
