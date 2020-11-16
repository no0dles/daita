import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
    {
        title: <>Focus on What Matters</>,
        description: (
            <>
                Daita lets you focus on your business, and we&apos;ll do the chores. Go
                ahead check out our demos and docs.
            </>
        ),
    },
    {
        title: <>Lightweight</>,
        description: (
            <>
              Daita was designed from the ground up to be as lightweight as possible
              and have a minimum of external dependencies.
            </>
        ),
    },
    {
        title: <>Compile Safe</>,
        description: (
            <>
              Catch errors early during compile time, but keep flexibility without adding more build tools.
              Everything works with plain typescript and requires no additional build steps.
            </>
        ),
    },
    {
      title: <>Full SQL capabilities</>,
      description: (
        <>
          Take advantage of the complete set of SQL capabilities with additional type checks and linting rules.
        </>
      ),
    },
    {
        title: <>Stay Secure</>,
        description: (
            <>
              Take more control over the way it's allowed to execute a query and which data can be accessed.
            </>
        ),
    },
    {
      title: <>Migrations</>,
      description: (
        <>
          Generate sql migrations with the powerfull daita cli with support for backward compatible schema changes.
        </>
      ),
    },
];

function Feature({title, description}) {
    return (
        <div className={classnames('col col--6', styles.feature)}>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

function Home() {
    const context = useDocusaurusContext();
    return (
        <Layout
            title={`Daita`}
            description="Description will go into a meta tag in <head />">
            <header className={classnames('hero hero--primary', styles.heroBanner)}>
                <div className={classnames('container')}>
                    <div className={classnames('row revrow')}>
                      <div className="col text--center align--center" style={{'align-items': 'center', display: 'flex', 'flex-direction': 'column', 'justify-content': 'center', padding: '0 32px'}}>
                        <pre style={{color: '#fff', background: '#ae2020', padding: '16px', 'border-radius': '4px', width: '378px', height: '100px'}}>

                          {/*<MarkdownBlock>{meta.rawContent}</MarkdownBlock>*/}
                        </pre>
                        <div className={styles.buttons}>
                          <Link
                            className={classnames(
                              'button button--outline button--secondary button--lg',
                              styles.getStarted,
                            )}
                            style={{'margin-right': '16px'}}
                            to={useBaseUrl('docs')}>
                            Documentation
                          </Link>
                          <Link
                            className={classnames(
                              'button button--outline button--secondary button--lg',
                              styles.getStarted,
                            )}
                            to={useBaseUrl('docs/daita/getting-started')}>
                            Get Started
                          </Link>
                        </div>
                      </div>
                        <div className={classnames('col title-div')} style={{'text-align': 'left'}}>
                          <h1 style={{'font-size': '3em', 'margin-bottom': 0}}>Daita</h1>
                          <h2>The Swiss army knife for data</h2>
                          <p></p>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                {features && features.length && (
                    <section className={styles.features}>
                        <div className="container">
                            <div className="row">
                                {features.map((props, idx) => (
                                    <Feature key={idx} {...props} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </Layout>
    );
}

export default Home;
