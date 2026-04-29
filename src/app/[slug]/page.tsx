import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default async function ClubLandingPage({ params }: { params: { slug: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (clubError || !club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Clube não encontrado</h1>
          <p className="text-gray-400">O clube "{params.slug}" não existe.</p>
        </div>
      </div>
    );
  }

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('club_id', club.id);

  const primaryColor = club.primary_color || '#6366f1';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {club.logo_url && (
            <img src={club.logo_url} alt={club.name} className="h-10 w-10 rounded-lg object-cover" />
          )}
          <h1 className="text-xl font-bold" style={{ color: primaryColor }}>
            {club.name}
          </h1>
        </div>
        <Link
          href={`/${params.slug}/login`}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition"
          style={{ backgroundColor: primaryColor }}
        >
          Entrar
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Bem-vindo a {club.name}</h2>
          <p className="text-gray-400 text-lg">Acesse os melhores cursos da plataforma</p>
          <Link
            href={`/${params.slug}/login`}
            className="inline-block mt-8 px-8 py-3 rounded-xl text-lg font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Começar Agora
          </Link>
        </div>

        {courses && courses.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-8 text-center">Nossos Cursos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <div
                  key={course.id}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition"
                >
                  {course.thumbnail_url && (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h4 className="font-bold text-lg mb-2">{course.title}</h4>
                    {course.description && (
                      <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
