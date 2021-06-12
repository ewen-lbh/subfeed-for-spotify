import type { AxiosInstance } from "axios"
import type { Paginated } from "./types"

export async function unwrap<T>(paginated: Paginated<T>, client: AxiosInstance): Promise<T[]> {
	let result: T[] = paginated.items
	while (paginated.next !== null) {
		paginated = (await client.get(paginated.href)).data
	}
	return result
}
