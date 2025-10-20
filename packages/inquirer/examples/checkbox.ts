/**
 * Checkbox list examples
 */

import inquirer from 'inquirer';

void inquirer
  // @ts-expect-error - TS has issues with inferring the correct type for arrays of questions
  .prompt([
    {
      type: 'checkbox' as const,
      message: 'Select toppings',
      name: 'toppings',
      choices: [
        new inquirer.Separator(' = The Meats = '),
        {
          name: 'Pepperoni',
        },
        {
          name: 'Ham',
        },
        {
          name: 'Ground Meat',
        },
        {
          name: 'Bacon',
        },
        new inquirer.Separator(' = The Cheeses = '),
        {
          name: 'Mozzarella',
          checked: true,
        },
        {
          name: 'Cheddar',
        },
        {
          name: 'Parmesan',
        },
        new inquirer.Separator(' = The usual ='),
        {
          name: 'Mushroom',
        },
        {
          name: 'Tomato',
        },
        new inquirer.Separator(' = The extras = '),
        {
          name: 'Pineapple',
        },
        {
          name: 'Olives',
          disabled: 'out of stock',
        },
        {
          name: 'Extra cheese',
        },
      ],
      validate(answer: string[]) {
        if (answer.length === 0) {
          return 'You must choose at least one topping.';
        }

        return true;
      },
    },
  ])
  .then((answers) => {
    console.log(JSON.stringify(answers, null, '  '));
  });
