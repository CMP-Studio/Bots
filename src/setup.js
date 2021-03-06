const fs = require('fs');
const path = require('path');
const menu = require('./menu');
const YAML = require('json2yaml');
const postbacks = require('./postbacks');
const _ = require('lodash');

const templateFileName = 'messenger.config.template.yml';
const botpressMessengerConfigName = 'botpress-messenger.config.yml';


const contentTemplateFileName = 'content.template.yml';
const botpressContentFileName = 'content.yml';

const messages = {
    greeting: "I'll be your guide to Summer Adventure at the Carnegie Museums of Pittsburgh. I'll help you earn stamps for visiting museums and attending special events. Each stamp increases your chance to win at the End-Of-Summer celebration."
}
// const botfile = require('../botfile');

async function setup() {
	const config = await require('./config');

	// Setup messenger configuration YML
	const menuYMLText = YAML.stringify(menu).replace('---\n', '');
	const messengerConfigVars = Object.assign({}, config, {
		greetingMessage: messages.greeting,
		menu: menuYMLText
	});
	templateYaml(
		path.join(__dirname, templateFileName),
		path.join(__dirname, '..', botpressMessengerConfigName),
		messengerConfigVars
	);
	
	// Setup content YML
	templateYaml(
		path.join(__dirname, contentTemplateFileName),
		path.join(__dirname, '..', botpressContentFileName),
		{
			postbacks: postbacks,
			staticUrl: config.staticUrl
		}
	);
}

function templateYaml(templateFilePath, targetFilePath, variables) {
	const templateFileContents = fs.readFileSync(templateFilePath);
	const ymlTemplate = _.template(templateFileContents);
	const str = ymlTemplate(variables);
	fs.writeFileSync(targetFilePath, str);
}

module.exports = setup;
