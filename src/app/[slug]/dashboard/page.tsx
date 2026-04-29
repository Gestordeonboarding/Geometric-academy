'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage({ params }: { params: { slug: string } }) {
  const [club, setClub] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const { data: clubData } = await supabase.from('clubs').select('*').eq('slug', params.slug).single();
      setClub(clubData);
      if (clubData) {
        const { data: coursesData } = await supabase.from('courses').select('*').eq('club_id', clubData.id);
        setCourses(coursesData || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className='min-h-screen bg-gray-950 flex items-center justify-center text-white'>Carregando...</div>;

  return (
    <div className='min-h-screen bg-gray-950 text-white flex'>
      <aside className='w-64 bg-gray-900 border-r border-gray-800 flex flex-col'>
        <div className='p-5 border-b border-gray-800'>
          <h2 className='text-lg font-bold text-blue-400'>{club?.name || 'Plataforma'}</h2>
        </div>
        <nav className='p-4 flex-1'>
          <ul className='space-y-1'>
            <li><Link href={`/${params.slug}/dashboard`} className='flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 font-medium'>📚 Meus Cursos</Link></li>
            <li><Link href={`/${params.slug}/perfil`} className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300'>👤 Meu Perfil</Link></li>
          </ul>
        </nav>
        <div className='p-4 border-t border-gray-800'>
          <button onClick={async()=>{await supabase.auth.signOut();router.push(`/${params.slug}/login`);}}
            className='w-full text-left text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm'>
            🚪 Sair
          </button>
        </div>
      </aside>
      <main className='flex-1 p-8'>
        <div className='mb-8'>
          <p className='text-gray-400 mt-1'>Continue de onde parou.</p>
        </div>
        {courses.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {courses.map((course)=>(
              <Link key={course.id} href={`/${params.slug}/curso/${course.id}`}
                className='bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-600 transition-colors group block'>
                <h3 className='font-semibold text-lg group-hover:text-blue-400 transition-colors'>{course.title}</h3>
                <p className='text-gray-400 text-sm mt-2'>{course.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center py-20 text-gray-500'>
            <p className='text-5xl mb-4'>📚</p>
            <p className='text-xl'>Nenhum curso disponível.</p>
          </div>
        )}
      </main>
    </div>
  );
}