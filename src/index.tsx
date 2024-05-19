'use client'
import { type MouseEvent, type TouchEvent, useEffect, useRef, useState } from 'react'
import PressContainer from './components/PressContainer'
import './global.css'

interface VernierCaliperProps {
  loading?: boolean
  loadingMainText?: string
  loadingViceText?: string
  mainCaliperImage?: string
  viceCaliperImage?: string
  onChange?: (answer: number) => void
}

export default function VernierCaliper(props: VernierCaliperProps) {
  const [userAnswer, setUserAnswer] = useState(0)
  const [isSelected, setIsSelected] = useState(false)

  const mouseTempLeftMove = useRef(0)
  const mouseLeftMove = useRef(0)

  const getScreenX = (e: MouseEvent | TouchEvent) => {
    if (e && 'touches' in e) return e.touches[0].screenX
    if (e && 'screenX' in e) return e.screenX
    return 0
  }

  const onMouseUp = () => {
    if (mouseTempLeftMove.current === userAnswer) return
    mouseTempLeftMove.current = userAnswer
    setIsSelected(false)
  }

  const onMouseDown = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    mouseLeftMove.current = getScreenX(e)
    setIsSelected(true)
  }

  const onMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isSelected) return
    setUserAnswer(mouseTempLeftMove.current + getScreenX(e) - mouseLeftMove.current)
  }

  useEffect(() => {
    props.onChange?.(userAnswer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswer])

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
              src={props.mainCaliperImage}
              alt="main-caliper-image"
              className="absolute top-0 left-0 h-full w-full"
            />
          )}
        </div>
        <div
          className="relative h-10"
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseUp}
          onTouchEnd={onMouseUp}
          onTouchStart={onMouseDown}
          onTouchMove={onMouseMove}
        >
          {props.loading && (
            <div className="animate-pulse flex justify-center items-center h-full">
              {props.loadingViceText?.length ? props.loadingViceText : '加载副尺中...'}
            </div>
          )}
          {!props.loading && (
            <img
              className="absolute top-0 left-0 h-full w-full cursor-grab"
              src={props.viceCaliperImage}
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
