import * as ChangeCase from 'change-case';

const timestamp = Date.now();

const GENERATOR_RESOURCE_TEMPLATE_PATH = 'templates/resource/src';
const GENERATOR_RESOURCE_DESTINATION_PATH = 'src';

export default function (
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
  plop.setHelper('camelCase', (txt) => ChangeCase.camelCase(txt));
  plop.setHelper('pascalCase', (txt) => ChangeCase.pascalCase(txt));
  plop.setHelper('snakeCase', (txt) => ChangeCase.snakeCase(txt));
  plop.setHelper('paramCase', (txt) => ChangeCase.paramCase(txt));
  plop.setHelper('constantCase', (txt) => ChangeCase.constantCase(txt));
  plop.setHelper('timestamp', () => String(timestamp));

  plop.setGenerator('resource', {
    description: 'application resource logic',

    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Resource name',
      },
    ],

    actions: [
      {
        type: 'addMany',
        base: `${GENERATOR_RESOURCE_TEMPLATE_PATH}`,
        templateFiles: `${GENERATOR_RESOURCE_TEMPLATE_PATH}/**/*.hbs`,
        destination: `${GENERATOR_RESOURCE_DESTINATION_PATH}/`,
        skipIfExists: true,
      },

      async (data) => {
        const path = await import('node:path');
        const recastMod = await import('recast');
        const magicastMod = await import('magicast');

        const b = recastMod.types.builders;

        const includeExportAllInFiles = [
          {
            target: 'domain/dtos/index.ts',
            fromPaths: [
              //
              './ICreate{{ pascalCase name }}Input',
              './IDelete{{ pascalCase name }}Input',
              './IFind{{ pascalCase name }}ByIdInput',
              './IUpdate{{ pascalCase name }}Input',
            ],
          },
          {
            target: 'domain/models/index.ts',
            fromPaths: [
              //
              './{{ snakeCase name }}.model',
            ],
          },
          {
            target: 'infrastructure/application/dtos/graphql/index.ts',
            fromPaths: [
              //
              './create_{{ snakeCase name }}_input.type',
              './delete_{{ snakeCase name }}_input.type',
              './find_{{ snakeCase name }}_by_id_input.type',
              './list_{{ snakeCase name }}_result.type',
              './update_{{ snakeCase name }}_input.type',
              './{{ snakeCase name }}.type',
            ],
          },
          {
            target: 'infrastructure/application/dtos/zod/index.ts',
            fromPaths: [
              //
              './create_{{ snakeCase name }}_input.zod',
              './delete_{{ snakeCase name }}_input.zod',
              './find_{{ snakeCase name }}_by_id_input.zod',
              './update_{{ snakeCase name }}_input.zod',
            ],
          },
        ];

        for (const includeExportAllInFile of includeExportAllInFiles) {
          const targetLocation = path.join(GENERATOR_RESOURCE_DESTINATION_PATH, includeExportAllInFile.target);

          const mod = await magicastMod.loadFile(targetLocation);

          for (const fromTemplatePath of includeExportAllInFile.fromPaths) {
            const fromPath = plop.renderString(fromTemplatePath, data);
            mod.$ast.body.unshift(b.exportAllDeclaration(b.literal(fromPath)));
          }

          await magicastMod.writeFile(mod, targetLocation);
        }
      },

      async (data) => {
        const path = await import('node:path');
        const fs = await import('node:fs/promises');

        // ...

        const appModulePath = path.join(GENERATOR_RESOURCE_DESTINATION_PATH, 'infrastructure/application/app.module.ts');
        const appModuleData = await fs.readFile(appModulePath, 'utf-8');

        //

        let updatedAppModuleData = appModuleData;

        //

        const importStatementTemplate =
          "import { {{ pascalCase name }}Module } from './resources/{{ paramCase name }}/{{ paramCase name }}.module';";
        const importStatement = plop.renderString(importStatementTemplate, data);

        updatedAppModuleData = `${importStatement}\n${updatedAppModuleData}`;

        //

        // // END APPLICATION RESOURCES

        const importApplicationResourceTemplate = '    {{ pascalCase name }}Module,\n\n    // END APPLICATION RESOURCES';
        const importApplicationResource = plop.renderString(importApplicationResourceTemplate, data);

        updatedAppModuleData = updatedAppModuleData.replace('    // END APPLICATION RESOURCES', importApplicationResource);

        //

        await fs.writeFile(appModulePath, updatedAppModuleData);
      },

      async (data) => {
        const path = await import('node:path');
        const fs = await import('node:fs/promises');

        // ...

        const appResourcesPath = path.join(GENERATOR_RESOURCE_DESTINATION_PATH, 'infrastructure/application/helpers/app-resources.ts');
        const appResourcesData = await fs.readFile(appResourcesPath, 'utf-8');

        //

        let updatedAppResourcesData = appResourcesData;

        //

        const importStatementTemplate =
          "import { {{ pascalCase name }}Resource } from '../resources/{{ paramCase name }}/{{ paramCase name }}.resource';";
        const importStatement = plop.renderString(importStatementTemplate, data);

        updatedAppResourcesData = `${importStatement}\n${updatedAppResourcesData}`;

        //

        const importApplicationResourceTemplate = '  {{ pascalCase name }}Resource,\n\n  // END APPLICATION RESOURCES';
        const importApplicationResource = plop.renderString(importApplicationResourceTemplate, data);

        updatedAppResourcesData = updatedAppResourcesData.replace('\n  // END APPLICATION RESOURCES', importApplicationResource);

        //

        await fs.writeFile(appResourcesPath, updatedAppResourcesData);
      },
    ],
  });
}
