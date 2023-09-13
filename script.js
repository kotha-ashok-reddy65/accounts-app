"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
let containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//creating DOM
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  // const type=mov
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
   
    <div class="movements__value">${mov}€</div>
  </div>        
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
displayMovements(account1.movements);
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
//calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc1) {
  const balIn = acc1.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${balIn}€`;
  const balOu = acc1.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(balOu)}€`;
  const interest = acc1.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc1.interestRate) / 100)
    .filter(
      (int, i, arr) =>
        // console.log(arr);
        int > 0
    )
    .reduce((acc, cur, arr) => acc + cur, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}€`;
};

const updateUI = function (acc) {
  displayMovements(acc.movements);
  //dispaly balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};
// calcDisplaySummary(account1.movements);
const userNames = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

userNames(accounts);
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log("LOG IN");
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  //console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log("hello");
    //display ui and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    //display movements
    updateUI(currentAccount);
  }
});

//transfer

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reveiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  //console.log(amount, reveiverAcc);
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    reveiverAcc &&
    reveiverAcc?.username !== currentAccount.username
  ) {
    //transfer
    currentAccount.movements.push(-amount);
    reveiverAcc.movements.push(amount);
    //console.log("transfer valid!");
    updateUI(currentAccount);
  }
});
//some method ....requesloan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//console.log(accounts);
//console.log(userName);
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const account = accounts.find((acc) => acc.owner === "Jessica Davis");
// console.log(account);

//find method ...which is used retrieve one element from the array based some condition..
//findindex method is to get the current index val of array
//The findIndex() method of Array instances returns the index of the first element in an array that satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned.

//filter:its returns all the elemetns that matches the condition...find only return one element which matches comd
//filter method returns new array...find return one ele it self .,not an array
//reduce method

//const balance = movements.reduce((acc, cur) => acc + cur, 0);
//console.log(balance);

// const depositArr = movements.filter((mov) => {
//   return mov > 0;
// });
// console.log(depositArr);

// const depoArr = [];

// for (const mov of movements) {
//   if (mov > 0) depoArr.push(mov);
// }
// console.log(depoArr);
// const withdrewlArr = movements.filter((mov) => {
//   return mov < 0;
// });
// console.log(withdrewlArr);

//const euroToUSD = 1.1;

// const movementsUSD = movements.map((mov) => {
//   return mov * euroToUSD;
// });
// console.log(movements);
// console.log(movementsUSD);
// const movementsUSD = movements.map((mov) => mov * euroToUSD);
// console.log(movements);
// console.log(movementsUSD);

// /////////////////////////////////////////////////

// const arr = [];

// for (const mov of movements) {
//   arr.push(mov * euroToUSD);
// }
// console.log(arr);

// const movementsDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1} : You ${mov > 0 ? "deposited" : "withdrew"} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescription);
//
//Maxi value

// const max = movements.reduce((acc, cur) => {
//   if (acc < cur) return acc;
//   else return cur;
// }, movements[0]);
// console.log(max);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
//includes is like a Equality Check ...returns true or false
console.log(movements.includes(-130));

//findindex is like includes ,but it checks condition and returns true or fals

const anyDeposits = movements.some((mov) => mov > 0);
console.log(anyDeposits);
//
//every method returns true if all elemts satisfies condition else false
console.log(movements.every((mov) => mov > 0));
console.log(account4.movements.every((mov) => mov > 0));
//
//sorting
//sort works only on strings
const arr = ["jonas", "samrio", "kamil", "refi"];
console.log(arr.sort());

//on numbers
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
console.log(movements);

movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(movements);
movements.sort((a, b) => a - b);
console.log(movements);
movements.sort((a, b) => b - a);
console.log(movements);
