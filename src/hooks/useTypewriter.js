import { useState, useEffect, useRef } from 'react'

export function useTypewriter(lines, { speed = 40, lineDelay = 300, startOnView = true, isActive = true } = {}) {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!isActive || isComplete) return

    if (currentLineIndex >= lines.length) {
      setIsComplete(true)
      setIsTyping(false)
      return
    }

    const currentLine = lines[currentLineIndex]
    setIsTyping(true)

    if (currentCharIndex < currentLine.text.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev]
          if (newLines.length <= currentLineIndex) {
            newLines.push({ ...currentLine, text: '' })
          }
          newLines[currentLineIndex] = {
            ...currentLine,
            text: currentLine.text.slice(0, currentCharIndex + 1),
          }
          return newLines
        })
        setCurrentCharIndex((c) => c + 1)
      }, currentLine.instant ? 0 : speed)
    } else {
      timeoutRef.current = setTimeout(() => {
        setCurrentLineIndex((l) => l + 1)
        setCurrentCharIndex(0)
      }, lineDelay)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [currentLineIndex, currentCharIndex, isActive, lines, speed, lineDelay, isComplete])

  const reset = () => {
    setDisplayedLines([])
    setCurrentLineIndex(0)
    setCurrentCharIndex(0)
    setIsComplete(false)
    setIsTyping(false)
  }

  return { displayedLines, isComplete, isTyping, reset }
}
