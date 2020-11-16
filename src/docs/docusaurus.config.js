module.exports = {
  title: 'Daita',
  tagline: '... is the Swiss Army Knife for Data',
  url: 'https://daita.ch',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'warn',
  organizationName: 'no0dles', // Usually your GitHub org/user name.
  projectName: 'daita', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Daita',
      logo: {
        alt: 'Daita Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/daita/getting-started',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'right',
        },
        //{to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/no0dles/daita',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting started',
              to: 'docs/daita/getting-started',
            },
            {
              label: 'About Daita',
              to: 'docs/daita/about-daita',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/daita',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/no0dles/daita',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} daita.ch`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./css/custom.css'),
        },
      },
    ],
  ],
};
