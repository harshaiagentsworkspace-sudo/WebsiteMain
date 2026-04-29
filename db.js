const SUPABASE_URL = 'https://jyikbiiyqixesapwkkfm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5aWtiaWl5cWl4ZXNhcHdra2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Nzg3MDUsImV4cCI6MjA5MzA1NDcwNX0.vLs0AA2_v9oKC-emk2-qH3OKuaM_Fkqz8Sjb8mn6634';

const _db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.submitLead = async function (data) {
  const { error } = await _db.from('leads').insert([data]);
  if (error) { console.error('submitLead error:', error); throw error; }
};

window.submitDownload = async function (data) {
  const { error } = await _db.from('downloads').insert([data]);
  if (error) { console.error('submitDownload error:', error); throw error; }
};
