#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from "figlet";
import { exec } from "child_process";

console.log(
  chalk.yellow(figlet.textSync("Ila21 CLI", { horizontalLayout: "full" }))
);

program.version("1.0.0").description("My Node CLI");

program.action(async () => {
  try {
    // Ask for the user's name
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What's your name?",
      },
    ]);

    console.log(chalk.green(`Hey there, ${name}!`));

    // Ask user to select a language/framework
    let selectedLanguage = [];
    let addMore = true;

    while (addMore) {
      const { language } = await inquirer.prompt([
        {
          type: "list",
          name: "language",
          message: "Select a language/Library/Framework:",
          choices: [
            { name: "Angular", value: "Angular" },
            { name: "React", value: "React" },
            { name: "Vue", value: "Vue" },
            { name: "C#", value: "C#" },
            { name: "PHP", value: "PHP" },
            { name: "Java", value: "Java" },
            new inquirer.Separator(),
            { name: "GO", value: "GO", disabled: true },
            {
              name: "Laravel",
              value: "Laravel",
              disabled: "(Laravel is not available)",
            },
          ],
        },
      ]);

      selectedLanguage.push(language);

      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "Do you want to select another language/Library/Framework?",
          default: false,
        },
      ]);

      addMore = confirm;
    }

    console.log("Raw selected values:", selectedLanguage);

    // Ensure selected values are not empty
    if (selectedLanguage.length > 0) {
      console.log(chalk.blue(`You selected: ${selectedLanguage.join(", ")}`));

      // If Angular is selected, create a new Angular project
      if (selectedLanguage.includes("Angular")) {
        const { projectName } = await inquirer.prompt([
          {
            type: "input",
            name: "projectName",
            message: "Enter the Angular project name:",
          },
        ]);

        console.log(chalk.green(`Creating Angular project: ${projectName}`));

        // Run Angular CLI command
        const createProject = exec(`ng new ${projectName} --style=scss --routing`);

        createProject.stdout.on("data", (data) => {
          console.log(chalk.blue(data));
        });

        createProject.stderr.on("data", (data) => {
          console.error(chalk.red(data));
        });

        createProject.on("close", (code) => {
          if (code === 0) {
            console.log(chalk.green("Angular project created successfully!"));
          } else {
            console.log(chalk.red("Failed to create the project."));
          }
        });
      }
    } else {
      console.log(chalk.red("No language/library/framework was selected."));
    }
  } catch (error) {
    console.error(chalk.red("An error occurred:", error));
  }
});

program.parse(process.argv);