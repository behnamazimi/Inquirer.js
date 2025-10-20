/**
 * Filter and validate progress example
 */

import inquirer from 'inquirer';

const questions = [
  {
    type: 'input' as const,
    name: 'api_key',
    message: 'Please enter a valid API key.',
    validate(input: string) {
      if (/([\da-f]{40})/g.test(input)) {
        return true;
      }

      throw new Error('Please provide a valid API key secret.');
    },
  },
];

void inquirer.prompt(questions).then((answers) => {
  console.log(JSON.stringify(answers, null, '  '));
});
