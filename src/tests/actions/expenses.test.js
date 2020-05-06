import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  startAddExpense,
  addExpense,
  removeExpense,
  editExpense,
  setExpenses,
  startSetExpenses,
  startRemoveExpense,
  startEditExpense,
} from "../../actions/expenses";
import expenses from "../fixtures/expenses";
import database from "../../firebase/firebase";

const uid = "thisismytestuid";
const defaultAuthState = { auth: { uid } };
const createMockStore = configureMockStore([thunk]);

beforeEach(async () => {
  let expensesData = {};
  expenses.forEach(({ id, description, note, amount, createdAt }) => {
    expensesData = {
      ...expensesData,
      [id]: { description, note, amount, createdAt },
    };
    // expensesData[id] = { description, note, amount, createdAt };
  });
  await database.ref(`users/${uid}/expenses`).set(expensesData);
});

test("should setup edit expense action object", () => {
  const action = editExpense("123abc", {
    note: "New note value",
  });
  expect(action).toEqual({
    type: "EDIT_EXPENSE",
    id: "123abc",
    updates: {
      note: "New note value",
    },
  });
});

test("should setup add expense action object with provided value", () => {
  const action = addExpense(expenses[2]);
  expect(action).toEqual({
    type: "ADD_EXPENSE",
    expense: expenses[2],
  });
});

test("should add expense to database and store", async () => {
  const store = createMockStore(defaultAuthState);
  const expenseData = {
    description: "Mouse",
    amount: 3000,
    note: "This one is better",
    createdAt: 1000,
  };

  try {
    await store.dispatch(startAddExpense(expenseData));

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: "ADD_EXPENSE",
      expense: {
        id: expect.any(String),
        ...expenseData,
      },
    });

    const snapshot = await database
      .ref(`users/${uid}/expenses/${actions[0].expense.id}`)
      .once("value");
    // console.log(snapshot.val());

    expect(snapshot.val()).toEqual(expenseData);
  } catch (e) {
    // console.log(e);
    throw e;
  }

  // .then(() => {
  // const actions = store.getActions();
  // expect(actions[0]).toEqual({
  //   type: "ADD_EXPENSE",
  //   expense: {
  //     id: expect.any(String),
  //     ...expenseData,
  //   },
  // });
  // return database.ref(`expenses/${cation[0].expense.id}`).once("value");
  // });
  // .then(snapshot => {
  //   expect(snapshot.val()).toEqual(expenseData);
  // done();
  // });
});

test("should add expense with defaults to database and store", async () => {
  const store = createMockStore(defaultAuthState);
  const expenseDefault = {
    description: "",
    amount: 0,
    note: "",
    createdAt: 0,
  };

  try {
    await store.dispatch(startAddExpense());

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: "ADD_EXPENSE",
      expense: {
        id: expect.any(String),
        ...expenseDefault,
      },
    });

    const snapshot = await database
      .ref(`users/${uid}/expenses/${actions[0].expense.id}`)
      .once("value");
    // console.log(snapshot.val());

    expect(snapshot.val()).toEqual(expenseDefault);
  } catch (e) {
    // console.log(e);
    throw e;
  }
});

// test("should setup add expense action object with default values", () => {
//   const action = addExpense();
//   expect(action).toEqual({
//     type: "ADD_EXPENSE",
//     expense: {
//       description: "",
//       note: "",
//       amount: 0,
//       createdAt: 0,
//       id: expect.any(String),
//     },
//   });
// });

test("should setup set expense action object with data", () => {
  const action = setExpenses(expenses);
  expect(action).toEqual({
    type: "SET_EXPENSES",
    expenses,
  });
});

test("should fetch the expenses from firebase", async () => {
  const store = createMockStore(defaultAuthState);
  const result = await store.dispatch(startSetExpenses());
  const actions = store.getActions();
  expect(actions[0]).toEqual({
    type: "SET_EXPENSES",
    expenses,
  });
});

test("should setup remove expense action object", () => {
  const action = removeExpense({ id: "123abc" });
  expect(action).toEqual({
    type: "REMOVE_EXPENSE",
    id: "123abc",
  });
});

test("should remove expense from firebase", async () => {
  const store = createMockStore(defaultAuthState);
  const id = expenses[2].id;
  await store.dispatch(startRemoveExpense({ id }));
  const actions = store.getActions();

  expect(actions[0]).toEqual({
    type: "REMOVE_EXPENSE",
    id,
  });

  const snapshot = await database
    .ref(`users/${uid}/expenses/${id}`)
    .once("value");
  // console.log("`expenses/${actions[0].id}`", `expenses/${actions[0].id}`);
  expect(snapshot.val()).toBeFalsy();
});

test("should edit expenses from firebase", async () => {
  const store = createMockStore(defaultAuthState);
  const id = expenses[1].id;
  const updates = {
    note: "New note value",
  };
  await store.dispatch(startEditExpense(id, updates));
  const actions = store.getActions();

  expect(actions[0]).toEqual({
    type: "EDIT_EXPENSE",
    id,
    updates,
  });

  const snapshot = await database
    .ref(`users/${uid}/expenses/${id}`)
    .once("value");
  expect(snapshot.val().note).toEqual(updates.note);
});
