export default class API {
    /**
     * @param    {class}   template_engine
     * @param    {string}  path
     * @param    {{}}      model
     */
    constructor(template_engine: class, path: string, model?: {});
    get path(): string;
    /**
     * Returns the value or an empty string if value is undefined or null.
     *
     * @param    {any}  x
     * @returns  {string|any}
     */
    assume: (x: any) => string | any;
    /**
     * Tests whether a given value exists (not undefined and not null)
     *
     * @param    {any}  x
     * @returns  {boolean}
     */
    exists: (x: any) => boolean;
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
    filter: <T extends Iterable<any>>(iterable: T, filter: (item: any, index: keyof T, iterable: T) => boolean) => T;
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
    map: <T extends Iterable<any>>(iterable: T, map: any) => T;
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
    loop({ iterable, template, left_wrap, right_wrap }: {
        iterable: Iterable<any>;
        template: string;
        left_wrap?: string | undefined;
        right_wrap?: string | undefined;
    }): Promise<string>;
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
    render(path: string, model?: object): Promise<string>;
    #private;
}
