const mapping: Record<string, string> = {
  bookings: 'booking',
  membros: 'membro',
  routes: 'route',
  users: 'user',
  vehicles: 'vehicle',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
