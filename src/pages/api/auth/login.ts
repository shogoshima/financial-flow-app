import type { NextApiRequest, NextApiResponse } from 'next';
import { login } from '@/actions/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const formData = new FormData();
    formData.append('email', req.body.email);
    formData.append('password', req.body.password);

    const token = await login(formData);
    if (token) {
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}