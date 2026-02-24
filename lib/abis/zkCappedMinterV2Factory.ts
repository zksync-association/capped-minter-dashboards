export const zkCappedMinterV2FactoryAbi = [
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
    "name": "createCappedMinter",
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
        "name": "_cap",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_startTime",
        "type": "uint48",
        "internalType": "uint48"
      },
      {
        "name": "_expirationTime",
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
        "name": "minterAddress",
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
        "name": "_cap",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_startTime",
        "type": "uint48",
        "internalType": "uint48"
      },
      {
        "name": "_expirationTime",
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
        "name": "addr",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "CappedMinterV2Created",
    "inputs": [
      {
        "name": "minterAddress",
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
        "name": "cap",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "startTime",
        "type": "uint48",
        "indexed": false,
        "internalType": "uint48"
      },
      {
        "name": "expirationTime",
        "type": "uint48",
        "indexed": false,
        "internalType": "uint48"
      }
    ],
    "anonymous": false
  }
] as const;
