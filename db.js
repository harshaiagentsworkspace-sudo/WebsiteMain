/* Ostendic: contact form delivery.
   Each enquiry goes two ways at once:
   1. Web3Forms (https://web3forms.com) emails it to the inbox the access key
      was created for. The key is set at build time (WEB3FORMS_ACCESS_KEY)
      and written into the page as window.OSTENDIC_FORM_KEY; it is a public
      key by design.
   2. /api/enquiry stores it for the admin panel's inbox (when a data store
      is set up; otherwise that endpoint answers 204 and stores nothing).
   site.js calls window.submitLead(payload) and shows success only when this
   resolves: at least one of the two must have accepted the enquiry. If both
   fail, it throws, so the visitor sees an honest error with the email. */
window.submitLead = async function (data) {
  var key = window.OSTENDIC_FORM_KEY;

  var email = !key ? Promise.reject(new Error('Contact form is not configured (no Web3Forms access key).')) :
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: 'New enquiry from ostendic.com: ' + data.name,
        from_name: 'Ostendic website',
        replyto: data.email,
        name: data.name,
        email: data.email,
        business: data.company || '',
        budget: data.budget || '',
        message: data.project_description,
      }),
    }).then(async function (res) {
      var out = null;
      try { out = await res.json(); } catch (e) { /* non-JSON reply */ }
      if (!res.ok || !out || out.success !== true) throw new Error((out && out.message) || ('Web3Forms error ' + res.status));
      return out;
    });

  var inbox = fetch('/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name, email: data.email, phone: data.phone || '', company: data.company || '',
      interest: data.interest || '', budget: data.budget || '', message: data.message || data.project_description,
      page: location.pathname,
    }),
  }).then(function (res) {
    if (res.status !== 202) throw new Error('Inbox not stored (' + res.status + ')');
    return true;
  });

  var results = await Promise.allSettled([email, inbox]);
  if (results.some(function (r) { return r.status === 'fulfilled'; })) return true;
  var err = results[0].reason || results[1].reason;
  console.error('submitLead error:', results.map(function (r) { return r.reason && r.reason.message; }));
  throw err;
};
