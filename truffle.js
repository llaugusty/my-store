module.exports = {
  contracts_build_directory: "../output",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};