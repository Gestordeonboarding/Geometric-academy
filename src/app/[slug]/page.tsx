import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getClub(slug: string) {
  const { data } = await s.from('clubs').select('*').eq('slug', slug).single();
  return data;
}

async function getCourses(clubId: string) {
  const { data } = await s.from('courses').select('*').eq('club_id', clubId);
  return data || [];
}

export default async function ClubPage({ params }: { params: { slug: string } }) {
  const club = await getClub(params.slug);
  const courses = await getCourses(club.id);

  return (
    <div className='min-h-screen bg-gray-950 text-white'>
      <header className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold' style={{color: club.primary_color || '#3b82f6'}}>{club.name}</h1>
        <Link href={'/'+params.slug+'/login'} className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium'>Entrar</Link>
      </header>
      <main className='max-w-6xl mx-auto px-6 py-12'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold mb-4'>Bem-vindo a {club.name}</h2>
          <p className='text-gray-400 text-lg'>Acesse nossos cursos e transforme seu conhecimento</p>
        </div>
        {courses.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {courses.map((course: any) => (
              <div key={course.id} className='bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-600 transition-colors'>
                <h3 className='text-lg font-semibold mb-2'>{course.title}</h3>
                <p className='text-gray-400 text-sm mb-4'>{course.description}</p>
                <Link href={'/'+params.slug+'/login'} className='block text-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium'>Acessar</Link>
              </div>
            ))}
          </div>
        ) : (
        )}
      </main>
    </div>
  );
}