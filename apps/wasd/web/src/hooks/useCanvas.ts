import { useRef, useEffect } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@wasd/shared'

export const useCanvas = (draw: (ctx: CanvasRenderingContext2D) => void) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    ctxRef.current = canvas.getContext('2d')

    let animationId: number

    const render = () => {
      if (ctxRef.current) drawRef.current(ctxRef.current)
      animationId = requestAnimationFrame(render)
    }
    animationId = requestAnimationFrame(render)

    return () => cancelAnimationFrame(animationId)
  }, [])

  return canvasRef
}
