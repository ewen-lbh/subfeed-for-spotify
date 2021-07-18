export function intersection<T>(array1: T[], array2: T[]): T[] {
	return array1.filter(el1 => array2.includes(el1))
}
