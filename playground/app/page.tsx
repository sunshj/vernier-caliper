'use client'
import VernierCaliper from 'vernier-caliper'
import { createVernierCaliper, verifyAnswer } from 'vernier-caliper/actions'
import { useState } from 'react'
import { useAsyncData, useThrottle } from '../hooks'

export default function Home() {
  const { data, error, pending, refresh } = useAsyncData(createVernierCaliper)
  if (error) throw error

  const [correct, setCorrect] = useState(false)

  const handleChange = useThrottle(async (value: number) => {
    setCorrect(await verifyAnswer(value, data?.answers ?? []))
  }, 500)

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <h1 className="h-full font-bold">Move to: {data?.question}</h1>
      <div className="m-auto border">
        <VernierCaliper
          loading={pending}
          loadingMainText="loading main image..."
          loadingViceText="loading vice image..."
          mainCaliperImage={data?.mainCaliperImage}
          viceCaliperImage={data?.viceCaliperImage}
          onChange={handleChange}
        />
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
