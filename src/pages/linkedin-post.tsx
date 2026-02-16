import React from 'react';

export default function LinkedInPostPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Публікація на LinkedIn</h1>
      <p>Постинг тексту від імені користувача, обробка базових помилок.</p>
      <form className="mt-6 flex flex-col gap-4">
        <textarea className="border p-2 rounded" placeholder="Текст посту для LinkedIn" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Опублікувати</button>
      </form>
    </div>
  );
}
