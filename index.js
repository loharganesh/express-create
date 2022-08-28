#! /usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');
const ejs = require('ejs');

// Helpers
const { makeInitialUppercase } = require('./helpers/string');
const { DIR_ROUTES, DIR_MODELS } = require('./helpers/constants');

//
function generate(dir, file, content) {
    if (!fs.existsSync(`${dir}/${file}.js`)) {
        fs.mkdirSync(dir, {
            recursive: true,
        });
        fs.writeFileSync(`${dir}/${file}.js`, content, {
            recursive: true,
        });
    } else {
        console.log(`Directory already exists`);
    }
}

function main() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'endpoint',
                message: 'What is name of your api endpoint?',
            },
        ])
        .then((answers) => {
            const { endpoint } = answers;
            const modelName = makeInitialUppercase(endpoint);

            // Routes
            const routeTemplate = fs.readFileSync(
                `${__dirname}/ejs/route.ejs`,
                'utf-8'
            );
            const renderedRoute = ejs.render(routeTemplate, { modelName });

            // Controllers
            const controllerTemplate = fs.readFileSync(
                `${__dirname}/ejs/controller.ejs`,
                'utf-8'
            );
            const renderedController = ejs.render(controllerTemplate, {
                modelName,
            });

            // Model
            const modelTemplate = fs.readFileSync(
                `${__dirname}/ejs/model.ejs`,
                'utf-8'
            );
            const renderedModel = ejs.render(modelTemplate, {
                modelName,
            });

            generate(`${DIR_ROUTES}/${endpoint}`, 'index', renderedRoute);
            generate(`${DIR_MODELS}`, `${endpoint}`, renderedModel);
            generate(
                `${DIR_ROUTES}/${endpoint}`,
                `controllers`,
                renderedController
            );
        });
}

main();
