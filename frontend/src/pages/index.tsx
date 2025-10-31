import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import ContractInfo from '../components/whitelist/ContractInfo';
import ApproveRevokeForm from '../components/whitelist/ApproveRevokeForm'
import Header from '../components/layout/Header';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Whitelist Console</title>
        <meta name="description" content="MANTRA Dukong Whitelist Admin" />
      </Head>

      <Header />

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
        <section style={{ border: '1px solid #ddd', borderRadius: 6, padding: 16, marginBottom: 16 }}>
          <h2 style={{ marginTop: 0 }}>Contract</h2>
          <ContractInfo />
        </section>

        <section style={{ border: '1px solid #ddd', borderRadius: 6, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Approve / Revoke</h2>
          <ApproveRevokeForm />
        </section>
      </main>
    </>
  );
};

export default Home;
