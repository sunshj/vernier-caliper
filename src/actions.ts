'use server'
import { createCanvas } from 'canvas'
import {
  BG_COLOR,
  FONT_COLOR,
  FONT_INFO,
  FONT_SIZE,
  IMG_HEIGHT,
  IMG_WIDTH,
  PADDING_LEFT,
  UNIT,
  compareAsync,
  getQuestion,
  hashAsync
} from './utils'

export async function createVernierCaliper() {
  const minNum = Math.round(Math.random() * 50)
  const maxNum = minNum + Math.round(Math.random() * 5 + 30)

  const viceMinNum = -1 * Math.round(Math.random() * 9)
  const viceMaxNum = Math.round(Math.random() * 8 + 10)

  const numCount = maxNum - minNum

  const height = IMG_HEIGHT
  const width = IMG_WIDTH - 10

  const unitWidth = width / (numCount + 3)

  const viceWidth = unitWidth * 9 + 20
  const viceUnitWidth = (unitWidth * 9) / 10
  const vicePaddingLeft = Math.round(Math.random() * (IMG_WIDTH - viceWidth))

  const canvas = createCanvas(IMG_WIDTH, IMG_HEIGHT)
  const viceCanvas = createCanvas(IMG_WIDTH, IMG_HEIGHT)

  const ctx = canvas.getContext('2d')
  const viceCtx = viceCanvas.getContext('2d')

  ctx.fillStyle = BG_COLOR
  viceCtx.fillStyle = BG_COLOR

  ctx.fillRect(0, 0, IMG_WIDTH, IMG_HEIGHT)
  ctx.translate(PADDING_LEFT, 0)

  let showUnit = false

  for (let i = 0; i <= numCount; i++) {
    const x = i * unitWidth
    let lineHeight = 8
    const num = i + minNum

    let numberStr = ''
    if (num % 5 === 0) {
      lineHeight = 11
      if (num % 10 === 0) {
        lineHeight = 14
        numberStr = num.toString()
        if (!showUnit) {
          showUnit = true
          numberStr += UNIT
        }
      }
    }
    ctx.fillStyle = FONT_COLOR
    ctx.beginPath()
    ctx.moveTo(x, height)
    ctx.lineTo(x, height - lineHeight)
    if (numberStr) {
      ctx.font = FONT_INFO
      ctx.fillText(numberStr, x, FONT_SIZE + 10)
    }
    ctx.stroke()
  }

  viceCtx.fillRect(0, 0, IMG_WIDTH, IMG_HEIGHT)

  viceCtx.translate(vicePaddingLeft + PADDING_LEFT, 0)
  for (let i = viceMinNum; i <= viceMaxNum; i++) {
    const x = i * viceUnitWidth
    let lineHeight = 8
    let showNumber = false
    if (i % 5 === 0) {
      lineHeight = 11
      if (i % 10 === 0) {
        lineHeight = 14
        showNumber = true
      }
    }
    viceCtx.beginPath()
    viceCtx.fillStyle = FONT_COLOR
    viceCtx.moveTo(x, 0)
    viceCtx.lineTo(x, lineHeight)
    if (showNumber) {
      viceCtx.font = FONT_INFO
      viceCtx.fillText(i.toString(), x, FONT_SIZE + lineHeight)
    }
    viceCtx.stroke()
  }

  const { question, answer } = getQuestion({
    minNum,
    maxNum,
    unitWidth,
    vicePaddingLeft
  })
  const allowAnswers = [answer - 0.5, answer, answer + 0.5].map(v => Math.round(v).toString(10))
  const hashedAnswers = await Promise.all(allowAnswers.map(ans => hashAsync(ans)))

  return {
    question,
    answers: hashedAnswers,
    mainCaliperImage: canvas.toDataURL(),
    viceCaliperImage: viceCanvas.toDataURL()
  }
}

export async function verifyAnswer(input: number, answers: string[]) {
  const result = await Promise.all(
    answers.map(ans => compareAsync(Math.round(input).toString(10), ans))
  )
  return result.some(Boolean)
}
