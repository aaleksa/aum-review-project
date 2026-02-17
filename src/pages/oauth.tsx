import React from 'react';

export default function OAuthPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">OAuth авторизація</h1>
      <p>LinkedIn та Facebook: налаштування flow, отримання токенів, зберігання в БД для кожного користувача.</p>
      {/* Тут буде кнопка для авторизації LinkedIn/Facebook */}
      <div className="mt-6 flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => window.location.href = '/ai-post'}
        >Авторизуватись через LinkedIn</button>
        <button
          className="bg-blue-800 text-white px-4 py-2 rounded"
          onClick={() => window.location.href = '/ai-post'}
        >Авторизуватись через Facebook</button>
      </div>
    </div>
  );
}
