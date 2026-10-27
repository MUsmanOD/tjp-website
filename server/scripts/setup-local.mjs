import {randomBytes} from 'node:crypto';
import {writeFileSync} from 'node:fs';
const secret=()=>randomBytes(32).toString('hex');
const source=`NODE_ENV=development\nPORT=5027\nMONGODB_URI=mongodb://127.0.0.1:27027/tjp_local?replicaSet=rs0\nCLIENT_ORIGIN=http://localhost:3000\nDATA_KEYS='${JSON.stringify({'1':secret()})}'\nCURRENT_KEY=1\nHASH_KEY=${secret()}\nTOKEN_KEY=${secret()}\nTRUST_PROXY=loopback\n`;
writeFileSync(new URL('../.env',import.meta.url),source,{flag:'wx',mode:0o600});
console.log('Created server/.env with independent random keys. Existing configurations are never overwritten.');
