import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-100 p-4 flex gap-4">
      <Link href="/" className="font-bold">Dashboard</Link>
      <Link href="/oauth">OAuth</Link>
      <Link href="/ai-post">AI Пост</Link>
      <Link href="/linkedin-post">LinkedIn Пост</Link>
      <Link href="/facebook-post">Facebook Пост</Link>
    </nav>
  );
}
