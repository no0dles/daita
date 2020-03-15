module.exports = {
    someSidebar: {
        General: ['daita/about-daita', 'daita/getting-started', 'daita/installation', 'daita/roadmap', 'daita/faq'],
        'CLI': ['cli/migration', 'cli/serve', 'cli/version', 'cli/help'],
        'Relational': [
            'relational/schema',
            'relational/context',
            'relational/transaction',
            {
                type: 'category',
                label: 'Query',
                items: ['relational/query/select', 'relational/query/insert', 'relational/query/update', 'relational/query/delete'],
            }],
        'Document': [],
        'Data Adapters': ['data-adapters/postgres', 'data-adapters/mongodb', 'data-adapters/sqlite', 'data-adapters/websocket', 'data-adapters/rest'],
        Migrations: [],
        Security: ['security/permissions'],
        Testing: ['testing/unit-testing', 'testing/integration-testing'],
    },
};
