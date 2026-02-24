export const zkMinterDelayV1FactoryAbi = [
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
        "name": "_mintDelay",
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
        "name": "_minterDelayAddress",
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
        "name": "_mintDelay",
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
        "name": "_minterDelayAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "MinterDelayCreated",
    "inputs": [
      {
        "name": "minterDelay",
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
        "name": "mintDelay",
        "type": "uint48",
        "indexed": false,
        "internalType": "uint48"
      }
    ],
    "anonymous": false
  }
] as const;
