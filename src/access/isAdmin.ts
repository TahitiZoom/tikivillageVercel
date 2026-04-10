import type { PayloadRequest } from 'payload'

type AdminRequest = {
  req: PayloadRequest
}

export const isAdmin = ({ req }: AdminRequest): boolean => {
  return req.user?.collection === 'users' && req.user.role === 'admin'
}
