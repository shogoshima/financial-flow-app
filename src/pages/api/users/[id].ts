import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '@/services/user.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  console.log("before try [users/[id].ts] id QUERY", id);

  if (req.method === 'GET') {
    try {
      console.log("[users/[id].ts] id REQUEST", id);
      const user = await UserService.getUserById(id as string);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        console.log("[users/[id].ts] user not found", user);
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}