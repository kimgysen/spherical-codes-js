
export const cloneArray = (arr: object[]) => {
	return JSON.parse(JSON.stringify(arr));
}