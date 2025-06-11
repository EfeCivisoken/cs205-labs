const fs = require('fs');

/**
 * A simple logger class that writes logging output to a file.
 */
class Log {

    /**
     * Initializes logging to a particular file, optionally asynchronously.
     * 
     * @constructor
     * @param filename - The file path/name to output to.
     * @param async - Whether to perform writes asynchronously. Default is false.
     */
    constructor(filename, async = false) {
        this.filename = filename;
        this.async = async;
    }

    /**
     * Writes a string to the log file, prepending a timestamp.
     * If async is set to true, the write will be asynchronous.
     * 
     * @param string - Output to be logged to the log file.
     * @returns this object for method chaining.
     */
    write(string) {
        // Write the string to the file
        const timeStamp = new Date().toISOString(); // Standardized Timestamp
        const strToWrite = "[" + timeStamp + "]\t" + string + "\n";

        if(this.async) {
            fs.appendFile(this.filename, strToWrite, this.asyncWriteCallback);
        } else {
            try {
                fs.appendFileSync(this.filename, strToWrite);
            } catch (err) {
                console.error("Error writing to log file:", err);
            }
        }
        return this;
    }

    /**
     * Callback function for asynchronous writes.
     * Console-logs an error message if an error occurs.
     * 
     * @param {Error|null} err - Error object if the write fails, otherwise null.
     */

    asyncWriteCallback(err) { // FIX (EFE): Made it public for now, because it cannot be accessed outside the class scope
        if (err) console.error("Error writing to log file:", err); // TODO: Error handling 
        // FIX (EFE): Instead of throwing errors in an async, I logged it into console as otherwise it would crash the program.
        //console.log("Logged successfully.");
    }
}

module.exports = Log;
