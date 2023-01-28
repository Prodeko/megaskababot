module.exports = {
    arrowParens: 'avoid',
    plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')], // Fix: https://github.com/trivago/prettier-plugin-sort-imports/issues/51#issuecomment-1018985805
    printWidth: 100,
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    importOrder: ['^(hooks|@)', '^[.]+/'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
  }
  