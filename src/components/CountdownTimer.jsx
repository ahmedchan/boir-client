/* eslint-disable react/display-name */
import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback
} from "react"

const CountdownTimer = forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ minutes = 5, onCountdownCompleted }, ref) => {
    const initialTime = minutes * 60 // Convert minutes to seconds
    const [timeLeft, setTimeLeft] = useState(initialTime)
    const [isFinished, setIsFinished] = useState(false)

    // Reset timer function
    const resetTimer = useCallback(() => {
      setTimeLeft(initialTime)
      setIsFinished(false)
    }, [initialTime])

    useEffect(() => {
      if (isFinished && onCountdownCompleted) {
        onCountdownCompleted() // Trigger the callback if the countdown is finished
      }
    }, [isFinished, onCountdownCompleted])

    useEffect(() => {
      // Check if the countdown has finished
      if (timeLeft === 0) {
        setIsFinished(true) // Set the countdown as finished
        return // Stop the effect when time reaches 0
      }

      // Set up the interval that decreases timeLeft every second
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
      }, 1000)

      // Clear the interval when the component unmounts or timeLeft updates
      return () => clearInterval(intervalId)
    }, [timeLeft])

    // Convert timeLeft (seconds) into minutes and seconds
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60)
      const secondsLeft = seconds % 60
      return `${minutes < 10 ? "0" : ""}${minutes}:${
        secondsLeft < 10 ? "0" : ""
      }${secondsLeft}`
    }

    // Expose the reset function via ref
    useImperativeHandle(ref, () => ({
      resetTimer
    }))

    return (
      <div>
        <h1 className="text-white">{formatTime(timeLeft)}</h1>
      </div>
    )
  }
)

export default CountdownTimer
