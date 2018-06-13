const spawn = require('cross-spawn')
const Ganache = require('ganache-core')

const PORT = 8545

const deployContracts = () => {
  return new Promise((resolve, reject) => {
    const truffleMigrate = spawn('../node_modules/.bin/truffle', ['migrate', '--reset', '--compile-all'], { cwd: './contracts' })
    truffleMigrate.stdout.pipe(process.stdout)
    truffleMigrate.stderr.on('data', data => {
      reject(String(data))
    })
    truffleMigrate.on('exit', code => {
      if (code === 0) {
        console.log('Truffle migrate finished OK.')
      }
      resolve()
    })
  })
}

const buildContracts = () => {
    return new Promise((resolve, reject) => {
      const truffleCompile = spawn('../node_modules/.bin/truffle', ['compile'], { cwd: './contracts' })
      truffleCompile.stdout.pipe(process.stdout)
      truffleCompile.stderr.on('data', data => {
        reject(String(data))
      })
      truffleCompile.on('exit', code => {
        if (code === 0) {
          console.log('Truffle compile finished OK.')
        }
        resolve()
      })
    })
  }

const startGanache = () => {
  return new Promise((resolve, reject) => {
    var server = Ganache.server({
      total_accounts: 10,
      default_balance_ether: 100,
      network_id: 999,
      seed: 123,
      blocktime: 0,
      mnemonic: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'
    })
    server.listen(PORT, err => {
      if (err) {
        return reject(err)
      }
      console.log(`Ganache listening on port ${PORT}`)
      resolve()
    })
  })
}

const start = async () => {
    console.log('Starting Local Blockchain');
    await startGanache()
    console.log('Deploying Smart Contracts');
    // if (process.argv[2]) {
    //     await buildContracts()
    // } 
    // else 
    // {
    //     await deployContracts();
    // }
};

start();