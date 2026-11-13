export const PAGE_SIZE = 10;

export function paginate(items, requestedPage = 1, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.max(1, Math.min(totalPages, Math.trunc(requestedPage) || 1));
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, totalPages, total: items.length, start: items.length ? start + 1 : 0, end: Math.min(start + pageSize, items.length) };
}
