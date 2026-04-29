'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${params.slug}/login`);
        return;
      }

      const { data: clubData } = await supabase
        .from('clubs')
        .select('*')
        .eq('slug', params.slug)
        .single();
      setClub(clubData);

      if (clubData) {
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .eq('club_id', clubData.id);
        setCourses(coursesData || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSignOut() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push(`/${params.slug}/login`);
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p>Carregando...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold" style={{ color: club?.primary_color || '#6366f1' }}>
          {club?.name || 'Área de Membros'}
        </h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Sair
        </button>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Meus Cursos</h2>
        {courses.length === 0 ? (
          <p className="text-gray-500">Nenhum curso disponível.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer overflow-hidden"
                onClick={() => router.push(`/${params.slug}/curso/${course.id}`)}
              >
                {course.thumbnail_url && (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{course.title}</h3>
                  {course.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
