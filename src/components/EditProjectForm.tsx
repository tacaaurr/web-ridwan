// src/components/EditProjectForm.tsx
'use client'; // PENTING: Ini adalah Client Component, harus ada ini di baris pertama

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';
import Image from 'next/image';

interface EditProjectFormProps {
  projectId: string; // Menerima ID sebagai prop biasa, tipe string
}

// Ini adalah fungsi komponen REACT biasa (TIDAK ASYNC) karena menggunakan hooks
export default function EditProjectForm({ projectId }: EditProjectFormProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [projectLink, setProjectLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // useEffect untuk fetching data project awal
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId) // Gunakan projectId dari props
        .single();

      if (error) {
        setMessage(`Error fetching project: ${error.message}`);
        setLoading(false);
        return;
      }
      setProject(data as Project);
      setTitle(data.title || '');
      setDescription(data.description || '');
      setProjectLink(data.project_link || '');
      setGithubLink(data.github_link || '');
      setLoading(false);
    };

    if (projectId) { // Pastikan projectId ada
      fetchProject();
    }
  }, [projectId]); // projectId sebagai dependency

  // Handler untuk perubahan file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    let image_url = project?.image_url;
    if (imageFile) {
      // Upload gambar ke Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('project_images')
        .upload(`public/${imageFile.name}_${Date.now()}`, imageFile, {
          upsert: true,
        });

      if (uploadError) {
        setMessage(`Error uploading new image: ${uploadError.message}`);
        setLoading(false);
        return;
      }
      image_url = supabase.storage.from('project_images').getPublicUrl(data.path).data.publicUrl;
    }

    // Update data project di Supabase Database
    const { error } = await supabase
      .from('projects')
      .update({
        title,
        description,
        image_url,
        project_link: projectLink,
        github_link: githubLink,
      })
      .eq('id', projectId); // Gunakan projectId dari props

    if (error) {
      setMessage(`Error updating project: ${error.message}`);
    } else {
      setMessage('Project updated successfully!');
      router.push('/admin/projects'); // Redirect setelah berhasil
    }
    setLoading(false);
  };

  // Rendering UI
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-700">Loading project data...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">Project not found or an error occurred.</p>
        <button onClick={() => router.push('/admin/projects')} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Edit Project</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Project Title:
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description:
          </label>
          <textarea
            id="description"
            rows={5}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
            Project Image:
          </label>
          {project.image_url && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Image:</p>
              <Image src={project.image_url} alt="Current Project Image" width={150} height={100} className="rounded-md object-cover" />
            </div>
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleFileChange}
          />
          {imageFile && <p className="text-sm text-gray-500 mt-2">New image selected: {imageFile.name}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="projectLink" className="block text-gray-700 text-sm font-bold mb-2">
            Project Live Link (Optional):
          </label>
          <input
            type="url"
            id="projectLink"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="githubLink" className="block text-gray-700 text-sm font-bold mb-2">
            GitHub Link (Optional):
          </label>
          <input
            type="url"
            id="githubLink"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Project'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
        {message && (
          <p className={`mt-4 text-center ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}