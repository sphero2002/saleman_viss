const withTM = require('next-transpile-modules')([
    '@fullcalendar/common',
    '@fullcalendar/daygrid',
    '@fullcalendar/interaction',
    '@fullcalendar/list',
    '@fullcalendar/react',
    '@fullcalendar/timegrid',
    '@fullcalendar/timeline',
]);

module.exports = withTM({
    swcMinify: false,
    trailingSlash: true,
    env: {
        // HOST
        HOST_API_KEY: 'https://localhost:7287/api',
        DOWNLOAD_FILE: 'http://vicschool.site:8080/api/File/downloadFile?',
        VIEW_FILE: 'http://vicschool.site:8080/uploads/',
        // MAPBOX
        MAPBOX_API: '',
        // FIREBASE
        // AWS COGNITO
        AWS_COGNITO_USER_POOL_ID: '',
        AWS_COGNITO_CLIENT_ID: '',
        // AUTH0
        AUTH0_DOMAIN: '',
        AUTH0_CLIENT_ID: '',
    },
});
