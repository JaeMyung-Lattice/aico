import type { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env['SUPABASE_URL'] ?? ''
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface AuthRequest extends Request {
  userId?: string
  supabaseId?: string
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing authorization token' })
      return
    }

    const token = authHeader.slice(7)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({ error: 'Invalid token' })
      return
    }

    req.supabaseId = user.id
    next()
  } catch {
    res.status(401).json({ error: 'Authentication failed' })
  }
}
