export const zkSync_Contract_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        }
      ],
      "name": "DataAdded",
      "type": "event",
      "signature": "0x4a38af5210d98524692cc33078e70f9daeb8b199bfdec0b4c06f150817ddad76"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "value",
          "type": "string"
        }
      ],
      "name": "addData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xd4a2498d"
    },
    {
      "inputs": [],
      "name": "getData",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x3bc5de30"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        }
      ],
      "name": "getDataOf",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x7e36245e"
    }
  ]