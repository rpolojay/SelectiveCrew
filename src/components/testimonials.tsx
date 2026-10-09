export function Testimonials() {
  return (
    <section className="bg-green-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Real people. Real results.</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Join 2,000+ candidates already working at sea.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: 'Ruben De Jesus Hernandez', role: 'Sales Associate', company: 'Starboard Cruise Services', country: 'Colombia 🇨🇴', quote: 'The agency is very professional and the staff is very friendly. Placed within 3 weeks.' },
            { name: 'Shalom Coba', role: 'Sales Associate', company: 'Harding Retail', country: 'Colombia 🇨🇴', quote: 'Selective Crew helped me get a job on a cruise ship and now I am traveling the world. Placed within a month.' },
            { name: 'Evelin Hidalgo', role: 'Retail Supervisor', company: 'Starboard Cruise Services', country: 'Colombia 🇨🇴', quote: 'Went from applicant to Retail Supervisor within her first year.' },
          ].map((t) => (
            <div key={t.name} className="bg-white rounded-xl p-5 shadow-sm border border-green-100">
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
              </div>
              <p className="text-gray-700 text-sm italic mb-4">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role} · {t.company}</p>
                <p className="text-xs text-gray-400">{t.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}