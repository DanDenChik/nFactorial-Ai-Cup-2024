import Hero from '@components/Hero/Hero';

import styles from '@root/style';
import Layout from '@components/Layout/Layout';

export default function Home() {
  return (
    <Layout>
      <div className={`${styles.flexStart} w-[100%]`}>
        <div className={`${styles.boxWidth}`}>
          <Hero />
        </div>
      </div>
    </Layout>
  );
}
