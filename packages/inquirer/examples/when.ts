/**
 * When example
 */

import inquirer from 'inquirer';

const questions = [
  {
    type: 'confirm' as const,
    name: 'bacon',
    message: 'Do you like bacon?',
  },
  {
    type: 'input' as const,
    name: 'favorite',
    message: 'Bacon lover, what is your favorite type of bacon?',
    when(answers: Record<string, unknown>) {
      return answers['bacon'] as boolean;
    },
  },
  {
    type: 'confirm' as const,
    name: 'pizza',
    message: 'Ok... Do you like pizza?',
    when(answers: Record<string, unknown>) {
      return !likesFood('bacon')(answers);
    },
  },
  {
    type: 'input' as const,
    name: 'favorite',
    message: 'Whew! What is your favorite type of pizza?',
    when: likesFood('pizza'),
  },
];

function likesFood(aFood: string) {
  return function (answers: Record<string, unknown>) {
    return answers[aFood] as boolean;
  };
}

void inquirer.prompt(questions).then((answers) => {
  console.log(JSON.stringify(answers, null, '  '));
});
