export const zkMinterRateLimiterV1FactoryAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_bytecodeHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "BYTECODE_HASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "createMinter",
    "inputs": [
      {
        "name": "_mintable",
        "type": "address",
        "internalType": "contract IMintable"
      },
      {
        "name": "_admin",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_mintRateLimit",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_mintRateLimitWindow",
        "type": "uint48",
        "internalType": "uint48"
      },
      {
        "name": "_saltNonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "_minterRateLimiterAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createMinter",
    "inputs": [
      {
        "name": "_mintable",
        "type": "address",
        "internalType": "contract IMintable"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getMinter",
    "inputs": [
      {
        "name": "_mintable",
        "type": "address",
        "internalType": "contract IMintable"
      },
      {
        "name": "_admin",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_mintRateLimit",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_mintRateLimitWindow",
        "type": "uint48",
        "internalType": "uint48"
      },
      {
        "name": "_saltNonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "_minterRateLimiterAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "MinterRateLimiterCreated",
    "inputs": [
      {
        "name": "minterRateLimiter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "mintable",
        "type": "address",
        "indexed": false,
        "internalType": "contract IMintable"
      },
      {
        "name": "admin",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "mintRateLimit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "mintRateLimitWindow",
        "type": "uint48",
        "indexed": false,
        "internalType": "uint48"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ZkMinterRateLimiterV1Factory__InvalidAdminAddress",
    "inputs": []
  }
] as const;