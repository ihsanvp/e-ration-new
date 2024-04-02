import type { RequestEvent } from '@sveltejs/kit';

export function isProtectedRoute(event: RequestEvent, excludedRoutes: string[]) {
	return !excludedRoutes.includes(event.url.pathname);
}

export function isApiRequest(event: RequestEvent) {
	return event.url.pathname.includes('/api');
}
