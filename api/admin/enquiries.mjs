/* Enquiry inbox.
   GET    /api/admin/enquiries                         -> { items, store }
   PATCH  /api/admin/enquiries { id, status?, notes?, read? }
   DELETE /api/admin/enquiries { id } */
import { send, readBody, guard } from './_lib.mjs';
import { listEnquiries, updateEnquiry, deleteEnquiry, storeKind, logActivity, STATUSES } from './_store.mjs';

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  if (storeKind() === 'none') return send(res, 200, { items: [], store: 'none', statuses: STATUSES });
  try {
    if (req.method === 'GET') return send(res, 200, { items: await listEnquiries(), store: storeKind(), statuses: STATUSES });
    const body = await readBody(req).catch(() => null);
    if (!body || typeof body.id !== 'string') return send(res, 400, { error: 'Bad request' });
    if (req.method === 'PATCH') {
      const item = await updateEnquiry(body.id, body);
      if (!item) return send(res, 404, { error: 'That enquiry no longer exists.' });
      if (body.status) await logActivity('enquiry-status', `${item.name}: ${body.status}`);
      return send(res, 200, { item });
    }
    if (req.method === 'DELETE') {
      await deleteEnquiry(body.id);
      await logActivity('enquiry-delete', body.id);
      return send(res, 200, { ok: true });
    }
    return send(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    return send(res, e.status || 502, { error: e.message });
  }
}
