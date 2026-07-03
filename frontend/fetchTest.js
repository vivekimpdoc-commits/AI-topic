const supabaseUrl = 'https://sonsgwctqgmqmqwivkxi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvbnNnd2N0cWdtcW1xd2l2a3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4ODY4MjcsImV4cCI6MjA5ODQ2MjgyN30.k_BkM8BEruatoTRHlCUuqBHHMaV4Y0iN0cNJH12hl3k';

async function run() {
  const res = await fetch(`${supabaseUrl}/rest/v1/personnel`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      id: 'p-test-' + Date.now(),
      pno_number: 'PNO-TEST-' + Date.now(),
      name: 'Test Officer',
      rank: 'SI',
      phone_number: '998877' + Math.floor(Math.random()*1000),
      email: 'test' + Date.now() + '@upp.gov.in',
      current_thana_code: 'TH-CIVIL'
    })
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
}
run();
