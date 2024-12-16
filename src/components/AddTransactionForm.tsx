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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto border rounded-lg p-4 shadow-md bg-gray-700">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-300">Type:</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category:</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Transaction
      </button>
    </form>
  );
}