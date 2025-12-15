/**
 * Converts a GlideDateTime string to a JavaScript Date object.
 * @param gdt - The GlideDateTime string.
 * @returns A JavaScript Date object.
 */
export function glideDateTime2Date(gdt: string): Date {
	return new Date(gdt);
}

/**
 * Converts a GlideDate string to a JavaScript Date object.
 * @param gd - The GlideDate string.
 * @returns A JavaScript Date object.
 */
export function glideDate2Date(gd: string): Date {
	return new Date(gd);
}

/**
 * Converts a JavaScript Date object to a GlideDate string.
 * @param d - The JavaScript Date object.
 * @returns A GlideDate string.
 */
export function date2GlideDate(d: Date): string {
	const dateString = d.toLocaleDateString().split('/');
	return `${dateString[2]}-${dateString[1]}-${dateString[0]}`;
}

/**
 * Converts a JavaScript Date object to a GlideDateTime string.
 * @param d - The JavaScript Date object.
 * @returns A GlideDateTime String.
 */
export function date2GlideDateTime(d: Date): string {
	const dateString = date2GlideDate(d);
	return `${dateString} ${d.toLocaleTimeString()}`;
}
