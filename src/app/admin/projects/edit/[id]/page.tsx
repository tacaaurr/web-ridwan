// src/app/admin/projects/edit/[id]/page.tsx
// Ini adalah Server Component. Tidak ada 'use client'!
import EditProjectForm from '@/components/EditProjectForm'; // Impor komponen baru

// Next.js secara otomatis memberikan `params` ke fungsi `generateMetadata`
// dan ke fungsi komponen `page` itu sendiri.
// Di Server Component, `params` adalah objek biasa yang dapat diakses langsung.
export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    // Tangani kasus jika ID tidak ditemukan (misal: redirect ke halaman error atau daftar proyek)
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-red-500">Error: Project ID Missing</h1>
        <p className="text-lg text-gray-700 mt-4">Please go back to the projects list.</p>
        <a href="/admin/projects" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
          Back to Projects
        </a>
      </div>
    );
  }

  // Render Client Component dan passing ID sebagai prop
  return <EditProjectForm projectId={id} />;
}