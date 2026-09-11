import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-32 text-center">
      <div className="text-6xl font-black gradient-text">404</div>
      <p className="mt-4 text-muted">This tool wandered off the grid.</p>
      <Link href="/" className="inline-block mt-6 px-5 py-3 rounded-xl bg-brand text-white font-semibold">← Home</Link>
    </div>
  );
}
