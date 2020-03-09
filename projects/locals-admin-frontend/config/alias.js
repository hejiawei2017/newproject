const path = require('path')

module.exports = {
    components: path.resolve(__dirname, '..') + '/src/components',
    container: path.resolve(__dirname, '..') + '/src/common/container',
    images: path.resolve(__dirname, '..') + '/src/common/images',
    pages: path.resolve(__dirname, '..') + '/src/common/pages',
    utils: path.resolve(__dirname, '..') + '/src/common/utils',
    data: path.resolve(__dirname, '..') + '/src/server/data',
    actions: path.resolve(__dirname, '..') + '/src/common/actions',
    reducers: path.resolve(__dirname, '..') + '/src/common/reducers',
    api: path.resolve(__dirname, '..') + '/src/common/api',
    'redux-conf': path.resolve(__dirname, '..') + '/src/redux',
    services: path.resolve(__dirname, '..') + '/src/services',
    utils: path.resolve(__dirname, '../src/utils'),
    '@':path.resolve(__dirname, '../src'),
}