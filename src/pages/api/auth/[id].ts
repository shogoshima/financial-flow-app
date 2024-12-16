import type { NextApiRequest, NextApiResponse } from 'next';
// import { UserService } from '@/services/user.service';
import { AuthService } from '@/services';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const auth = await AuthService.getAuth(id as string);
      if (!auth) {
        res.status(404).json({ error: 'auth not found' });
        return;
      }
      const userId = auth.userId;
      console.log("[auth/[id].ts] userId", userId);
      res.status(200).json({ userId});
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}