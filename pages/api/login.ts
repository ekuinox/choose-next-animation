import type { NextApiRequest, NextApiResponse } from 'next'
import { buildAuthUrl } from '../../lib/annict';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  res.redirect(buildAuthUrl());
}
