/**
 * Nested Inquirer call
 */

import inquirer from 'inquirer';

void inquirer
  .prompt({
    // @ts-expect-error - TS has issues with inferring the correct type for single question prompts with 'list' type
    type: 'list' as const,
    name: 'chocolate',
    message: "What's your favorite chocolate?",
    choices: ['Mars', 'Oh Henry', 'Hershey'],
  })
  .then(() => {
    void inquirer.prompt({
      // @ts-expect-error - TS has issues with inferring the correct type for single question prompts with 'list' type
      type: 'list' as const,
      name: 'beverage',
      message: 'And your favorite beverage?',
      choices: ['Pepsi', 'Coke', '7up', 'Mountain Dew', 'Red Bull'],
    });
  });
