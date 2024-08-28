import { HTMLTemplate } from "../index.js";

HTMLTemplate.directory = "./views";

const website = HTMLTemplate.create_master(
	'master', { title: "WEBSITE" }
);

console.log(
	await website(
		'index',
		{
			title: "INDEX PAGE",
			intro: "This is the index page.  Hello to the world!",
			list: [
				"ITEM 1",
				"THE SECOND ITEM",
				"Item numero trois",
				"Fantastic Four"
			]
		}
	)
);
