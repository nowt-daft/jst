import API from "./src/api.js";
import Template from "./src/template.js";

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

export class JST extends Template {
	static {
		this.API = API;
	}
}

class HTMLAPI extends API {
	constructor(
		path,
		model
	) {
		super(
			path,
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
	 * @param   {object}   param0
	 * @param   {Iterable} param0.iterable   Data to iterate over
	 * @param   {string}   param0.template   The template file for each item in the data
	 * @param   {string}  [param0.tag="ul"]  The default tag that wraps the data list
	 * @param   {string}  [param0.item_tag="li"]  The default tag that wraps each item.
	 * @param   {string}  [empty_text]  Text to display if iterable is empty
	 * @param   {string}  [empty_file]  Template to render if iterable is empty
	 * @param   {object}  [empty_model={}]  Any data to pass to the empty file
	 * @returns {string}
	 */
	async list({
		iterable,
		template,
		tag = "ul",
		item_tag = "li",
		empty_text = "",
		empty_file = "",
		empty_model = {},
	}) {
		if (Object.keys(iterable).length === 0) {
			if (empty_file)
				return await HTMLTemplate.render(empty_file, empty_model);
			return empty_text;
		}
		return `<${
			tag
		}>\n${
			await this.loop({
				iterable,
				template,
				left_wrap: `<${ item_tag }>\n`,
				right_wrap: `\n</${ closing_tag(item_tag) }>`
			})
		}\n</${
			closing_tag(tag)
		}>`;
	}
}

export class HTMLTemplate extends Template {
	constructor(...args) {
		super(...args);
	}

	static {
		this.configure({
			API: HTMLAPI,
			extension: ".html"
		});
	}
}
