/**
 * @typedef {Record<string,any>|any[]} Iterable
 */
/**
 * @callback TemplateRenderer
 * @param    {object}  model
 * @returns  {Promise<string>} The rendered template using model data.
 */
/**
 * @callback MasterTemplateRenderer
 * @param    {string}  path    Template file for specific "page" or "content"
 * @param    {object}  model
 * @returns  {Promise<string>} The rendered file wrapped in the master template.
 */
/**
 * Template generates an ASYNCHRONOUS function.
 * The created function expects the params provided
 * in the constructor and returns a string.
 *
 * @class Template
 * @extends Function
 */
export default class Template extends Function {
    /**
     * @type {Record<string,TemplateRenderer>}
     */
    static cache: Record<string, TemplateRenderer>;
    static is_cache_enabled: boolean;
    static directory: string;
    static extension: string;
    static API: typeof API;
    /**
     * Set the configuration of the Template engine.
     *
     * @param {object}  param0
     * @param {class}   param0.API
     * @param {string}  [param0.directory=DOT]
     * @param {boolean} [param0.cache=false]
     * @param {string}  [param0.extension=".jst"]
     */
    static configure({ API, directory, cache, extension }: {
        API: class;
        directory?: string | undefined;
        cache?: boolean | undefined;
        extension?: string | undefined;
    }): typeof Template & {
        API: class;
        directory: string;
        cache: boolean;
        extension: string;
    };
    /**
     * @param    {string}  source  Template source string
     * @returns  {TemplateRenderer}
     */
    static create(source: string): TemplateRenderer;
    /**
     * @param    {string}  path  Path to a template file
     * @returns  {Promise<TemplateRenderer>}
     */
    static open(path: string): Promise<TemplateRenderer>;
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
    /**
     * @param    {string}     template  Template source string
     * @param    {...string}  params    Variables available to the template
     */
    constructor(template: string, ...params: string[]);
}
export type Iterable = Record<string, any> | any[];
export type TemplateRenderer = (model: object) => Promise<string>;
export type MasterTemplateRenderer = (path: string, model: object) => Promise<string>;
import API from './api.js';
