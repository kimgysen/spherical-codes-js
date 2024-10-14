
export default interface DeltaXY {
	dx: number,
	dy: number,
	int?: { dx: number, dy: number },
	ext?: { dx: number, dy: number },
	isInt?: boolean,
	isExt?: boolean
}