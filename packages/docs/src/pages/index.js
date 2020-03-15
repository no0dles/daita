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
                ahead and move your docs into the <code>docs</code> directory.
            </>
        ),
    },
    {
        title: <>Easy to Use</>,
        description: (
            <>
                Daita was designed from the ground up to be easily installed and
                used to get your website up and running quickly.
            </>
        ),
    },
    {
        title: <>Compile Safe</>,
        description: (
            <>
                Extend or customize your website layout by reusing React. Docusaurus can
                be extended while reusing the same header and footer.
            </>
        ),
    },
    {
        title: <>Keep Flexibility</>,
        description: (
            <>
                Extend or customize your website layout by reusing React. Docusaurus can
                be extended while reusing the same header and footer.
            </>
        ),
    },
    {
        title: <>Stay Secure</>,
        description: (
            <>
                Extend or customize your website layout by reusing React. Docusaurus can
                be extended while reusing the same header and footer.
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
    const {siteConfig = {}} = context;
    const heroImage = useBaseUrl('img/hero.svg');
    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />">
            <header className={classnames('hero hero--primary', styles.heroBanner)}>
                <div className={classnames('container')}>
                    <div className={classnames('row')}>
                        <div className={classnames('col padding-top--lg padding-bottom--lg')}>
                            <h1 className="hero__title">{siteConfig.title}</h1>
                            <p className="hero__subtitle">{siteConfig.tagline}</p>
                            <div className={styles.buttons}>
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
                        <div className="col text--center align--center" style={{'align-items': 'center', display: 'flex', 'justify-content': 'center'}}>
                            <img src={heroImage}></img>
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
