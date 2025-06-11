const fs = require('fs');

/**
 * Configuration class to manage key-value settings in a file using dictionary-kind-of logic.
 */
class Configuration {

    /**
     * Initializes the configuration system.
     * 
     * @constructor
     * @param {string} [filename='config.txt'] - The file where configurations are stored.
     */
    constructor(filename = 'config.txt') { // as filename should be passed as a parameter to the constructor.
        this.filename = filename;
        this.config = {};
        // this.load(); // Load existing config data if available will be added.
    }

    /**
     * Sets a key-value pair in the configuration.
     * 
     * @param {string} key - The setting name.
     * @param {string|number|boolean} value - The setting value.
     */
    set(key, value) {
        this.config[key] = value;
    }

    /**
     * Retrieves a value from the configuration.
     * 
     * @param {string} key - The setting name.
     * @returns {string|number|boolean|null} - The setting value, or null if the key is not found.
     */
    get(key) {
        return this.config[key] || null;
    }
    
    /**
    * Saves the current configuration to the file.
    */
    save() {
        try {
            const data = Object.entries(this.config)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');
            fs.writeFileSync(this.filename, data, 'utf8');
        } catch (err) {
            console.error("Error saving config file:", err);
        }
    }

    /**
     * Loads configuration data from the file.
     */
    load() {
        try {
            if (fs.existsSync(this.filename)) {
                const data = fs.readFileSync(this.filename, 'utf8');
                this.config = data
                    .split('\n') // Split files into lines.
                    .filter(line => line.includes('=')) // Filtering out bad lines.
                    .reduce((acc, line) => { // Get key-value pairs and turn them into objects.
                        const [key, value] = line.split('='); // Simple extraction of key-value pairs.
                        acc[key] = value;
                        return acc;
                    }, {});
            }
        } catch (err) {
            console.error("Error loading config file:", err);
        }
    }

    /**
     * Clears the current configuration and reloads it from the file.
     */
    reload() {
        this.config = {};
        this.load();
    }

    /**
     * Changes the configuration file and reloads settings.
     * 
     * @param {string} newFilename - The new file path to use for configurations.
     */
    setFilePath(newFilename) {
        this.filename = newFilename;
        this.load();
    }
    
}

module.exports = Configuration;
