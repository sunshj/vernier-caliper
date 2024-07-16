'use client'
import VernierCaliper from 'vernier-caliper'
import { createVernierCaliper, verifyAnswer } from 'vernier-caliper/actions'
import { useState } from 'react'
import { useDebounceFn, useRequest } from 'ahooks'

export default function Home() {
  const { data, error, loading, refresh } = useRequest(createVernierCaliper)
  if (error) throw error

  const [correct, setCorrect] = useState(false)

  const handleVerify = useDebounceFn(
    async (value: number) => {
      setCorrect(await verifyAnswer(value, data?.answers ?? []))
    },
    { wait: 300 }
  )

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <h1 className="h-full font-bold">Move to: {data?.question}</h1>
      <div className="m-auto border">
        <VernierCaliper
          loading={loading}
          loadingMainText="loading main image..."
          loadingViceText="loading vice image..."
          mainCaliperImage={data?.mainCaliperImage}
          viceCaliperImage={data?.viceCaliperImage}
          onChange={handleVerify.run}
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
