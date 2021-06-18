export function intersection(array1, array2) {
	return array1.filter((el1) => array2.includes(el1))
}
