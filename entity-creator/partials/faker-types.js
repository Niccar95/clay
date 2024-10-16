{{#if restrictedValues}}
{{#if skipTSEnumGeneration}}
"{{@key}}": (fields?.{{@key}} || [{{#each restrictedValues}}'{{value}}'{{#unless @last}},{{/unless}}{{/each}}][faker.number.int({ min: 0, max: [{{#each restrictedValues}}'{{value}}'{{#unless @last}},{{/unless}}{{/each}}].length - 1 })]),
{{else}}
// @ts-ignore
"{{@key}}": (fields?.{{@key}} || [{{#each restrictedValues}}'{{value}}'{{#unless @last}},{{/unless}}{{/each}}][faker.number.int({ min: 0, max: [{{#each restrictedValues}}'{{value}}'{{#unless @last}},{{/unless}}{{/each}}].length - 1 })]) as Types.{{pascalCase @key}},
{{/if}}
{{else}}
{{~#switch type}}
    {{#case 'boolean' }}
        "{{@key}}": fields?.{{@key}} || faker.datatype.boolean(),
    {{/case}}
    {{#case 'email' }}
        "{{@key}}": fields?.{{@key}} || faker.internet.email(),
    {{/case}}
    {{#case 'date' }}
        "{{@key}}": fields?.{{@key}} || faker.date.between({ from: moment().subtract(5, 'years').toDate(), to: moment().add(5, 'years').toDate() }),
    {{/case}}
    {{#case 'datetime' }}
        "{{@key}}": fields?.{{@key}} || faker.date.between({ from: moment().subtract(5, 'years').toDate(), to: moment().add(5, 'years').toDate() }),
    {{/case}}
    {{#case 'deliveryDate' }}
        "{{@key}}": fields?.{{@key}} || faker.date.between({ from: moment().subtract(5, 'years').toDate(), to: moment().add(5, 'years').toDate() }),
    {{/case}}
    {{#case 'currency' }}
        "{{@key}}": fields?.{{@key}} || {{@key}}Array[Math.floor(Math.random() * {{@key}}Array.length)],
    {{/case}}
    {{#case 'money' }}
        "{{@key}}": fields?.{{@key}} || faker.number.int({
            min: 0,
            max: 9999,
            }),
    {{/case}}
    {{#case 'GTIN' }}
        "{{@key}}": fields?.{{@key}} || gtin13OrGln(),
    {{/case}}
    {{#case 'GLN' }}
        "{{@key}}": fields?.{{@key}} || gtin13OrGln(),
    {{/case}}
    {{#case 'enum' }}
        "{{@key}}": fields?.{{@key}} || {{@key}}Array[Math.floor(Math.random() * {{@key}}Array.length)],
    {{/case}}
    {{#case 'array' }}
        "{{@key}}": fields?.{{@key}} || [],
    {{/case}}
    {{#case 'object' 'navbarConfig' 'cartProgressBarsColors' 'intercomConfig' }}
        "{{@key}}": fields?.{{@key}} || undefined,
    {{/case}}
    {{#case 'labels' }}
        "{{@key}}": fields?.{{@key}} || [{id: faker.string.uuid(), name: faker.word.noun(), color: faker.color.human()}, {id: faker.string.uuid(), name: faker.word.noun(), color: faker.color.human()}, {id: faker.string.uuid(), name: faker.word.noun(), color: faker.color.human()}],
    {{/case}}
    {{#case 'openingHours' }}
        "{{@key}}": fields?.{{@key}} || {monday: faker.string.alpha(10), tuesday: faker.string.alpha(10), wednesday: faker.string.alpha(10), thursday: faker.string.alpha(10), friday: faker.string.alpha(10), saturday: faker.string.alpha(10), sunday: faker.string.alpha(10)},
    {{/case}}
    {{#case 'regionSpecifics' }}
        "{{@key}}": fields?.{{@key}} || {},
    {{/case}}
    {{#case 'attachments' }}
        "{{@key}}": fields?.{{@key}} || {},
    {{/case}}
    {{#case 'querySpecification' }}
        "{{@key}}": fields?.{{@key}} || {},
    {{/case}}
    {{#case 'articleFilterPanelConfig' }}
        "{{@key}}": fields?.{{@key}} || {},
    {{/case}}
    {{#case 'string' }}
        "{{@key}}": fields?.{{@key}} || {{#if pattern}}faker.helpers.fromRegExp("{{pattern}}"){{else}}faker.string.alpha({ length: { min: {{#if min_length}}{{min_length}}{{else}}1{{/if}}, max: {{#if max_length}}{{max_length}}-1{{else}}10{{/if}} } }){{/if}},
    {{/case}}
    {{#case 'password' }}
        "{{@key}}": fields?.{{@key}} || faker.internet.password(),
    {{/case}}
    {{#case 'stringArray' }}
        "{{@key}}": fields?.{{@key}} || [faker.string.alpha(10), faker.string.alpha(10), faker.string.alpha(10)],
    {{/case}}
    {{#case 'pipeString' }}
        "{{@key}}": fields?.{{@key}} || faker.string.alpha(10) + "|" + faker.string.alpha(10),
    {{/case}}
    {{#case 'text' }}
        "{{@key}}": fields?.{{@key}} || faker.lorem.text(),
    {{/case}}
    {{#case 'markdown' }}
        "{{@key}}": fields?.{{@key}} || faker.lorem.text(),
    {{/case}}
    {{#case 'html'}}
        "{{@key}}": fields?.{{@key}} || faker.lorem.text(),
    {{/case}}
    {{#case 'htmlTextArea'}}
        "{{@key}}": fields?.{{@key}} || faker.lorem.text(),
    {{/case}}
    {{#case 'croppedS3image' }}
        "{{@key}}": fields?.{{@key}} || faker.image.url(),
    {{/case}}
    {{#case 'avatar' }}
        "{{@key}}": fields?.{{@key}} || faker.image.url(),
    {{/case}}
    {{#case 'imageArray' }}
        "{{@key}}": fields?.{{@key}} || [faker.image.url(), faker.image.url()],
    {{/case}}
    {{#case 'number' }}
        "{{@key}}": fields?.{{@key}} || faker.number.int({
            min: {{#if min_length}}Number({{min_length}}){{else}}0{{/if}},
            max: {{#if max_length}}Number({{max_length}}){{else}}999{{/if}},
            }),
    {{/case}}
    {{#case 'integer' }}
        "{{@key}}": fields?.{{@key}} || faker.number.int({
            min: {{#if min_length}}Number({{min_length}}){{else}}0{{/if}},
            max: {{#if max_length}}Number({{max_length}}){{else}}999{{/if}},
            }),
    {{/case}}
    {{#case 'taxNumber' }}
        "{{@key}}": fields?.{{@key}} || faker.string.numeric(13),
    {{/case}}
    {{#case 'relation' }}
        "{{camelCase @key}}": fields?.{{camelCase @key}} || {{camelCase parent}}.{{camelCase relation}}.minimalEntity().entity,
    {{/case}}
    {{#case 'reference' }}
        "{{@key}}": fields?.{{@key}} || (() => {throw new Error("You must provide a reference for {{@key}}")})(),
    {{/case}}
    {{#case 'userAccessString' }}
        "{{@key}}": fields?.{{@key}} || faker.string.uuid(),
    {{/case}}
    {{#default}}
        "{{@key}}": "type är {{type}}",
    {{/default}}
{{/switch}}{{/if}}