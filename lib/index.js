/**
 * @typedef {Object} Itariri
 * @property {Function} set - Sets a value in the cache with an optional expiration time.
 * @property {Function} get - Retrieves a value from the cache.
 * @property {Function} remove - Removes a value from the cache.
 * @property {Function} keys - Retrieves an array of all keys in the cache.
 * @property {Function} size - Retrieves the current size of the cache.
 */

/**
 * Creates a new Itariri cache object.
 * @returns {Itariri} The Itariri cache object.
 */
export function Itariri() {
    const cache = Object.create(null);
    let size = 0;

    /**
     * Sets a value in the cache with an optional expiration time.
     * @param {string} key - The key for the value.
     * @param {*} value - The value to be stored.
     * @param {number} [time] - The expiration time in milliseconds.
     * @param {Function} [callback] - The callback function to be called when the value expires.
     * @returns {*} The stored value.
     */
    function set(key, value, time, callback){
        const existingData = cache[key];

        if (existingData) clearTimeout(existingData.timeout);
        if (!existingData) size++;

        const record = {
            value,
            timeout: null
        };

        if (!isNaN(time)) {
            record.timeout = setTimeout(() => {
                remove(key);
                if (callback) {
                    callback(key, value);
                }
            }, time);
        }

        cache[key] = record;

        return value;
    }

    /**
     * Removes a value from the cache.
     * @param {string} key - The key of the value to remove.
     * @returns {boolean} True if the value was successfully removed, false otherwise.
     */
    function remove(key) {
        const record = cache[key];

        if (record) {
            delete cache[key];
            size--;
            return true;
        }

        return false;
    }

    function get(key){
        return cache[key]?.value ?? cache[key] ?? null;
    }

    /**
     * Retrieves an array of all keys in the cache.
     * @returns {string[]} An array of keys in the cache.
     */ 
    function keys(){
        return Object.keys(cache);
    }

    /**
     * Retrieves the current size of the cache.
     * @returns {number} The size of the cache.
     */
    function getSize(){
        return size;
    }

    return {
        set,
        get,
        remove,
        keys,
        getSize
    };
}
