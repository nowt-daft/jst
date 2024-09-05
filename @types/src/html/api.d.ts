export default class HTMLAPI extends API {
    constructor(template_engine: any, model: any);
    /**
     * Encodes the given string (other types will be coerced into a string)
     * to be safely displayed as HTML.
     *
     * @param    {string}  x
     * @returns  {string}
     */
    encode: (x: string) => string;
    /**
     * Loop over some data and send that data as a model to the template file.
     *
     * @param    {Iterable}  iterable
     * @param    {Renderer}  template  path to template or renderer function
     * @param    {string}    left_wrap
     * @param    {string}    right_wrap
     * @returns  {Promise<string>}  Template rendered for each item
     */
    each(iterable: Iterable<any>, template: Renderer, left_wrap?: string, right_wrap?: string): Promise<string>;
    /**
     * @param   {Iterable} iterable Data to iterate over
     * @param   {Renderer} template Path to template or renderer function.
     * @param   {Renderer} empty_template Path to file or renderer function.
     * @param   {object} param2
     * @param   {string} [param2.tag="ul"] Tag that wraps the data list
     * @param   {string} [param2.item_tag="li"] Tag that wraps each item.
     * @returns {Promise<string>}
     */
    list(iterable: Iterable<any>, template: Renderer, empty_template: Renderer, { tag, item_tag }?: {
        tag?: string | undefined;
        item_tag?: string | undefined;
    }): Promise<string>;
}
export type Renderer = string | import("../template.js").TemplateRenderer;
import API from '../api.js';
