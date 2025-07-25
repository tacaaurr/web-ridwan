// src/app/admin/projects/edit/[id]/page.tsx

import { getProjectById } from "@/lib/api";
import FormProject from "@/components/EditProjectForm";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EditProjectPage({ params }: PageProps) {
  const project = await getProjectById(params.id);

  if (!project) {
    return notFound();
  }

  return (
    <main className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <FormProject project={project} />
    </main>
  );
}
