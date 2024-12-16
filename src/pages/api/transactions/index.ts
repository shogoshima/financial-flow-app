import type { NextApiRequest, NextApiResponse } from 'next';
import { addTransaction, getTransactions } from '@/actions/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    
    try {
      const { type, amount, date, description, category, token } = req.query;
      // console.log("[transaction/index.ts] received post request with ", req.body);

      // console.log("[transaction/index.ts] fields", req.body["amount"]);
      // const formData = new FormData();
      // formData.append('type', req.body.type);
      // formData.append('amount', req.body.amount);
      // formData.append('date', req.body.date);
      // formData.append('description', req.body.description);
      // formData.append('category', req.body.category);

      const formData = new FormData();
      formData.append('type', type as string);
      formData.append('amount', amount as string);
      formData.append('date', date as string);
      formData.append('description', description as string);
      formData.append('category', category as string);
      formData.append('token', token as string);

      console.log("[transaction/index.ts] aaaaaaadding transaction", formData);

      await addTransaction(formData);
      res.status(200).json({ message: 'Transaction added successfully' });
    } catch (error) {
      console.error('Error adding transaction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      console.log("[transaction/index.ts] fetching transactions");
      const {token } = req.query;
      console.log("[transaction/index.ts] token", token);
      const transactions = await getTransactions(token as string);
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  } 
}