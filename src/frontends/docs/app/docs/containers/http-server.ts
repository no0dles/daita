import { Section } from '../../section';

export const httpContainerSections: Section[] = [
  {
    id: 'http-server',
    title: 'HTTP Server',
    description: ' ',
    sections: [
      {
        id: 'installation',
        title: 'Installation',
        snippets: [
          {
            description:
              'The http server image is hosted on the github packages registry. To be able to download the image, a login is required.',
            sourceCodes: [
              {
                type: 'bash',
                code:
                  'docker login https://docker.pkg.github.com -u <username> -p  <personal_access_token>\n' +
                  'docker pull docker.pkg.github.com/no0dles/daita/http:latest',
                title: 'bash',
              },
            ],
          },
          {
            description: '',
            sourceCodes: [
              {
                type: 'bash',
                code: 'docker run -it --rm docker.pkg.github.com/no0dles/daita/http',
                title: 'bash',
              },
            ],
          },
        ],
      },
      {
        id: 'environment',
        title: 'Environment Variables',
        description:
          "LOGGER_ENABLED, LOGGER_FORMAT='plain', 'json', 'pretty', LOGGER_LEVEL='trace', 'debug', 'info', 'warn', 'error'], 'info', TRANSACTION_TIMEOUT=4000, DATABASE_URL=/app/http.db, PORT=3000, AUTH_FILE=/app/auth.json",
      },
      { id: 'ports', title: 'Ports', description: ' ' },
    ],
  },
];
