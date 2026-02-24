export const zkCappedMinterV3FactoryAbi = [
  {
      "inputs": [
          {
              "internalType": "bytes32",
              "name": "_bytecodeHash",
              "type": "bytes32"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "cappedMinter",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "contract IMintable",
              "name": "mintable",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "admin",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "cap",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint48",
              "name": "startTime",
              "type": "uint48"
          },
          {
              "indexed": false,
              "internalType": "uint48",
              "name": "expirationTime",
              "type": "uint48"
          }
      ],
      "name": "MinterCappedCreated",
      "type": "event"
  },
  {
      "inputs": [],
      "name": "BYTECODE_HASH",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "contract IMintable",
              "name": "_mintable",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "_admin",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "_cap",
              "type": "uint256"
          },
          {
              "internalType": "uint48",
              "name": "_startTime",
              "type": "uint48"
          },
          {
              "internalType": "uint48",
              "name": "_expirationTime",
              "type": "uint48"
          },
          {
              "internalType": "uint256",
              "name": "_saltNonce",
              "type": "uint256"
          }
      ],
      "name": "createMinter",
      "outputs": [
          {
              "internalType": "address",
              "name": "_cappedMinterAddress",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "contract IMintable",
              "name": "_mintable",
              "type": "address"
          },
          {
              "internalType": "bytes",
              "name": "_args",
              "type": "bytes"
          }
      ],
      "name": "createMinter",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "contract IMintable",
              "name": "_mintable",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "_admin",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "_cap",
              "type": "uint256"
          },
          {
              "internalType": "uint48",
              "name": "_startTime",
              "type": "uint48"
          },
          {
              "internalType": "uint48",
              "name": "_expirationTime",
              "type": "uint48"
          },
          {
              "internalType": "uint256",
              "name": "_saltNonce",
              "type": "uint256"
          }
      ],
      "name": "getMinter",
      "outputs": [
          {
              "internalType": "address",
              "name": "_cappedMinterAddress",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  }
] as const;
