// src/app/admin/projects/edit/[id]/page.tsx

import EditProjectForm from '@/components/EditProjectForm';

interface Params {
  params: {
    id: string;
  };
}

// Jangan pakai `async` kalau tidak fetch data server-side
export default function EditProjectPage({ params }: Params) {
  const { id } = params;

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
