import API from './api.js';
import read from "./read.js";

const SLASH = '/';
const DOT = '.';

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
export default class Template extends
Object.getPrototypeOf(async function() {}).constructor {
	/**
	 * @param    {string}     template  Template source string
	 * @param    {...string}  params    Variables available to the template
	 */
	constructor(
		template,
		...params
	) {
		super(
			...params,
			`return \`${ template }\`;`
		);
	}

	/**
	 * @type {Record<string,TemplateRenderer>}
	 */
	static cache = {};
	static is_cache_enabled = false;
	static directory = DOT;
	static extension = ".jst";
	static API = API;
	
	/**
	 * Set the configuration of the Template engine.
	 * 
	 * @param {object}  param0
	 * @param {class}   param0.API
	 * @param {string}  [param0.directory=DOT]
	 * @param {boolean} [param0.cache=false]
	 * @param {string}  [param0.extension=".jst"]
	 */
	static configure({
		API,
		directory = this.directory,
		cache = this.cache,
		extension = this.extension
	}) {
		return Object.assign(
			this,
			{ API, directory, cache, extension }
		);
	}

	/**
	 * @param    {string}  source  Template source string
	 * @returns  {TemplateRenderer}
	 */
	static create(source) {
		return model =>
			new Template(
				source,
				...Object.keys(model)
			)(
				...Object.values(model)
			);
	}

	/**
	 * @param    {string}  path  Path to a template file
	 * @returns  {Promise<TemplateRenderer>}
	 */
	static async open(path) {
		if (this.cache[path])
			return this.cache[path];
		
		const source = await read(
			(path.startsWith(SLASH) ?
				path :
				`${this.directory}/${path}`
			) + this.extension
		);

		const renderer = this.create(source);

		return this.is_cache_enabled ?
			this.cache[path] = renderer :
			renderer;
	}

	/**
	 * @param    {string}  path
	 * @param    {object}  model
	 * @returns  {Promise<string>}  The rendered template file using the provided model
	 */
	static async render(path, model) {
		return await (await this.open(path))(
			{
				_: new this.API(this, path, model),
				...model
			}
		);
	}

	/**
	 * @param    {string}  master_path  Path to the master template file
	 * @param    {object}  globals      Any global variables accessible at all times.
	 * @returns  {MasterTemplateRenderer}
	 */
	static create_master(
		master_path,
		globals
	) {
		return async (
			path,
			model
		) => {
			const master_model = {
				...globals,
				item: model
			};
			const api = new this.API(this, master_path, master_model);
			return await this.render(
				master_path,
				{
					_: api,
					...master_model,
					content: await api.render(path, model)
				}
			);
		}
	}
}

