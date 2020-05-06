export default expenses => {
  return expenses
    .map(expense => expense.amount)
    .reduce((sum, value) => sum + value, 0);

  //   const amountArray = expenses.map(expense => expense.amount);
  //   const total = amountArray.reduce((sum, amount) => sum + amount, 0);
  //   return total;
};
