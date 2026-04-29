'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const u = new URL(url);
  if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
  return u.searchParams.get('v');
}

export default function LessonPage({ params }: { params: { slug: string; lessonId: string } }) {
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/' + params.slug + '/login'); return; }
      const { data: ld } = await supabase.from('lessons').select('*, modules(title)').eq('id', params.lessonId).single();
      setLesson(ld);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className='min-h-screen bg-gray-950 flex items-center justify-center text-white'>Carregando...</div>;

  let ytId: string | null = null;
  try { if (lesson?.video_url) ytId = getYoutubeId(lesson.video_url); } catch(e) {}

  return (
    <div className='min-h-screen bg-gray-950 text-white'>
      <header className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4'>
        <Link href={'/' + params.slug + '/dashboard'} className='text-gray-400 hover:text-white'>Dashboard</Link>
      </header>
      <div className='max-w-5xl mx-auto px-6 py-8'>
        <h1 className='text-2xl font-bold mb-6'>{lesson?.title}</h1>
        {ytId ? (
          <div className='relative w-full mb-8' style={{paddingBottom: '56.25%'}}>
            <iframe src={'https://www.youtube.com/embed/' + ytId}
              className='absolute inset-0 w-full h-full rounded-xl'
              allowFullScreen />
          </div>
        ) : (
          <div className='bg-gray-900 border border-gray-800 rounded-xl p-12 text-center mb-8'>
            <p className='text-gray-500'>Video nao disponivel</p>
          </div>
        )}
        {lesson?.description && (
          <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
            <h2 className='font-semibold mb-3'>Descricao</h2>
            <p className='text-gray-300'>{lesson.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
