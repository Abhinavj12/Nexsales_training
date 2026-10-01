// Node’s Architecture — Call Stack, Event Loop, and libuv
// Node.js runs your JavaScript on a single main thread. Three components work together
// to keep that single thread fast and non-blocking:
// • Call Stack — where your synchronous JavaScript code executes, one function
// call at a time.
// • libuv Thread Pool — a set of background threads (not the main thread) that
// handle expensive operations like file system access, DNS lookups, and some cryptography
// — so the main thread stays free.
// • Event Loop — continuously checks: “Is the call stack empty? Are there completed
// background tasks waiting to run their callback?” If so, it pushes the next
// callback onto the call stack. 

// The Event Loop, simplified:
// ┌───────────────────────────┐
// │ Call Stack empty?         │
// └─────────────┬─────────────┘
//               │ yes
//               ▼
// ┌───────────────────────────┐
// │ Any completed background  │
// │ task with a callback?     │
// └─────────────┬─────────────┘
//               │ yes
//               ▼
// ┌───────────────────────────┐
// │ Push callback onto the    │
// │ Call Stack and execute    │
// └───────────────────────────┘

import fs from 'node:fs';
//
// fs.readFile('notes.txt','utf-8',(error,data)=>{
//     if(error){
//         console.error("Failed to read file : ",error.message );
//         return;
//     }
//     console.log(data);    
// });

// const content = 'This text will be written into the file.';

// fs.writeFile('notes.txt', content, 'utf-8', (error) => {
//     if (error) {
//         console.error('Failed to write file:', error.message);
//         return;
//     }

//     console.log('File written successfully.');
// });

// fs.appendFile('notes.txt', '\nThis is additional content.', 'utf-8', (error) => {
//     if (error) {
//         console.error('Failed to append to file:', error.message);
//         return;
//     }

//     console.log('Content appended successfully.');
// });


// //readFileSync

// try {
//     const data = fs.readFileSync('notes.txt', 'utf-8');
//     console.log(data);
// } catch (error) {
//     console.error('Failed to read file:', error.message);
// }


//writeFileSync
const content1 = 'This text will be written into the file.';

// try {
//     fs.writeFileSync('notes.txt', content1, 'utf-8');
//     console.log('File written successfully.');
// } catch (error) {
//     console.error('Failed to write file:', error.message);
// }

//appendFileSync
// const additionalContent = '\nThis is additional content.';

// try {
//     fs.appendFileSync('notes.txt', additionalContent, 'utf-8');
//     console.log('Content appended successfully.');
// } catch (error) {
//     console.error('Failed to append to file:', error.message);
// }


// //Using Promise

import fsPromises from 'node:fs/promises';

// Promise-based file reading
async function loadNotes() {
    try {
        const data = await fsPromises.readFile('notes.txt', 'utf-8');
        // return data;
        console.log(data);
    } catch (error) {
        console.error('Failed to load notes:', error.message);
        throw error;
    }
}

// loadNotes();

// async function displayNotes() {
//     try {
//         const notes = await loadNotes();
//         console.log(notes);
//     } catch (error) {
//         console.error('Unable to display notes.');
//     }
// }

// displayNotes();



// Write into a file
// async function writeNotes() {
//     try {
//         const content = 'Learn Node.js file handling';
//         await fsPromises.writeFile('notes.txt', content, 'utf-8');

//         console.log('Notes written successfully.');
//     } catch (error) {
//         console.error('Failed to write notes:', error.message);
//         throw error;
//     }
// }

// writeNotes();


// Append content to a file
async function appendNotes() {
    try {
        const content = '\nPractice Promise-based file operations';

        await fsPromises.appendFile('notes.txt', content, 'utf-8');

        console.log('Notes appended successfully.');
    } catch (error) {
        console.error('Failed to append notes:', error.message);
        throw error;
    }
}

// appendNotes();

import path from 'node:path';

const fileName = 'notes.txt';
const fullPath = path.join(process.cwd(), 'data', fileName);

console.log(path.extname(fileName)); // '.txt'
console.log(path.basename(fullPath)); // 'notes.txt'
console.log(path.dirname(fullPath)); // 'C:\SwabhavDrive\nodejs-nexsales\module-03_node_basics\data'

