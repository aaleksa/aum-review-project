import React from 'react';

export default function FacebookPostPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Публікація на Facebook</h1>
      <p>Постинг на сторінку або профіль, аналогічно LinkedIn.</p>
      <form className="mt-6 flex flex-col gap-4">
        <textarea className="border p-2 rounded" placeholder="Текст посту для Facebook" />
        <button className="bg-blue-800 text-white px-4 py-2 rounded">Опублікувати</button>
      </form>
    </div>
  );
}
