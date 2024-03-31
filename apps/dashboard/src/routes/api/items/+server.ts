import { initializeDatabase } from '$lib/utils/db';
import { Item, getItemRepository } from '@e-ration/database';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

function getLimit(params: URLSearchParams): number {
	const limit = params.get('limit') ?? '1';
	return parseInt(limit);
}

/** @type {import("./$types").RequestHandler} */
export async function GET({ url }) {
	const LIMIT = getLimit(url.searchParams);
	const items = await getItemRepository().paginate({
		orderBy: 'created',
		limit: LIMIT,
		cursor: url.searchParams.get('cursor')
	});
	const cursor = items.length == LIMIT ? items[items.length - 1].id : undefined;
	return json({
		cursor: cursor,
		items: items.map((i) => i.toJson())
	});
}

const schema = z.object({
	name: z.string(),
	unit: z.string()
});

/** @type {import("./$types").RequestHandler} */
export async function POST({ request }) {
	const body = await request.json();
	const data = schema.parse(body);

	try {
		initializeDatabase();
		const item = await getItemRepository().createWithData(data);
		return json(item);
	} catch (err) {
		return error(400, String(err));
	}
}
