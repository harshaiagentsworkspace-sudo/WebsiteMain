/* Ostendic: contact form delivery.
   Sends the enquiry to Web3Forms (https://web3forms.com), which emails it to
   the inbox the access key was created for. The key is set at build time
   (site.formKey / WEB3FORMS_ACCESS_KEY) and written into the page as
   window.OSTENDIC_FORM_KEY; it is a public key by design.
   site.js calls window.submitLead(payload) and shows success only when this
   resolves; any failure (no key, network, rejected by Web3Forms) throws, so
   the visitor sees an honest error with the email address. */
window.submitLead = async function (data) {
  var key = window.OSTENDIC_FORM_KEY;
  if (!key) throw new Error('Contact form is not configured (no Web3Forms access key).');
  var res = await fetch('https://api.web3forms.com/submit', {
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
  });
  var out = null;
  try { out = await res.json(); } catch (e) { /* non-JSON reply */ }
  if (!res.ok || !out || out.success !== true) {
    var err = new Error((out && out.message) || ('Web3Forms error ' + res.status));
    console.error('submitLead error:', err);
    throw err;
  }
  return out;
};
