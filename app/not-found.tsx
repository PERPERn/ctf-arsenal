import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-32 text-center">
      <div className="mono text-6xl font-bold accent-text">404</div>
      <p className="mt-4 mono text-muted">// tool not found on the grid</p>
      <Link href="/" className="mono inline-block mt-6 px-5 py-2.5 rounded-md bg-brand text-black font-semibold">cd ~/</Link>
    </div>
  );
}
