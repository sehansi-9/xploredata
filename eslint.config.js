    import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
    import nextTypescript from "eslint-config-next/typescript";
    // eslint.config.mjs
    import { FlatCompat } from '@eslint/eslintrc';

    // baseDirectory is necessary for FlatCompat to resolve plugins/configs correctly
    // Use import.meta.dirname for Node.js v20.11.0+ or __dirname for earlier versions
    const compat = new FlatCompat({
      baseDirectory: import.meta.dirname,
    });

    // eslint.config.mjs (continued)
    const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, // ... previous configurations
    {
      files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
      rules: {
        'no-unused-vars': 'warn',
        'indent': ['warn', 2],
        // Add or override other rules here
      },
    }, // Define ignores for specific files or directories
    {
      ignores: [
        '.next/**',
        'out/**',
        'build/**',
        'node_modules/',
        'next-env.d.ts',
      ],
    }];

    export default eslintConfig;