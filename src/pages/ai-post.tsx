import React from 'react';

export default function AiPostPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI генерація постів</h1>
      <p>Інтеграція з OpenAI/Claude, prompt з FINRA/SEC правилами.</p>
      <form className="mt-6 flex flex-col gap-4">
        <input className="border p-2 rounded" placeholder="Введіть тему посту" />
        <textarea className="border p-2 rounded" placeholder="Ваш prompt..." />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Згенерувати пост</button>
      </form>
    </div>
  );
}
