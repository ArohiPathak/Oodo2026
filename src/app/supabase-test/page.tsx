import { createClient } from '@/lib/supabase/server';

export default async function SupabaseTestPage() {
  let success = false;
  let profiles: any[] = [];
  let errorMsg = '';

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, employee_id, full_name, email, role');

    if (error) {
      errorMsg = error.message;
    } else {
      success = true;
      profiles = data || [];
    }
  } catch (err: any) {
    errorMsg = err.message || String(err);
  }

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 shadow-soft-lg space-y-4 my-8">
      <h1 className="text-xl font-bold tracking-tight text-gray-900">Supabase Connection Test</h1>
      
      <div>
        <strong>Connection:</strong>{' '}
        {success ? (
          <span className="text-emerald-600 font-bold">SUCCESS</span>
        ) : (
          <span className="text-red-600 font-bold">ERROR</span>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs font-mono break-words border border-red-100">
          <strong>Error Details:</strong> {errorMsg}
        </div>
      )}

      <div className="pt-2">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Profiles ({profiles.length})</h2>
        {profiles.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {profiles.map((profile) => (
              <li key={profile.id} className="py-2.5 first:pt-0 last:pb-0">
                <div className="font-semibold text-gray-900 text-sm">{profile.full_name || '(No Name set)'}</div>
                <div className="text-xs text-gray-500">
                  {profile.email} &mdash; <span className="font-semibold text-primary">{profile.role}</span>
                </div>
                <div className="text-[10px] font-mono text-gray-400 mt-0.5">Emp ID: {profile.employee_id || 'N/A'}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-xs italic">No profiles returned.</p>
        )}
      </div>
    </div>
  );
}
