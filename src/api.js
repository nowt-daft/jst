const NEWLINE = '\n';

/**
 * @typedef {import("./template.js").default} Template
 */
/**
 * @typedef {import("./template.js").Iterable} Iterable
 */
/**
 * @typedef {string|import("./template.js").TemplateRenderer} Renderer
 */

export default class API {
	/** @type {new => Template} */
	#engine;
	#model;

	get engine() {
		return this.#engine;
	}

	/**
	 * @param    {class}   template_engine 
	 * @param    {string}  path
	 * @param    {{}}      model
	 */
	constructor(
		template_engine,
		model = {},
	) {
		this.#engine = template_engine;
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
		/** @type {Renderer} */
		const renderer =
			typeof template === "function" ?
				template :
				await this.#engine.open(template);

		/** @type {string[]} */
		const lines = [];
		for (const [index, item] of Object.entries(iterable)) {
			const model = { item, index };
			lines.push(
				`${
					left_wrap
				}${
					await renderer({
						_: new this.constructor(
							this.#engine,
							model
						),
						...model
					})
				}${
					right_wrap
				}`
			);
		}

		return lines.join(NEWLINE) + NEWLINE;
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
	async render(
		path,
		model = {}
	) {
		const item_model = { parent: this.#model, item: model };
		return await this.#engine.render(
			path,
			item_model
		);
	}
}
