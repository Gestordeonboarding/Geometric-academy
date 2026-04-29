import { createClient } from '@supabase/supabase-js'

export default async function ClubPage({ params }: { params: { slug: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Busca o clube e os cursos no banco de dados automaticamente
  const { data: club } = await supabase.from('clubs').select('*').eq('slug', params.slug).single()
  const { data: courses } = await supabase.from('courses').select('*').eq('club_id', club?.id)

  if (!club) return <div className="p-10 text-white">Clube não encontrado.</div>

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xl">
          {club.name[0]}
        </div>
        <h1 className="text-3xl font-bold" style={{ color: club.primary_color }}>{club.name}</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses?.map(course => (
          <div key={course.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all cursor-pointer">
            <div className="aspect-video bg-zinc-800">
                {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl">{course.title}</h3>
              <p className="text-zinc-500 text-sm mt-2">{course.description}</p>
              <button className="mt-6 w-full py-3 rounded-lg font-bold bg-white text-black hover:bg-zinc-200 transition-colors">
                Acessar Curso
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
