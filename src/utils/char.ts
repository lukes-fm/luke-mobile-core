import { CharacterSet } from '../constants';

/**
 * Generates a random string of the specified length using the given character set.
 * @param length The length of the string to generate.
 * @param characterSet The set of characters to use (default: CharacterSet.AZaz09).
 * @returns A randomly generated string.
 */
export function generateCharacters(length: number, characterSet: CharacterSet = CharacterSet.AZaz09): string {
	switch (characterSet) {
		case CharacterSet.AZaz09:
			return characterGenerator2Offset(length, 0x30, 0x6e, 0x39, 0x07, 0x5a, 0x06);
		case CharacterSet.AZaz:
			return characterGeneratorOffset(length, 0x41, 0x75, 0x5a, 0x06);
		case CharacterSet.AZ09:
			return characterGeneratorOffset(length, 0x30, 0x54, 0x39, 0x07);
		case CharacterSet.az09:
			return characterGeneratorOffset(length, 0x30, 0x54, 0x39, 0x27);
		case CharacterSet.AZ:
			return characterGenerator(length, 0x41, 0x5b);
		case CharacterSet.az:
			return characterGenerator(length, 0x61, 0x7b);
	}
}

/**
 * Generates a random string using a character range with two offset adjustments.
 * Used for complex character sets like AZaz09.
 * @param length The length of the string to generate.
 * @param start The starting char code.
 * @param end The ending char code (exclusive).
 * @param offset1 The first offset char code.
 * @param offset1Amount The amount to offset if above offset1.
 * @param offset2 The second offset char code.
 * @param offset2Amount The amount to offset if above offset2.
 * @returns A randomly generated string.
 */
function characterGenerator2Offset(
	length: number,
	start: number,
	end: number,
	offset1: number,
	offset1Amount: number,
	offset2: number,
	offset2Amount: number
) {
	let out = '';
	const diff = end - start;

	for (let i = 0; i < length; i++) {
		let char = Math.floor(Math.random() * diff) + start;
		if (char > offset1) char += offset1Amount;
		if (char > offset2) char += offset2Amount;
		out += String.fromCharCode(char);
	}

	return out;
}

/**
 * Generates a random string using a character range with a single offset adjustment.
 * Used for character sets that skip a range (e.g., AZaz, AZ09, az09).
 * @param length The length of the string to generate.
 * @param start The starting char code.
 * @param end The ending char code (exclusive).
 * @param offset The char code after which to apply the offset.
 * @param offsetAmount The amount to offset if above the offset char code.
 * @returns A randomly generated string.
 */
function characterGeneratorOffset(length: number, start: number, end: number, offset: number, offsetAmount: number) {
	let out = '';
	const diff = end - start;

	for (let i = 0; i < length; i++) {
		let char = Math.floor(Math.random() * diff) + start;
		if (char > offset) char += offsetAmount;
		out += String.fromCharCode(char);
	}

	return out;
}

/**
 * Generates a random string using a continuous character range.
 * Used for simple character sets (e.g., only uppercase or only lowercase).
 * @param length The length of the string to generate.
 * @param start The starting char code.
 * @param end The ending char code (exclusive).
 * @returns A randomly generated string.
 */
function characterGenerator(length: number, start: number, end: number) {
	let out = '';
	const diff = end - start;

	for (let i = 0; i < length; i++) {
		const char = Math.floor(Math.random() * diff) + start;
		out += String.fromCharCode(char);
	}

	return out;
}
