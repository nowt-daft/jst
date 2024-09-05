import HTMLAPI from './api.js';
import Template from '../template.js';
import { footer_comment, header_comment } from "./comment.js";

/**
 * @callback MasterTemplateRenderer
 * @param    {string}  path    Template file for specific "page" or "content"
 * @param    {object}  model
 * @returns  {Promise<string>} The rendered file wrapped in the master template.
 */

export default class HTMLTemplate extends Template {
	/**
	 * @param {string}     template
	 * @param {...string}  params
	 */
	constructor(template, ...params) {
		super(template, ...params);
	}

	/**
	 * @param    {string}  path
	 * @param    {object}  model
	 * @returns  {Promise<string>}  The rendered template file using the provided model
	 */
	static async render(path, model) {
		return (
			header_comment(path, model) +
			await super.render(path, model) +
			footer_comment(path)
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
			return (
				await this.render(
					master_path,
					{
						...master_model,
						content: await api.render(path, model)
					},
					api
				)
			);
		}
	}

	static {
		this.configure({
			API: HTMLAPI,
			extension: ".html"
		});
	}
}

