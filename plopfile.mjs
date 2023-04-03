import * as ChangeCase from 'change-case';

export default function (
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
  plop.setHelper('camelCase', (txt) => ChangeCase.camelCase(txt));
  plop.setHelper('pascalCase', (txt) => ChangeCase.pascalCase(txt));
  plop.setHelper('snakeCase', (txt) => ChangeCase.snakeCase(txt));
  plop.setHelper('paramCase', (txt) => ChangeCase.paramCase(txt));
  plop.setHelper('constantCase', (txt) => ChangeCase.constantCase(txt));

  plop.setGenerator('resource', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "What's the resource name",
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'src/app/modules/{{ paramCase name }}',
        base: `templates/resource/module`,
        templateFiles: `templates/resource/module/**/*.hbs`,
        skipIfExists: true,
      },

      {
        type: 'addMany',
        destination: 'src/database/repositories/',
        base: `templates/resource/repositories`,
        templateFiles: `templates/resource/repositories/**/*.hbs`,
        skipIfExists: true,
      },

      {
        type: 'addMany',
        destination: 'src/database/entities/',
        base: `templates/resource/entities`,
        templateFiles: `templates/resource/entities/**/*.hbs`,
        skipIfExists: true,
      },
    ],
  });
}
