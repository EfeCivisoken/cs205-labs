[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/j9_TAGHo)

# Lab 4

## Organization

``` tree
lab4-iviskena_frestoj
├── README.md
│   ╰╶ This file; general information about the repo 
├── index.js
│   ╰╶ Main js file that demonstrates usage of the tools/ modules
├── mylog.txt
│   ╰╶ Generated log file demonstrating logger functionality
├── package.json
│   ╰╶ Information about this node.js project 
└── tools
    │╰╶ Core tools modules 
    ├── config.js
    │   ╰╶ Module for basic configuration engine
    └── log.js
        ╰╶ Module for basic logging needs
```

## Tool Modules

This repo contains two modules to be used as generic core utilities:

### config.js

A basic configuration module.

Example usage:

``` javascript
const Configuration = require('./tools/config');
const config = new Configuration();
config.set('theme', 'dark');
config.set('fontSize', 14);
config.save(); // Write the current configurations to the file
console.log('Theme:', config.get('theme'));
console.log('Font Size:', config.get('fontSize'));
```

### log.js

A basic logging module.

Example usage:

``` javascript
const Log = require('./tools/log');
const logger = new Log('mylog.txt');
logger.write('Application started') // Logs synchronously by default
.write('Another log entry'); // Method chaining
const asyncLogger = new Log('mylog.txt', true);
asyncLogger.write('This log entry is written asynchronously');
logger.write("This text might appear before the asynchronous text");
```

## Checklist

- [x] Create README
- [x] Implement synchronous logging
- [x] Asynchronous logging
- [x] Error handling in logging
- [x] Config, storing to a dictionary
- [X] Config with file storage

## Distribution of Work

The logging module was mostly written by Joseph, and the config module was mostly written by Efe,
though both were involved in each part as well as discussions of an implementation plan during lab.
