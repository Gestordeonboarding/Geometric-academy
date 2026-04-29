'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function getYoutubeId(url: string) {
  const m = url.match(/(?:youtube.com/watch?v=|youtu.be/)([w-]+)/);
  return m ? m[1] : null;
}

export default function LessonPage({ params }: { params: { slug: string; lessonId: string } }) {
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: ld } = await supabase.from('lessons').select('*, modules(title)').eq('id', params.lessonId).single();
      setLesson(ld);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className='min-h-screen bg-gray-950 flex items-center justify-center text-white'>Carregando...</div>;

  const ytId = lesson?.video_url ? getYoutubeId(lesson.video_url) : null;

  return (
    <div className='min-h-screen bg-gray-950 text-white'>
      <header className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4'>
        <Link href={`/${params.slug}/dashboard`} className='text-gray-400 hover:text-white'>← Dashboard</Link>
        <span className='text-gray-600'>|</span>
        <span className='text-gray-300 text-sm'>{lesson?.modules?.title}</span>
      </header>
      <div className='max-w-5xl mx-auto px-6 py-8'>
        <h1 className='text-2xl font-bold mb-6'>{lesson?.title}</h1>
        {ytId ? (
          <div className='relative w-full rounded-xl overflow-hidden mb-8' style={{paddingBottom:'56.25%'}}>
            <iframe src={`https://www.youtube.com/embed/${ytId}`}
              title={lesson?.title}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} />
          </div>
        ) : lesson?.video_url ? (
          <div className='relative w-full rounded-xl overflow-hidden mb-8' style={{paddingBottom:'56.25%'}}>
            <iframe src={lesson.video_url} title={lesson?.title} allowFullScreen
              style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} />
          </div>
        ) : (
          <div className='bg-gray-900 border border-gray-800 rounded-xl p-12 text-center mb-8'>
            <p className='text-gray-500 text-lg'>Vídeo não disponível</p>
          </div>
        )}
        {lesson?.description && (
          <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
            <h2 className='font-semibold text-lg mb-3'>Descrição</h2>
            <p className='text-gray-300 leading-relaxed'>{lesson.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}