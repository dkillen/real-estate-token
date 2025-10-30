// import Link from 'next/link';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { useAccount, useChainId } from 'wagmi';

// const DUKONG_CHAIN_ID = 5887;

// export default function Header({ title = 'RWA Demo dApp' }: { title?: string }) {
//   const chainId = useChainId();
//   const { address } = useAccount();

//   const wrongChain = !!chainId && chainId !== DUKONG_CHAIN_ID;

//   return (
//     <header style={{ borderBottom: '1px solid #e5e7eb', marginBottom: 16 }}>
//       <div style={{
//         maxWidth: 1000, margin: '0 auto', padding: '12px 16px',
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between'
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//           <Link href="/" style={{ textDecoration: 'none', color: '#111' }}>
//             <h1 style={{ margin: 0, fontSize: 18 }}>{title}</h1>
//           </Link>

//           {/* Nav */}
//           <nav style={{ display: 'flex', gap: 12, fontSize: 14 }}>
//             <Link href="/">Home</Link>
//             <Link href="/projects/new">Create Project</Link>
//             <Link href="/projects/manage">Manage Project</Link>
//           </nav>
//         </div>

//         {/* Wallet */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           {address && (
//             <span style={{
//               fontFamily: 'monospace', fontSize: 12, color: '#6b7280',
//               background: '#f3f4f6', borderRadius: 4, padding: '2px 6px'
//             }}>
//               {address.slice(0, 6)}…{address.slice(-4)}
//             </span>
//           )}
//           <ConnectButton />
//         </div>
//       </div>

//       {/* Network banner */}
//       {wrongChain && (
//         <div style={{ background: '#fef2f2', borderTop: '1px solid #fee2e2' }}>
//           <div style={{
//             maxWidth: 1000, margin: '0 auto', padding: '8px 16px',
//             color: '#991b1b', fontSize: 14
//           }}>
//             You’re on the wrong network. Please switch to MANTRA Dukong (chainId 5887).
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';

const DUKONG_CHAIN_ID = 5887;

export default function Header({ title = 'RWA Demo dApp' }: { title?: string }) {
  const chainId = useChainId();
  const { address } = useAccount();
  const wrongChain = !!chainId && chainId !== DUKONG_CHAIN_ID;

  return (
    <header style={{
      borderBottom: '1px solid var(--line)',
      background: '#ffffff',
      marginBottom: 20,
      width: '100%',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap', // allows wrapping on smaller screens
        gap: 16,
      }}>
        {/* Left section: title + nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24,
        }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#111' }}>
            <h1 style={{ margin: 0, fontSize: 20 }}>{title}</h1>
          </Link>

          <nav style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            fontSize: 15,
          }}>
            <Link href="/">Home</Link>
            <Link href="/projects/new">Create Project</Link>
            <Link href="/projects/manage">Manage Projects</Link>
          </nav>
        </div>

        {/* Right section: wallet */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}>
          <ConnectButton />
        </div>
      </div>

      {wrongChain && (
        <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          borderTop: '1px solid #fecaca',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: 14,
        }}>
          Please switch to MANTRA Dukong (Chain ID 5887)
        </div>
      )}
    </header>
  );
}
