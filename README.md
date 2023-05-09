
# Immunify

This project is a decentralized application that utilizes Dfinity (dfx), Motoko, Node.js, React, HTML, CSS, and JavaScript to create digital vaccine passports (DVPs) for individuals. It is built on a local replica of the ICP blockchain, providing secure and decentralized access to vaccination records.


## Features

- Generate digital vaccine passports (DVPs) as non-fungible tokens (NFTs)
- View and manage DVPs via a user dashboard on the dapp's website
- Send DVPs to organizations or authorities requiring vaccination proof
- Approve or reject DVPs on the recipient's dashboard


## Run Locally

Install Node.js and its package installer, npm.

Clone the project:

```bash
  git clone https://link-to-project
```

Go to the project directory:

```bash
  cd my-project
```

Install dependencies:

```bash
  npm install
```

Run the DFX replica:

```bash
  dfx start
```
Deploy the canisters:

```bash
  dfx deploy
```
Start the web server:
```bash
  npm start
```

Open the app in your browser at http://localhost:8080/admin for admin section.

Open the app in your browser at http://localhost:8080/users for admin section.

Open the app in your browser at http://localhost:8080/enterprise for admin section.

