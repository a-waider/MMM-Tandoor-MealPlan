# MMM-Tandoor-MealPlan

*MMM-Tandoor-MealPlan* is a module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) that fetches and displays the mealplan from the [Tandoor](https://github.com/TandoorRecipes/recipes) API.

## Screenshot

![Example of MMM-Tandoor-MealPlan](./example_1.png)

## Installation

### Install

In your terminal, go to the modules directory and clone the repository:

```bash
cd ~/MagicMirror/modules
git clone [https://github.local.haus/a-waider/MMM-Tandoor-MealPlan
```

### Update

Go to the module directory and pull the latest changes:

```bash
cd ~/MagicMirror/modules/MMM-Tandoor-MealPlan
git pull
```

## Configuration

To use this module, you have to add a configuration object to the modules array in the `config/config.js` file.

### Example configuration

Minimal configuration to use the module:

```js
    {
        module: 'MMM-Tandoor-MealPlan',
        position: 'lower_third',
        config: {
            url: "https://app.tandoor.dev",
            token: "",
        }
    },
```

Configuration with all options:

```js
    {
        module: 'MMM-Tandoor-MealPlan',
        position: 'lower_third',
        config: {
            url: "https://app.tandoor.dev",
            token: "",
        }
    },
```

### Configuration options

Option|Possible values|Default|Description
------|------|------|-----------
`url`|`string`|https://app.tandoor.dev|The URL under which the Tandoor instance is accessible
`token`|`string`|undefined|The token to authenticate to Tandoor. Can be generated at https://app.tandoor.dev/settings/api or your custom instance.

## Developer commands

- `npm install` - Install devDependencies like ESLint.
- `node --run lint` - Run linting and formatter checks.
- `node --run lint:fix` - Fix linting and formatter issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Changelog

All notable changes to this project will be documented in the [CHANGELOG.md](CHANGELOG.md) file.
