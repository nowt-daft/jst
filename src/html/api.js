import API from '../api.js';
import { header_comment, footer_comment } from "./comment.js";

/**
 * @typedef {string|import("../template.js").TemplateRenderer} Renderer
 */

const CHARS_MATCH = /[<>"'\r\n&]/g;
const CHARS_ENCODE = {
	'<': 'lt',
	'>': 'gt',
	'"': 'quot',
	'\'': 'apos',
	'&': 'amp',
	'\r': '#10',
	'\n': '#13'
};

const closing_tag = tag => {
	const index = tag.indexOf(' ');
	return tag.slice(0, index > 0 ? index : undefined);
}

export default class HTMLAPI extends API {
	constructor(
		template_engine,
		model
	) {
		super(
			template_engine,
			model
		);
	}
	/**
	 * Encodes the given string (other types will be coerced into a string)
	 * to be safely displayed as HTML.
	 *
	 * @param    {string}  x
	 * @returns  {string}
	 */
	encode = x =>
		String(x).replace(
			CHARS_MATCH,
			x => `&${CHARS_ENCODE[x]};`
		);
	/**
	 * Loop over some data and send that data as a model to the template file.
	 *
	 * @param    {Iterable}  iterable
	 * @param    {Renderer}  template  path to template or renderer function
	 * @param    {string}    left_wrap
	 * @param    {string}    right_wrap
	 * @returns  {Promise<string>}  Template rendered for each item
	 */
	async each(
		iterable,
		template,
		left_wrap = "",
		right_wrap= ""
	) {
		return (
			header_comment(template, iterable) +
			await super.each(iterable, template, left_wrap, right_wrap) +
			footer_comment(template)
		);
	}
	/**
	 * @param   {Iterable} iterable Data to iterate over
	 * @param   {Renderer} template Path to template or renderer function.
	 * @param   {Renderer} empty_template Path to file or renderer function.
	 * @param   {object} param2
	 * @param   {string} [param2.tag="ul"] Tag that wraps the data list
	 * @param   {string} [param2.item_tag="li"] Tag that wraps each item.
	 * @returns {Promise<string>}
	 */
	async list(
		iterable,
		template,
		empty_template,
		{
			tag = "ul",
			item_tag = "li"
		} = {}
	) {
		if (Object.keys(iterable).length === 0) {
			if (empty_template)
				return typeof empty_template === "function" ?
					await empty_template({}) :
					await this.engine.render(empty_template, {})
			return "";
		}
		return `\n\n<${
			tag
		}>\n${
			await this.each(
				iterable,
				template,
				`<${ item_tag }>`,
				`</${ closing_tag(item_tag) }>`
			)
		}</${
			closing_tag(tag)
		}>\n\n`;
	}
}

