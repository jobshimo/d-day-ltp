import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', 'd-day/**', '.atl/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // scope:app can depend on anything
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: [
                'scope:app',
                'scope:ui',
                'scope:application',
                'scope:domain',
                'scope:infrastructure',
                'scope:content',
                'scope:shared',
              ],
            },
            // scope:ui -> application, domain, shared (NOT infrastructure, content)
            {
              sourceTag: 'scope:ui',
              onlyDependOnLibsWithTags: [
                'scope:ui',
                'scope:application',
                'scope:domain',
                'scope:shared',
              ],
            },
            // scope:application -> domain, shared
            {
              sourceTag: 'scope:application',
              onlyDependOnLibsWithTags: ['scope:application', 'scope:domain', 'scope:shared'],
            },
            // scope:domain -> shared only
            {
              sourceTag: 'scope:domain',
              onlyDependOnLibsWithTags: ['scope:domain', 'scope:shared'],
            },
            // scope:infrastructure -> domain, shared
            {
              sourceTag: 'scope:infrastructure',
              onlyDependOnLibsWithTags: ['scope:infrastructure', 'scope:domain', 'scope:shared'],
            },
            // scope:content -> shared only
            {
              sourceTag: 'scope:content',
              onlyDependOnLibsWithTags: ['scope:content', 'scope:shared'],
            },
            // scope:shared -> shared only (foundational layer)
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    rules: {},
  },
];
