import OrbitDB from 'orbit-db';

/**
 * OrbitDB data access object
 * @link https://github.com/haadcode/orbit-db
 */
class OrbitDAO {
    init(ipfsNode) {
        this.orbit = new OrbitDB(ipfsNode);
    }

    /**
     * You should not use this private method or this.orbit directly as well.
     * To interact with Orbit DB use put() and get() methods below.
     * @return {OrbitDB}
     * @private
     */
    _db() {
        if (!this.orbit) {
            throw new Error('Orbit is undefined. Please use init() to initialize it.');
        }
        return this.orbit;
    }

    /**
     * @return {Promise.<EventStore>} database log
     * @private
     */
    _log() {
        return new Promise(resolve => {
            const log = this._db().eventlog('ChronoMint.data');
            log.events.on('ready', () => resolve(log));
        });
    }

    /**
     * @param value that you want to put
     * @return {Promise.<String>} hash of added value
     */
    put(value) {
        return this._log().then(log => {
            return log.add(value);
        });
    }

    /**
     * @param hash
     * @return {Promise.<any|null>}
     */
    get(hash: string) {
        return this._log().then(log => {
            const value = log.get(hash);
            return value ? (value.hash === hash ? value.payload.value : null) : null;
        });
    }
}

export default new OrbitDAO();