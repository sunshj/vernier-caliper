'use client'
import { PressContainer, VC } from 'vernier-caliper'
import { createVernierCaliper, verifyAnswer } from 'vernier-caliper/actions'
import { useEffect, useState } from 'react'
import { useAsyncData, useThrottle } from '@/hooks'

export default function Home() {
  const { data, error, pending, refresh } = useAsyncData(createVernierCaliper)
  if (error) throw error

  const [userAnswer, setUserAnswer] = useState(0)
  const [correct, setCorrect] = useState(false)

  const handleVerify = useThrottle(async () => {
    setCorrect(await verifyAnswer(userAnswer, data?.answers ?? []))
  }, 500)

  useEffect(() => {
    handleVerify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswer])

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <h1 className="h-full font-bold">Move to: {data?.question}</h1>
      <div className="m-auto border">
        <VC value={userAnswer} loading={pending} onChange={setUserAnswer}>
          <VC.MainCaliper caliperImage={data?.mainCaliperImage} />
          <VC.ViceCaliper caliperImage={data?.viceCaliperImage}>
            <PressContainer interval={100} onPress={() => setUserAnswer(v => v - 1)}>
              <button
                className="absolute h-full left-0 bottom-0 p-1 bg-red-500 opacity-40 text-white z-10 rounded-sm"
                onClick={() => setUserAnswer(v => v - 1)}
              >
                decr
              </button>
            </PressContainer>
            <PressContainer interval={100} onPress={() => setUserAnswer(v => v + 1)}>
              <button
                className="absolute h-full right-0 bottom-0 p-1 bg-red-500 opacity-40 text-white z-10 rounded-sm"
                onClick={() => setUserAnswer(v => v + 1)}
              >
                incr
              </button>
            </PressContainer>
          </VC.ViceCaliper>
        </VC>
      </div>
      <h2 className={`text-xl font-bold ${correct ? 'text-green-500' : 'text-red-500'}`}>
        {correct ? 'Correct!' : 'Wrong!'}
      </h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        onClick={refresh}
      >
        reset
      </button>
    </div>
  )
}
