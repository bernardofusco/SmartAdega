/**
 * @typedef {Object} Wine
 * @property {string} id
 * @property {string} name
 * @property {string} grape
 * @property {string} region
 * @property {number} year
 * @property {number} price
 * @property {number} rating
 * @property {number} quantity
 * @property {string} user_id
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} WineInput
 * @property {string} name
 * @property {string} grape
 * @property {string} region
 * @property {number} year
 * @property {number} price
 * @property {number} rating
 * @property {number} quantity
 */

/**
 * @typedef {Partial<WineInput>} WineUpdate
 */

/**
 * @typedef {Object} ApiError
 * @property {string} error
 * @property {string} [details]
 */

/**
 * @typedef {Object} Toast
 * @property {number} id
 * @property {string} message
 * @property {'success'|'error'|'info'} type
 */

export {}

