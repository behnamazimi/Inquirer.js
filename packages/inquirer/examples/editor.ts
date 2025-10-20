/**
 * Editor prompt example
 */

import inquirer from 'inquirer';

const questions = [
  {
    type: 'editor' as const,
    name: 'bio',
    message: 'Please write a short bio of at least 3 lines.',
    validate(text: string) {
      if (text.split('\n').length < 3) {
        return 'Must be at least 3 lines.';
      }

      return true;
    },
    waitUserInput: true,
  },
  {
    type: 'editor' as const,
    name: 'edition',
    message: 'Edit the following content.',
    default: 'Hello, World!',
    waitUserInput: false,
  },
];

void inquirer.prompt(questions).then((answers) => {
  console.log(JSON.stringify(answers, null, '  '));
});
