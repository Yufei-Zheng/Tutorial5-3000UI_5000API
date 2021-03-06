### 1. Commands to execute the project

```
cd api
npm install
```
Run mongod:
```
screen mongod
```
\# Press ctrl+a+d to return to terminal

Initiate mongodb:
```
mongo issuetracker scripts/init.mongo.js
```
Run API server using port 5000:
```
screen npm start
```
\# Press ctrl+a+d to return to terminal
```
cd ../ui
npm install
```
Prepare files using Webpack:
```
npm run build
```
run UI server using port 3000:
```
screen npm run dev
```

### 2. Q2

#### commands to execute Q2

```
$ cd home/IT5007/api/scripts
$ screen mongod
$ mongo issuetracker --eval "db.customers.remove({})"
$ node trymongo.js
```

#### results

```
(1).
Result of insertMany and insertOne:
 [ { _id: 617abf5f969a20133b33dc15,
    serial: 1,
    name: 'Alice',
    contact: '12345678' },
  { _id: 617abf5f969a20133b33dc16,
    serial: 2,
    name: 'Bob',
    contact: '87654321' },
  { _id: 617abf5f969a20133b33dc17,
    serial: 3,
    name: 'Cindy',
    contact: '56781234' } ]

(2).    
Result of find serial no.1:
 [ { _id: 617abf5f969a20133b33dc15,
    serial: 1,
    name: 'Alice',
    contact: '12345678' } ]
Result of find serial no.2 (using projection):
 [ { _id: 617abf5f969a20133b33dc16,
    serial: 2,
    name: 'Bob',
    contact: '87654321' } ]

(3).
Result of updateOne, updateMany and replaceOne:
 [ { _id: 617abf5f969a20133b33dc15,
    serial: 1,
    name: 'Alice',
    contact: '12345678',
    timestamp: 'Wed Oct 27 2021' },
  { _id: 617abf5f969a20133b33dc16,
    serial: 2,
    name: 'Updated_Bob',
    contact: '87654321',
    timestamp: 'Wed Oct 27 2021' },
  { _id: 617abf5f969a20133b33dc17,
    serial: 3,
    name: 'Updated_Cindy',
    contact: 'Updated_56781234' } ]

(4).    
Result of delete (using aggerate):
 [ { _id: null, count: 2 } ]
```

### 3. Github repository

Link: https://github.com/Yufei-Zheng/IT5007-Tutorial5.git

https://github.com/Yufei-Zheng/IT5007-Tutorial5/invitations

Collaborator inivitations have been sent to both TAs. Please feel free to contact me if there are any problems. Thank you!

