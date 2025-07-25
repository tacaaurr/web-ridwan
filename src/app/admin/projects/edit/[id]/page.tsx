// src/app/admin/projects/edit/[id]/page.tsx

import EditProjectForm from '@/components/EditProjectForm';

interface EditPageParams {
  params: {
    id: string;
  };
  // searchParams?: { [key: string]: string | string[] | undefined }; // Opsional: Jika Anda perlu search params
}

// Gunakan `async` di sini. Ini adalah Server Component.
export default async function EditProjectPage({ params }: EditPageParams) {
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

  // Render Client Component dan passing ID sebagai prop
  // Pastikan `src/components/EditProjectForm.tsx` sudah ada dan benar.
  return <EditProjectForm projectId={id} />;
}