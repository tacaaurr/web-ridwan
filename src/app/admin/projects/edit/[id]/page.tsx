// src/app/admin/projects/edit/[id]/page.tsx

import EditProjectForm from '@/components/EditProjectForm';

// Jangan gunakan `PageProps` dari next/router.
// App Router akan langsung menyuplai `params` secara otomatis.

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-red-500">Error: Project ID Missing</h1>
        <p className="text-lg text-gray-700 mt-4">Please go back to the projects list.</p>
        <a
          href="/admin/projects"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        >
          Back to Projects
        </a>
      </div>
    );
  }

  return <EditProjectForm projectId={id} />;
}
