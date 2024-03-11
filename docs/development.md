# Setting up Development Environment

## Install Node.js

Install Node.js by your favorite method, or use Node Version Manager by following directions at https://github.com/creationix/nvm

```bash
nvm install v4
```

## Fork and Download Repositories

To develop aidpcore-node:

```bash
cd ~
git clone git@github.com:<yourusername>/aidpcore-node.git
git clone git@github.com:<yourusername>/aidpcore-lib.git
```

To develop aidpcoin or to compile from source:

```bash
git clone git@github.com:<yourusername>/aidpcoin.git
git fetch origin <branchname>:<branchname>
git checkout <branchname>
```
**Note**: See aidpcoin documentation for building aidpcoin on your platform.


## Install Development Dependencies

For Ubuntu:
```bash
sudo apt-get install libzmq3-dev
sudo apt-get install build-essential
```
**Note**: Make sure that libzmq-dev is not installed, it should be removed when installing libzmq3-dev.


For Mac OS X:
```bash
brew install zeromq
```

## Install and Symlink

```bash
cd aidpcore-lib
npm install
cd ../aidpcore-node
npm install
```
**Note**: If you get a message about not being able to download aidpcoin distribution, you'll need to compile aidpd from source, and setup your configuration to use that version.


We now will setup symlinks in `aidpcore-node` *(repeat this for any other modules you're planning on developing)*:
```bash
cd node_modules
rm -rf aidpcore-lib
ln -s ~/aidpcore-lib
rm -rf aidpcoin-rpc
ln -s ~/aidpcoin-rpc
```

And if you're compiling or developing aidpcoin:
```bash
cd ../bin
ln -sf ~/aidpcoin/src/aidpd
```

## Run Tests

If you do not already have mocha installed:
```bash
npm install mocha -g
```

To run all test suites:
```bash
cd aidpcore-node
npm run regtest
npm run test
```

To run a specific unit test in watch mode:
```bash
mocha -w -R spec test/services/aidpd.unit.js
```

To run a specific regtest:
```bash
mocha -R spec regtest/aidpd.js
```

## Running a Development Node

To test running the node, you can setup a configuration that will specify development versions of all of the services:

```bash
cd ~
mkdir devnode
cd devnode
mkdir node_modules
touch aidpcore-node.json
touch package.json
```

Edit `aidpcore-node.json` with something similar to:
```json
{
  "network": "livenet",
  "port": 3001,
  "services": [
    "aidpd",
    "web",
    "insight-api",
    "insight-ui",
    "<additional_service>"
  ],
  "servicesConfig": {
    "aidpd": {
      "spawn": {
        "datadir": "/home/<youruser>/.aidpd",
        "exec": "/home/<youruser>/aidpcoin/src/aidpd"
      }
    }
  }
}
```

**Note**: To install services [insight-api](https://github.com/underdarkskies/insight-api) and [insight-ui](https://github.com/underdarkskies/insight-ui) you'll need to clone the repositories locally.

Setup symlinks for all of the services and dependencies:

```bash
cd node_modules
ln -s ~/aidpcore-lib
ln -s ~/aidpcore-node
ln -s ~/insight-api
ln -s ~/insight-ui
```

Make sure that the `<datadir>/aidp.conf` has the necessary settings, for example:
```
server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
timestampindex=1
spentindex=1
zmqpubrawtx=tcp://127.0.0.1:28332
zmqpubhashblock=tcp://127.0.0.1:28332
rpcallowip=127.0.0.1
rpcuser=aidpcoin
rpcpassword=local321
```

From within the `devnode` directory with the configuration file, start the node:
```bash
../aidpcore-node/bin/aidpcore-node start
```
