export const emails = [
  {
    id: 1,
    subject: "Duplicate charge",
    body: `
I was charged twice for my subscription this month.
Please refund the duplicate charge.
    `,
    expected: "billing",
  },

  {
    id: 2,
    subject: "Cannot login",
    body: `
I reset my password but I still cannot login.
The website keeps showing invalid session.
    `,
    expected: "technical",
  },

  {
    id: 3,
    subject: "Enterprise pricing",
    body: `
We have around 500 employees.
Can someone send us enterprise pricing?
    `,
    expected: "sales",
  },

  {
    id: 4,
    subject: "Terrible support",
    body: `
I contacted support three times and nobody helped me.
This is extremely frustrating.
    `,
    expected: "complaint",
  },

  {
    id: 5,
    subject: "You won a prize",
    body: `
Congratulations!
Click this link immediately to claim your prize.
    `,
    expected: "spam",
  },

  {
    id: 6,
    subject: "Need help",
    body: `
I'm thinking about upgrading to enterprise,
but I also noticed an incorrect charge on my account.
Can someone contact me?
    `,
    expected: "billing",
  },

  {
    id: 7,
    subject: "Job application",
    body: `
I would like to apply for the backend engineer position.
My resume is attached.
    `,
    expected: "other",
  },
];