const users = [
  {
    id: 1,
    name: 'nik'
  },
  {
    id: 2,
    name: 'petr'
  }
];
/*=>
  [
    '1: nik',
    '2: petr'
  ]
*/

// 1 Способ
// const usersAsString = [];

// for (let i = 0; i < users.length; i++) {
//   const user = users[i];

//   usersAsString.push(user.id + ': ' + user.name);
// };

// console.log(usersAsString);

// Задачи из массива А, сделать массив Б

// 2 Способ

// - Проходит по массиву users циклом
// - Позволяет получить новый массив через return

const usersAsString = users.map(user => {
  return `${user.id}: ${user.name}`;
  // return user.id + ': ' + user.name;
});

console.log(usersAsString);

function map(users, predicate) {
  const usersAsString = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    usersAsString.push(predicate(user));
  };

  return usersAsString;
} 
