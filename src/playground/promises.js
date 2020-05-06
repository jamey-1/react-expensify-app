const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      name: "Andrew",
      age: 26,
    });
    // reject("Something went wrong!");
  }, 5000);
});

console.log("before");

promise
  .then(data => {
    console.log("1", data);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          name: "Other Promise",
          age: 36,
        });
        // reject("Something went wrong!");
      }, 5000);
    });
  })
  .then(result => {
    console.log("does this run? ", result);
  })
  .catch(error => {
    console.log("error: ", error);
  });

console.log("after");
