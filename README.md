
# Immunify

This project is a decentralized application that utilizes Dfinity (dfx), Motoko, Node.js, React, HTML, CSS, and JavaScript to create digital vaccine passports (DVPs) for individuals. It is built on a local replica of the ICP blockchain, providing secure and decentralized access to vaccination records.


## Features

- Generate Digital Vaccine Passports (DVPs) as Non-Fungible Tokens (NFTs)
- View and manage DVPs via a user dashboard on the dapp's website
- Send DVPs to organizations or authorities requiring vaccination proof
- Approve or reject DVPs on the recipient's dashboard


## Run Locally

Install Node.js and its package installer, npm.

Clone the project:

```bash
  git clone https://github.com/Rusteee16/Immunify_DVP.git
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
  dfx deploy --argument='(principal "572j2-hhj66-aelp5-wihrd-royiv-ew3xa-zfsav-plh5t-4ww5f-yfssv-aqe", "Bruce Wayne", "X451875", "Gotham", "M", "Batman", "12-02-2022", "28-03-2023", (vec {137; 80; 78; 71; 13; 10; 26; 10; 0; 0; 0; 13; 73; 72; 68; 82; 0; 0; 0; 10; 0; 0; 0; 10; 8; 6; 0; 0; 0; 141; 50; 207; 189; 0; 0; 0; 1; 115; 82; 71; 66; 0; 174; 206; 28; 233; 0; 0; 0; 68; 101; 88; 73; 102; 77; 77; 0; 42; 0; 0; 0; 8; 0; 1; 135; 105; 0; 4; 0; 0; 0; 1; 0; 0; 0; 26; 0; 0; 0; 0; 0; 3; 160; 1; 0; 3; 0; 0; 0; 1; 0; 1; 0; 0; 160; 2; 0; 4; 0; 0; 0; 1; 0; 0; 0; 10; 160; 3; 0; 4; 0; 0; 0; 1; 0; 0; 0; 10; 0; 0; 0; 0; 59; 120; 184; 245; 0; 0; 0; 113; 73; 68; 65; 84; 24; 25; 133; 143; 203; 13; 128; 48; 12; 67; 147; 94; 97; 30; 24; 0; 198; 134; 1; 96; 30; 56; 151; 56; 212; 85; 68; 17; 88; 106; 243; 241; 235; 39; 42; 183; 114; 137; 12; 106; 73; 236; 105; 98; 227; 152; 6; 193; 42; 114; 40; 214; 126; 50; 52; 8; 74; 183; 108; 158; 159; 243; 40; 253; 186; 75; 122; 131; 64; 0; 160; 192; 168; 109; 241; 47; 244; 154; 152; 112; 237; 159; 252; 105; 64; 95; 48; 61; 12; 3; 61; 167; 244; 38; 33; 43; 148; 96; 3; 71; 8; 102; 4; 43; 140; 164; 168; 250; 23; 219; 242; 38; 84; 91; 18; 112; 63; 0; 0; 0; 0; 73; 69; 78; 68; 174; 66; 96; 130;}))'
```
Start the web server:
```bash
  npm start
```

Open the app in your browser at http://localhost:8080/admin for admin section.

Open the app in your browser at http://localhost:8080/users for admin section.

Open the app in your browser at http://localhost:8080/enterprise for admin section.

