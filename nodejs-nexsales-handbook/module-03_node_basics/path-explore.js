import path from 'node:path';

const fileName = 'annual-report.pdf';
const fullPath = path.join(process.cwd(), 'reports', fileName);

// const pathDetails = path.parse(fullPath);
// console.log('Complete Path:', fullPath);
// console.log('Root:', pathDetails.root);
// console.log('Directory:', pathDetails.dir);
// console.log('Base Name:', pathDetails.base);
// console.log('File Name:', pathDetails.name);
// console.log('Extension:', pathDetails.ext);

// console.log(path.parse(fullPath));

const pathDetails = {
    dir: path.join(process.cwd(),'backups'),
    root: 'C:\\',
    base: 'employee-data.json',
    ext:'json',
    name:'employee-data'
};

const newPath = path.format(pathDetails);
// console.log('Generated Path:', newPath);

const absPath = path.resolve('data','user','user.json');

// console.log("Absolute Path : ", absPath);
// console.log("Is Absolute Path : ", path.isAbsolute(absPath));


//relative Path

const source = "project-folder/documents/reports";
const destination = "project-folder/documents/backups/test";

const relPath = path.relative(source,destination);

// console.log("Relative Path : ",relPath);


// Event emitter

import { EventEmitter } from 'node:events';

const orderEvents = new EventEmitter();

// Register a listener
orderEvents.on('orderPlaced', (order) => {
    console.log(
        `New order received: #${order.id} for $${order.amount}`
    );
});

// Emit the event
orderEvents.emit('orderPlaced', {
    id: 101,
    amount: 250
});











