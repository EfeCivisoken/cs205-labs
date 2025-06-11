const Log = require('./tools/log');
const Configuration = require('./tools/config'); // Added configuration requirement of course.

// Initialized logging module.
const logger = new Log('mylog.txt');

// Demonstrate synchronous logging with method chaining
logger.write('Application started') // Logs synchronously by default
      .write('Another log entry'); // Method chaining

// Demonstrate asynchronous logging.
const asyncLogger = new Log('mylog.txt', true);
asyncLogger.write('This log entry is written asynchronously');

// Demonstrate synchronous log write after async
logger.write("This text might appear before the asynchronous text");

// Initialize configuration module
const config = new Configuration();

// Set configuration settings
config.set('theme', 'dark');
config.set('fontSize', 17);

// Save the configuration settings to the file.
config.save();

// Retrieve and print stored configurations
console.log('Theme:', config.get('theme'));
console.log('Font Size:', config.get('fontSize'));

// Reload configuration to demonstrate persistence and proper functionality.
config.reload();
console.log('Reloaded Theme:', config.get('theme'));
console.log('Reloaded Font Size:', config.get('fontSize'));
