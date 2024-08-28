export default read;
export type FileHandler = (path: string) => Promise<string>;
/**
 * @callback FileHandler
 * @param    {string}  path
 * @returns  {Promise<string>}
 */
/** @type {FileHandler} */
declare const read: FileHandler;
