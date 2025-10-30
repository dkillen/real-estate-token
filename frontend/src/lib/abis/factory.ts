export const factoryAbi = [
  {
    type: 'function',
    name: 'getAllProjects',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address[]' }],
  },
  {
    type: 'function',
    name: 'deployProject',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'name_', type: 'string' },
      { name: 'symbol_', type: 'string' },
      { name: 'propertyId_', type: 'string' },
      { name: 'jurisdiction_', type: 'string' },
      { name: 'metadataUri_', type: 'string' },
    ],
    outputs: [{ type: 'address' }],
  },
  {
    type: 'event',
    name: 'ProjectCreated',
    anonymous: false,
    inputs: [
      { name: 'projectAddress', type: 'address', indexed: true },
      { name: 'issuer', type: 'address', indexed: true },
      { name: 'projectName', type: 'string', indexed: false },
      { name: 'projectSymbol', type: 'string', indexed: false },
      { name: 'propertyId', type: 'string', indexed: false },
      { name: 'jurisdiction', type: 'string', indexed: false },
      { name: 'metadataUri', type: 'string', indexed: false },
    ],
  },
] as const;
