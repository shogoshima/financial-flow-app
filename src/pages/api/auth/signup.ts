import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '@/services/auth.service';
import { prisma } from '@/lib/prisma';
import { HistoryService } from '@/services/history.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, name , cpf} = req.body;

    // Create a new user
    const user = await prisma.user.create({
      data: {
        // email,
        name,
        cpf
        
      },
    });


    // Create credentials for the new user
    const auth = await AuthService.createCredentials(user.id, email, password);
    if (!auth) {
      res.status(400).json({ error: 'Failed to create user credentials' });
      return;
    }

    const history = HistoryService.createHistory(user.id);
    console.log("[signup.ts] created history", history);

    const token = AuthService.createJwtToken(auth.id);
    res.status(201).json({ token });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}