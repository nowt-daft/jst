/**
 * @callback MasterTemplateRenderer
 * @param    {string}  path    Template file for specific "page" or "content"
 * @param    {object}  model
 * @returns  {Promise<string>} The rendered file wrapped in the master template.
 */
export default class HTMLTemplate extends Template {
    /**
     * @param    {string}  path
     * @param    {object}  model
     * @returns  {Promise<string>}  The rendered template file using the provided model
     */
    static render(path: string, model: object): Promise<string>;
    /**
     * @param    {string}  master_path  Path to the master template file
     * @param    {object}  globals      Any global variables accessible at all times.
     * @returns  {MasterTemplateRenderer}
     */
    static create_master(master_path: string, globals: object): MasterTemplateRenderer;
}
export type MasterTemplateRenderer = (path: string, model: object) => Promise<string>;
import Template from '../template.js';
