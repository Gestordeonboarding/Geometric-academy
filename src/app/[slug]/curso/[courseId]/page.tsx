'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CoursePage({ params }: { params: { slug: string; courseId: string } }) {
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/' + params.slug + '/login'); return; }
      const { data: cd } = await supabase.from('courses').select('*').eq('id', params.courseId).single();
      setCourse(cd);
      const { data: md } = await supabase.from('modules').select('*, lessons(*)').eq('course_id', params.courseId);
      setModules(md || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className='min-h-screen bg-gray-950 flex items-center justify-center text-white'>Carregando...</div>;

  return (
    <div className='min-h-screen bg-gray-950 text-white'>
      <header className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4'>
        <Link href={'/' + params.slug + '/dashboard'} className='text-gray-400 hover:text-white'>Voltar</Link>
        <h1 className='text-xl font-bold'>{course?.title}</h1>
      </header>
      <div className='max-w-4xl mx-auto px-6 py-8'>
        <p className='text-gray-400 mb-8'>{course?.description}</p>
        <div className='space-y-4'>
          {modules.map((mod: any) => (
            <div key={mod.id} className='bg-gray-900 border border-gray-800 rounded-xl overflow-hidden'>
              <div className='p-4 bg-gray-800'><h3 className='font-semibold'>{mod.title}</h3></div>
              <div className='divide-y divide-gray-800'>
                {mod.lessons?.map((lesson: any) => (
                  <Link key={lesson.id} href={'/' + params.slug + '/aula/' + lesson.id}
                    className='flex items-center gap-4 p-4 hover:bg-gray-800 transition-colors'>
                    <span>play</span>
                    <span>{lesson.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
