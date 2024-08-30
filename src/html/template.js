import HTMLAPI from './api.js';
import Template from '../template.js';

export default class HTMLTemplate extends Template {
	/**
	 * @param {string}     template
	 * @param {...string}  params
	 */
	constructor(template, ...params) {
		super(template, ...params);
	}

	static {
		this.configure({
			API: HTMLAPI,
			extension: ".html"
		});
	}
}

