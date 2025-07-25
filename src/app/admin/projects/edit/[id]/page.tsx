// src/app/admin/projects/edit/[id]/page.tsx
// PENTING: TIDAK ADA 'use client' DI SINI. Ini adalah Server Component.

import EditProjectForm from '@/components/EditProjectForm'; // Impor Client Component yang baru dibuat

// Definisi interface untuk params. Ini setara dengan PageProps['params']
interface EditPageProps {
  params: {
    id: string;
  };
  // searchParams?: { [key: string]: string | string[] | undefined }; // Opsional: Jika perlu search params
}

// Ini adalah Server Component. Next.js mengharapkan fungsi `page` menjadi async
// jika menerima `params` atau melakukan data fetching di server.
export default async function EditProjectPage({ params }: EditPageProps) {
  const { id } = params;

  // Next.js akan memvalidasi tipe `params` ini di server.
  // Jika `id` tidak ada (misalnya, URL diakses tanpa ID), tampilkan pesan error
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
  // Server Component ini hanya bertugas mendapatkan ID dan meneruskannya ke Client Component
  return <EditProjectForm projectId={id} />;
}