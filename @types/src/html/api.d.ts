export default class HTMLAPI extends API {
    constructor(template_engine: any, path: any, model: any);
    /**
     * Encodes the given string (other types will be coerced into a string)
     * to be safely displayed as HTML.
     *
     * @param    {string}  x
     * @returns  {string}
     */
    encode: (x: string) => string;
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
    list({ iterable, template, tag, item_tag, empty_text, empty_file, empty_model, }: {
        iterable: Iterable<any>;
        template: string;
        tag?: string | undefined;
        item_tag?: string | undefined;
    }): string;
}
import API from '../api.js';
