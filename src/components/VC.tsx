'use client'
import {
  type MouseEvent,
  type PropsWithChildren,
  type TouchEvent,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

interface VernierCaliperProps extends PropsWithChildren {
  loading?: boolean
  value: number
  onChange?: (answer: number) => void
}

interface CaliperProps extends PropsWithChildren {
  loadingText?: string
  caliperImage?: string
}

const context = createContext<VernierCaliperProps>({
  loading: false,
  value: 0,
  onChange: () => null
})

function VC({ children, ...props }: VernierCaliperProps) {
  return (
    <context.Provider value={props}>
      <div className="w-[300px] flex flex-col gap-2">
        <div className="w-full overflow-hidden relative">{children}</div>
      </div>
    </context.Provider>
  )
}

function MainCaliper(props: CaliperProps) {
  const { loading } = useContext(context)
  return (
    <div className="relative h-10">
      <div className="h-full">
        {loading && (
          <div className="animate-pulse flex justify-center items-center h-full">
            {props.loadingText?.length ? props.loadingText : '加载主尺中...'}
          </div>
        )}
        {!loading && (
          <img
            draggable={false}
            loading="lazy"
            src={props.caliperImage}
            alt="main-caliper-image"
            className="absolute top-0 left-0 h-full w-full"
          />
        )}
      </div>
      {props.children}
    </div>
  )
}

function ViceCaliper(props: CaliperProps) {
  const { loading, value, onChange } = useContext(context)

  const [isSelected, setIsSelected] = useState(false)

  const mouseTempLeftMove = useRef(0)
  const mouseLeftMove = useRef(0)

  const getScreenX = (e: MouseEvent | TouchEvent) => {
    if (e && 'touches' in e) return e.touches[0].screenX
    if (e && 'screenX' in e) return e.screenX
    return 0
  }

  const onMouseUp = () => {
    if (mouseTempLeftMove.current === value) return
    mouseTempLeftMove.current = value
    setIsSelected(false)
  }

  useEffect(() => {
    if (isSelected) return
    mouseTempLeftMove.current = value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const onMouseDown = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    mouseLeftMove.current = getScreenX(e)
    setIsSelected(true)
  }

  const onMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isSelected) return
    onChange?.(mouseTempLeftMove.current + getScreenX(e) - mouseLeftMove.current)
  }

  useEffect(() => {
    onChange?.(0)
    mouseTempLeftMove.current = 0
    mouseLeftMove.current = 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])
  return (
    <div className="relative h-10">
      <div
        className="h-full"
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onTouchEnd={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseMove}
      >
        {loading && (
          <div className="animate-pulse flex justify-center items-center h-full">
            {props.loadingText?.length ? props.loadingText : '加载副尺中...'}
          </div>
        )}
        {!loading && (
          <img
            className="absolute top-0 left-0 h-full w-full cursor-grab"
            src={props.caliperImage}
            alt="vice-caliper-image"
            style={{ left: `${value}px` }}
          />
        )}
      </div>
      {props.children}
    </div>
  )
}

const VernierCaliper = Object.assign(VC, { MainCaliper, ViceCaliper })

export default VernierCaliper
