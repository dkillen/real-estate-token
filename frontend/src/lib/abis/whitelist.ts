// lib/abis/whitelist.ts
export const whitelistAbi = [
  // calls
  {
    type: 'function', name: 'approve', stateMutability: 'nonpayable',
    inputs: [{ name: 'project', type: 'address' }, { name: 'investor', type: 'address' }],
    outputs: [],
  },
  {
    type: 'function', name: 'revoke', stateMutability: 'nonpayable',
    inputs: [{ name: 'project', type: 'address' }, { name: 'investor', type: 'address' }],
    outputs: [],
  },
  {
    type: 'function', name: 'isApproved', stateMutability: 'view',
    inputs: [{ name: 'project', type: 'address' }, { name: 'investor', type: 'address' }],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function', name: 'owner', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'address' }],
  },

  // events
  {
    type: 'event', name: 'Approved', anonymous: false,
    inputs: [
      { name: 'project', type: 'address', indexed: true },
      { name: 'investor', type: 'address', indexed: true },
    ],
  },
  {
    type: 'event', name: 'Revoked', anonymous: false,
    inputs: [
      { name: 'project', type: 'address', indexed: true },
      { name: 'investor', type: 'address', indexed: true },
    ],
  },
] as const;
