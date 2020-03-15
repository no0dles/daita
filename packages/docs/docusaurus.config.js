module.exports = {
  title: 'Swiss Army Knife for Data',
  tagline: 'Daita is a framework to manage and share data with backwards compatibility and security in mind',
  url: 'https://daita.ch',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'no0dles', // Usually your GitHub org/user name.
  projectName: 'daita', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Daita',
      logo: {
        alt: 'Daita Logo',
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/daita/getting-started',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
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
              label: 'Blog',
              to: 'blog',
            },
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
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
