import Template from "./template.js";

const SLASH = '/';
const DOT_SLASH = './';
const NEWLINE = '\n';

export default class API {
	#path;
	#model;

	get path() {
		return this.#path;
	}

	/**
	 * @param    {string}  path
	 * @param    {{}}      model
	 */
	constructor(
		path,
		model = {}
	) {
		this.#path = path.endsWith(SLASH) ? path.slice(0, -1) : path;
		this.#model = model;
	}
	/**
	 * Returns the value or an empty string if value is undefined or null.
	 *
	 * @param    {any}  x
	 * @returns  {string|any}
	 */
	assume = x => x ?? '';
	/**
	 * Tests whether a given value exists (not undefined and not null)
	 *
	 * @param    {any}  x
	 * @returns  {boolean}
	 */
	exists = x => x !== null && typeof x !== "undefined";
	/**
	 * Templating operations should be kept as DUMB as possible.
	 * HOWEVER, sometimes a simple filter for lists/objects is
	 * needed on the same data point in a single template file.
	 *
	 * @template {Iterable} T
	 * @param    {T}  iterable
	 * @param    {(item: any, index: keyof T, iterable: T) => boolean}  filter
	 * @returns  {T}
	 */
	filter = (
		iterable,
		filter
	) =>
		iterable instanceof Array ?
			iterable.filter(filter) :
			Object.fromEntries(
				Object
					.entries(iterable)
					.filter(
						([key, item]) => filter(item, key, iterable)
					)
			);
	/**
	 * Templating operations should be kept as DUMB as possible.
	 * HOWEVER, sometimes a simple map for lists/objects is
	 * needed to pass data around.
	 *
	 * @template {Iterable} T
	 * @param    {T}  iterable
	 * @param    {(item: any, index: keyof T, iterable: T) => boolean}  filter
	 * @returns  {T}
	 */
	map = (
		iterable,
		map
	) =>
		iterable instanceof Array ?
			iterable.map(map) :
			Object.fromEntries(
				Object
					.entries(iterable)
					.map(
						([key, item]) => map(item, key, iterable)
					)
			);
	/**
	 * Loop over some data and send that data as a model to the template file.
	 *
	 * @param    {object}    param0
	 * @param    {Iterable}  param0.iterable
	 * @param    {string}    param0.template
	 * @param    {string}    [param0.left_wrap]
	 * @param    {string}    [param0.right_wrap]
	 * @returns  {Promise<string>} Template rendered for each item
	 */
	async loop({
		iterable,
		template,
		left_wrap = "",
		right_wrap= ""
	}) {
		const renderer =
			await Template.open(
				this.#render_path(template)
			);

		/** @type {string[]} */
		const lines = [];
		for (const [index, item] of Object.entries(iterable)) {
			const model = { item, index };
			lines.push(
				`${
					left_wrap
				}${
					await renderer({
						_: new this.constructor(template, model),
						...model
					})
				}${
					right_wrap
				}`
			);
		}

		return lines.join(NEWLINE);
	};

	/**
	 * From within a Template, we might want to render a template
	 * from another file and pass in the necessary data.
	 *
	 * The first argument can be absolute, a template path, or
	 * relative to the current template.
	 *
	 * @param    {string}  path
	 * @param    {object}  model
	 * @returns  {Promise<string>}  The rendered template
	 */
	async render (
		path,
		model = {}
	) {
		return await Template.render(
			this.#render_path(path),
			{ parent: this.#model, item: model }
		);
	}

	#render_path(path) {
		return path.startsWith(DOT_SLASH) ?
			this.#path + path.slice(1) :
			path;
	}
}
