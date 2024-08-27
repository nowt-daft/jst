/**
 * @callback FileHandler
 * @param    {string}  path
 * @returns  {Promise<string>}
 */

/** @type {FileHandler} */
const read = globalThis.requestAnimationFrame ?
	async path => await (await fetch(path)).text() :
	async path => await Bun.file(path).text();

export default read;

