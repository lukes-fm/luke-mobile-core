import { test, expect } from '@jest/globals';
import { date2GlideDate, date2GlideDateTime, glideDate2Date, glideDateTime2Date } from '../src';

test('Convert a GlideDateTime string into a Date', () => {
	const input = '2025-05-30 16:24:06';
	const converted = glideDateTime2Date(input);

	expect(converted.toISOString()).toBe('2025-05-30T15:24:06.000Z');
	expect(converted.toLocaleString()).toBe('30/05/2025, 16:24:06');
});

test('Convert a GlideDate string into a Date', () => {
	const input = '2025-05-30';
	const converted = glideDate2Date(input);

	expect(converted.toISOString()).toBe('2025-05-30T00:00:00.000Z');
	expect(converted.toLocaleDateString()).toBe('30/05/2025');
});

test('Convert Date to a GlideDateTime string', () => {
	const input = new Date('2025-05-30 16:24:06');
	expect(date2GlideDateTime(input)).toBe('2025-05-30 16:24:06');
});

test('Convert Date to a GlideDate string', () => {
	const input = new Date('2025-05-30');
	expect(date2GlideDate(input)).toBe('2025-05-30');
});
