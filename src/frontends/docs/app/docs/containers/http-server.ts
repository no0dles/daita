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
            description: 'pull image',
            sourceCodes: [
              {
                type: 'bash',
                code: 'docker pull docker.pkg.github.com/no0dles/daita/http:latest',
                title: 'Pull image',
              },
            ],
          },
        ],
      },
      { id: 'environment', title: 'Environment Variables', description: ' ' },
      { id: 'ports', title: 'Ports', description: ' ' },
    ],
  },
];
