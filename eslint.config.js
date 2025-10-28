import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  { ignores: ['node_modules/**', 'web/**'] },
  js.configs.recommended,
  ...compat.extends('expo'),
];
