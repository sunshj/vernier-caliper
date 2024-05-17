'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import PressContainer from './components/PressContainer'
import './global.css'

interface VernierCaliperProps {
  loading?: boolean
  loadingMainText?: string
  loadingViceText?: string
  mainImageBase64?: string
  viceImageBase64?: string
  onChange?: (answer: number) => void
}

export default function VernierCaliper(props: VernierCaliperProps) {
  const [userAnswer, setUserAnswer] = useState(0)
  const [isSelected, setIsSelected] = useState(false)

  const mouseTempLeftMove = useRef(0)
  const mouseLeftMove = useRef(0)

  const viceCaliperRef = useRef<HTMLDivElement | null>(null)

  const getX = (e: MouseEvent | TouchEvent) => {
    if (e && 'touches' in e) {
      return e.touches[0].screenX
    }
    if (e && 'screenX' in e) {
      return e.screenX
    }
    return 0
  }

  const onMouseUp = useCallback(() => {
    if (mouseTempLeftMove.current === userAnswer) return
    mouseTempLeftMove.current = userAnswer

    setIsSelected(false)
  }, [userAnswer])

  const onMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    mouseLeftMove.current = getX(e)
    setIsSelected(true)
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isSelected) return
      setUserAnswer(mouseTempLeftMove.current + getX(e) - mouseLeftMove.current)
    },
    [isSelected]
  )

  useEffect(() => {
    const viceCaliper = viceCaliperRef.current
    if (!viceCaliper) return

    viceCaliper.addEventListener('mouseup', onMouseUp)
    viceCaliper.addEventListener('touchend', onMouseUp, { passive: false })

    viceCaliper.addEventListener('mouseleave', onMouseUp)

    viceCaliper.addEventListener('mousedown', onMouseDown)
    viceCaliper.addEventListener('touchstart', onMouseDown, { passive: false })

    viceCaliper.addEventListener('mousemove', onMouseMove)
    viceCaliper.addEventListener('touchmove', onMouseMove, { passive: false })

    return () => {
      viceCaliper.removeEventListener('mouseup', onMouseUp)
      viceCaliper.removeEventListener('touchend', onMouseUp)
      viceCaliper.removeEventListener('mouseleave', onMouseUp)

      viceCaliper.removeEventListener('mousedown', onMouseDown)
      viceCaliper.removeEventListener('touchstart', onMouseDown)

      viceCaliper.removeEventListener('mousemove', onMouseMove)
      viceCaliper.removeEventListener('touchmove', onMouseMove)
    }
  }, [onMouseDown, onMouseMove, onMouseUp])

  useEffect(() => {
    props.onChange && props.onChange(userAnswer)
  }, [props, userAnswer])

  useEffect(() => {
    setUserAnswer(0)
    mouseTempLeftMove.current = 0
    mouseLeftMove.current = 0
  }, [props.loading])

  return (
    <div className="w-[300px] flex flex-col gap-2">
      <div className="w-full overflow-hidden relative">
        <div className="relative h-10">
          {props.loading && (
            <div className="animate-pulse flex justify-center items-center h-full">
              {props.loadingMainText?.length ? props.loadingMainText : '加载主尺中...'}
            </div>
          )}
          {!props.loading && (
            <img
              draggable={false}
              loading="lazy"
              src={props.mainImageBase64}
              alt="main-caliper-image"
              className="absolute top-0 left-0 h-full w-full"
            />
          )}
        </div>
        <div className="relative h-10" ref={viceCaliperRef}>
          {props.loading && (
            <div className="animate-pulse flex justify-center items-center h-full">
              {props.loadingViceText?.length ? props.loadingViceText : '加载副尺中...'}
            </div>
          )}
          {!props.loading && (
            <img
              className="absolute top-0 left-0 h-full w-full cursor-grab"
              src={props.viceImageBase64}
              alt="vice-caliper-image"
              style={{ left: `${userAnswer}px` }}
            />
          )}
        </div>
        <PressContainer
          interval={100}
          onPress={() => {
            setUserAnswer(prev => prev - 1)
            mouseTempLeftMove.current--
          }}
        >
          <button
            className="absolute left-1 bottom-1 p-1 rounded-md hover:bg-indigo-300 hover:bg-opacity-60 animate-in animate-out delay-150 select-none"
            onClick={() => setUserAnswer(prev => prev - 1)}
          >
            ⬅
          </button>
        </PressContainer>
        <PressContainer
          interval={100}
          onPress={() => {
            setUserAnswer(prev => prev + 1)
            mouseTempLeftMove.current++
          }}
        >
          <button
            className="absolute right-1 bottom-1 p-1 rounded-md hover:bg-indigo-300 hover:bg-opacity-60 animate-in animate-out delay-150 select-none"
            onClick={() => setUserAnswer(prev => prev + 1)}
          >
            ➡
          </button>
        </PressContainer>
      </div>
    </div>
  )
}
