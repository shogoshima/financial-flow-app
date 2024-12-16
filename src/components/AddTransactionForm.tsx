import { getCookie } from '@/bin/cookie';
import { useState } from 'react';

interface AddTransactionFormProps {
  onAddTransaction: () => void;
  token : string
}

export default function AddTransactionForm({ onAddTransaction, token }: AddTransactionFormProps) {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append('type', type);
    // formData.append('amount', amount);
    // formData.append('date', date);
    // formData.append('description', description);
    // formData.append('category', category);

    // get user id from token
    // const token = getCookie('token');
    

    const queryParams = new URLSearchParams({
        type,
        amount,
        date,
        description,
        category,
        token,
    });

    console.log("[AddTransactionForm.tsx] adding transaction", amount, date, description, category);

    const response = await fetch(`/api/transactions?${queryParams.toString()}`, {
      method: 'POST',
    //   body: formData,
    });

    if (response.ok) {
        console.log("[AddTransactionForm.tsx] after POST transaction added successfully");
      onAddTransaction();
      setType('income');
      setAmount('');
      setDate('');
      setDescription('');
      setCategory('');
    } else {
      console.error('Failed to add transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="type">Type:</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Transaction</button>
    </form>
  );
}