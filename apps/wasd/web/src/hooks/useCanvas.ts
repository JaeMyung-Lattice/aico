import { useRef, useEffect } from 'react'

export const useCanvas = (
  draw: (ctx: CanvasRenderingContext2D) => void,
  width: number,
  height: number,
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = width
    canvas.height = height
    ctxRef.current = canvas.getContext('2d')

    let animationId: number

    const render = () => {
      if (ctxRef.current) drawRef.current(ctxRef.current)
      animationId = requestAnimationFrame(render)
    }
    animationId = requestAnimationFrame(render)

    return () => cancelAnimationFrame(animationId)
  }, [width, height])

  return canvasRef
}
