import express from 'express';

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/users', async (req, res) => {
  const limit = +req.query.limit || 10;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
  );
  const users = await response.json();
  // const users = [
  //   {
  //     id: 1,
  //     name: 'Name1',
  //   },
  //   {
  //     id: 2,
  //     name: 'Name2',
  //   },
  //   {
  //     id: 3,
  //     name: 'Name3',
  //   },
  //   {
  //     id: 4,
  //     name: 'Name4',
  //   },
  // ];

  res.send(`
  <h1 class="text-2xl font-bold my-4">Users</h1>
  <ul>
    ${users.map((user) => `<li>${user.name}</li>`).join('')}
  </ul>
  `);
});

//Temp
app.post('/convert', (req, res) => {
  const fahrenheit = parseFloat(req.body.fahrenheit);
  const celsius = (fahrenheit - 32) * (5 / 9);
  res.send(`<p>${fahrenheit} F is equal to ${celsius.toFixed(2)} C</p>`);
});

let counter = 0;
//Poll
app.get('/poll', (req, res) => {
  counter++;
  const data = { value: counter };

  res.json(data);
});

let currTemp = 20;
//Weather
app.get('/get-temp', (req, res) => {
  currTemp += Math.random() * 2 - 1;
  res.send(currTemp.toFixed(1) + 'C');
});

const contacts = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Doe', email: 'jane@example.com' },
  { name: 'Alice Smith', email: 'alice@example.com' },
  { name: 'Bob Williams', email: 'bob@example.com' },
  { name: 'Mary Harris', email: 'mary@example.com' },
  { name: 'David Mitchell', email: 'david@example.com' },
];

//Search
app.post('/search', (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send(`<tr></tr>`);
  }

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  const searchResultsHTML = searchResults
    .map(
      (contact) =>
        `<tr>
    <td><div class=""my-4 p-2>${contact.name}</div></td>
    <td><div class=""my-4 p-2>${contact.email}</div></td>
    </tr>
    `
    )
    .join('');

  res.send(searchResultsHTML);
});

//Search Api
app.post('/search/api', async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send(`<tr></tr>`);
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const users = await response.json();

  const searchResults = users.filter((user) => {
    const name = user.name.toLowerCase();
    const email = user.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  const searchResultsHTML = searchResults
    .map(
      (user) =>
        `<tr>
    <td><div class=""my-4 p-2>${user.name}</div></td>
    <td><div class=""my-4 p-2>${user.email}</div></td>
    </tr>
    `
    )
    .join('');

  res.send(searchResultsHTML);
});

//Validation

app.post('/contact/email', (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const isValid = {
    message: 'Email is valid',
    class: 'text-green-700',
  };

  const isInvalid = {
    message: 'Email is invalid',
    class: 'text-red-700',
  };
  if (!emailRegex.test(submittedEmail)) {
    return res.send(`<div class="mb-4" hx-target="this" hx-swap="outerHTML">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
      >Email Address</label
    >
    <input
      name="email"
      hx-post="/contact/email"
      class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
      type="email"
      id="email"
      value=${submittedEmail}
      required
    />
    <div class="${isInvalid.class}">${isInvalid.message}</div>
  </div>`);
  } else {
    return res.send(`<div class="mb-4" hx-target="this" hx-swap="outerHTML">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
      >Email Address</label
    >
    <input
      name="email"
      hx-post="/contact/email"
      class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
      type="email"
      id="email"
      value=${submittedEmail}
      required
    />
    <div class="${isValid.class}">${isValid.message}</div>
  </div>`);
  }
});

app.listen(3000, () => {
  console.log('Server listening on 3000');
});
