import { DramaDetailView } from "@/components/theater/drama-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DramaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dramaId = parseInt(id, 10);

  if (isNaN(dramaId)) {
    return (
      <div className="container py-8">
        <p className="text-red-500">Invalid drama ID</p>
      </div>
    );
  }

  return <DramaDetailView dramaId={dramaId} />;
}