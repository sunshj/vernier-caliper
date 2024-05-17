import { createHash } from 'node:crypto'

/**主尺图片高宽 */
export const IMG_HEIGHT = 40
export const IMG_WIDTH = 300
/**文字大小*/
export const FONT_SIZE = 10
/**背景颜色 */
export const BG_COLOR = '#ddd'
/**字体、刻度颜色 */
export const FONT_COLOR = '#000'
export const FONT_INFO = `${FONT_SIZE}px sans,sans-serif`
/**主尺刻度距离左边的距离 */
export const PADDING_LEFT = 5
/**单位：毫米 */
export const UNIT = 'mm'

export function getQuestion(options: {
  maxNum: number
  minNum: number
  unitWidth: number
  vicePaddingLeft: number
}) {
  const { maxNum, minNum, unitWidth, vicePaddingLeft } = options

  const question = Math.random() * (maxNum - 15 - minNum - 4) + minNum + 4
  const answer = Number(((question - minNum) * unitWidth - vicePaddingLeft).toFixed(1))

  if (answer >= -3 && answer <= 3) {
    return getQuestion(options)
  } else {
    return {
      question: question.toFixed(1) + UNIT,
      answer
    }
  }
}

export function hashAsync(str: string) {
  return Promise.resolve(createHash('sha256').update(str).digest('hex'))
}

export async function compareAsync(input: string, hash: string) {
  return (await hashAsync(input)) === hash
}
