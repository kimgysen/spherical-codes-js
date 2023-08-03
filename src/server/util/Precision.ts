
export function trimToDecimals(numberToTrim, nrDecimals) {
	var s = numberToTrim.toString();
	var d = s.split(".");
	d[1] = d[1].substring(0, nrDecimals);

	return parseFloat(d.join("."));
}
