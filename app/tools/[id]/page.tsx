import { notFound } from "next/navigation";
import { tools } from "@/lib/tools";
import { ToolDetail } from "@/components/ToolDetail";

export function generateStaticParams() {
  return tools.map((t) => ({ id: t.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const tool = tools.find((t) => t.id === params.id);
  if (!tool) return { title: "Not found" };
  return { title: `${tool.name} — CTF Arsenal`, description: tool.tagline.en };
}

export default function ToolPage({ params }: { params: { id: string } }) {
  const tool = tools.find((t) => t.id === params.id);
  if (!tool) notFound();
  const related = tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 3);
  return <ToolDetail tool={tool} related={related} />;
}
