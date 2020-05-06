import uuid from "uuid";
import database from "../firebase/firebase";

export const addExpense = expense => ({
  type: "ADD_EXPENSE",
  expense,
});

export const startAddExpense = (expenseData = {}) => {
  return async (dispatch, getState) => {
    const uid = getState().auth.uid;
    const {
      description = "",
      note = "",
      amount = 0,
      createdAt = 0,
    } = expenseData;
    const expense = { description, note, amount, createdAt };

    const ref = await database.ref(`users/${uid}/expenses`).push(expense);
    dispatch(
      addExpense({
        id: ref.key,
        ...expense,
      })
    );

    // return database
    //   .ref("expenses")
    //   .push(expense)
    //   .then(ref => {
    //     dispatch(
    //       addExpense({
    //         id: ref.key,
    //         ...expense,
    //       })
    //     );
    //   });
  };
};

export const removeExpense = ({ id } = {}) => ({
  type: "REMOVE_EXPENSE",
  id,
});

export const startRemoveExpense = ({ id } = {}) => {
  return async (dispatch, getState) => {
    const uid = getState().auth.uid;
    await database.ref(`users/${uid}/expenses/${id}`).remove();

    dispatch(removeExpense({ id }));
  };
};

export const editExpense = (id, updates) => ({
  type: "EDIT_EXPENSE",
  id,
  updates,
});

export const setExpenses = expenses => ({
  type: "SET_EXPENSES",
  expenses,
});

export const startSetExpenses = () => {
  return async (dispatch, getState) => {
    const uid = getState().auth.uid;
    const expenses = [];
    const snapshot = await database.ref(`users/${uid}/expenses`).once("value");
    snapshot.forEach(childSnapshot => {
      expenses.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    dispatch(setExpenses(expenses));
    // console.log("expenses[] : ", expenses);
  };
};

export const startEditExpense = (id, updates) => {
  return async (dispatch, getState) => {
    const uid = getState().auth.uid;
    await database.ref(`users/${uid}/expenses/${id}`).update(updates);
    // console.log("snapshot", snapshot);

    dispatch(editExpense(id, updates));
  };
};

// export const editExpense = (id, updates) => ({
//   type: "EDIT_EXPENSE",
//   id,
//   updates,
// });
