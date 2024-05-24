import Head from 'next/head';
import Layout from './utils/layout';

const Home = () => {
  return (
    <Layout>
      <Head>
        <title>Home Page</title>
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold">Welcome to Next.js with TypeScript and Tailwind CSS</h1>
      </main>
    </Layout>
  );
};

export default Home;
