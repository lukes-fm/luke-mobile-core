import { test, expect } from '@jest/globals';
import { generateCharacters, CharacterSet } from '../src';

test('Generate a string of 32 characters using the default character set.', () => {
	expect(generateCharacters(32)).toMatch(/^[A-Za-z0-9]{32}$/g);
});

test('Generate a string of 32 characters using the character set AZ09', () => {
	expect(generateCharacters(32, CharacterSet.AZ09)).toMatch(/^[A-Z0-9]{32}$/g);
});

test('Generate a string of 32 characters using the character set az09', () => {
	expect(generateCharacters(32, CharacterSet.az09)).toMatch(/^[a-z0-9]{32}$/g);
});

test('Generate a string of 32 characters using the character set AZaz', () => {
	expect(generateCharacters(32, CharacterSet.AZaz)).toMatch(/^[A-Za-z]{32}$/g);
});

test('Generate a string of 32 characters using the character set AZ', () => {
	expect(generateCharacters(32, CharacterSet.AZ)).toMatch(/^[A-Za-z]{32}$/g);
});

test('Generate a string of 32 characters using the character set az', () => {
	expect(generateCharacters(32, CharacterSet.az)).toMatch(/^[a-z]{32}$/g);
});
