import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import NewProjectForm from '../../components/projects/NewProjectForm';
import Header from '../../components/layout/Header';

export default function NewProjectPage() {
  return (
    <>
      <Head>
        <title>Create Project</title>
      </Head>

      {/* <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
        <h1 style={{ margin: 0 }}>Create Project</h1>
        <ConnectButton />
      </header> */}

      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
        <section style={{ border: '1px solid #ddd', borderRadius: 6, padding: 16 }}>
          <NewProjectForm />
        </section>
      </main>
    </>
  );
}
