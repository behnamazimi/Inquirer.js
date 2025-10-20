/**
 * Raw List prompt example
 */

import inquirer from 'inquirer';

void inquirer
  // @ts-expect-error - TS has issues with inferring the correct type for arrays of questions
  .prompt([
    {
      type: 'rawlist' as const,
      name: 'theme',
      message: 'What do you want to do?',
      choices: [
        'Order a pizza',
        'Make a reservation',
        new inquirer.Separator(),
        'Ask opening hours',
        'Talk to the receptionist',
      ],
    },
    {
      type: 'rawlist' as const,
      name: 'size',
      message: 'What size do you need',
      choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
      filter(val: string) {
        return val.toLowerCase();
      },
    },
  ])
  .then((answers) => {
    console.log(JSON.stringify(answers, null, '  '));
  });
