const CHARS = '-'.repeat(75);
const TAB = '  ';

const IGNORE = ['_', 'content', 'parent'];
const indent = level => TAB.repeat(level);

const render_array = (
	rry,
	level = 1
) =>
	`[\n${
		rry
		.map(
			x =>
				indent(level + 1) +
				render(x, level + 1)
		)
		.join(',\n')
	}\n${
		indent(level)
	}]`;

const render_object = (
	obj,
	level = 1,
	delim = ': '
) =>
	`{\n${
		Object
			.entries(obj)
			.filter(
				([k]) => !IGNORE.includes(k)
			)
			.map(
				([k, x]) =>
					`${ indent(level + 1) }${ k }${ delim }${ render(x, level + 1) }`
			)
			.join(',\n')
	}\n${
		indent(level)
	}}`;

const render = (
	value,
	level = 1
) => {
	if (value instanceof Array)
		return render_array(value, level);
	
	if (value instanceof Set)
		return `Set (${ value.size })` +
			render_array([...value], level);

	if (value instanceof Map)
		return `Map (${ value.size })` +
			render_object(
				Object.fromEntries([...value]),
				level,
				' => '
			);
	
	if (value instanceof Date)
		return `Date [${ value.toLocaleString() }]`;
	
	if (typeof value === "function")
		return value.prototype ? value.name : "function";

	if (typeof value === "string" || value instanceof String)
		return `"${ value.toString() }"`;
	
	if (value instanceof Object)
		return (
			value.constructor === Object ?
				"" :
			value.constructor.name + " "
		) +
		render_object(value, level);

	return `${ value }`;
}

/**
 * @param    {string|function}  renderer
 * @param    {object}  model
 * @returns  {string}
 */
export const header_comment = (
	renderer,
	model
) =>
	`<!--${
		CHARS
	}\n<template ${
		typeof renderer === "function" ?
			`${ renderer.name ?? '' }({ item, index }): string` :
			`file="${ renderer }.html"`
	}\n${
		TAB
	}${
		render(model)
	}\n>\n${
		CHARS
	}--->\n`;

export const footer_comment = renderer =>
	`<!--${ CHARS }\n</template done="true" ${
		typeof renderer === "function" ?
			`${ renderer.name ?? '' }` :
			`file="${ renderer }.html"`
	}>\n${ CHARS }--->\n`;
