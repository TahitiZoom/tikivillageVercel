import type { PayloadRequest } from 'payload'

type AdminRequest = {
  req: PayloadRequest
}

export const isAdmin = ({ req }: AdminRequest): boolean => {
  const user = req.user as (PayloadRequest['user'] & { role?: string }) | null | undefined

  return user?.collection === 'users' && user.role === 'admin'
}
