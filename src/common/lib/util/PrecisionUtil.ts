
export const trimToDecimals = (numberToTrim, nrDecimals): number => {
	const s = numberToTrim.toString();
	const d = s.split(".");

	if (d[1]) {
		d[1] = d[1].substring(0, nrDecimals);

	}

	return parseFloat(d.join("."));
}
