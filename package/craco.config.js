module.exports = {
  jest: {
    configure: (cfg, { env, paths, resolve, rootDir }) => {
      return {
        ...cfg,
        collectCoverage: true,
        coverageDirectory: 'reports/coverage',
        coverageReporters: ['html', 'text'],
        reporters: [
          'default',
          [
            'jest-html-reporters',
            {
              publicPath: 'reports/unit/html',
              filename: 'report.html'
            }
          ]
        ]
      }
    }
  }
}
