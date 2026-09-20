// url api
const url = "https://jsonplaceholder.typicode.com/users";
const FailedLoad = document.querySelector(".FailedLoad");

// get api
async function GetUsers() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Get Api Has fali");
    } else {
      const showResponse = await response.json();
      return showResponse;
    }
  } catch (error) {
    console.log(error.message);
    FailedLoad.classList.remove("displaynone");
  } finally {
    console.log("Get Api Has Done");
  }
}

let allUsers = [];

// rendering
async function renderUsers() {
  allUsers = [];
  const response = await GetUsers();
  console.log(response);
  if (response == undefined) return;
  const users = response;
  articleTemplate.innerHTML = "";
  for (let itme of users) {
    templateUser(itme);
    allUsers.push(itme);
  }
}
renderUsers();

const articleTemplate = document.querySelector(".articleTemplate");
// crate Template

function templateUser(user) {
  //   ararticle
  let articleEle = document.createElement("article");
  articleEle.classList.add("user-template");
  articleEle.dataset.id = user.id;
  // div info
  let divInfo = document.createElement("div");
  divInfo.classList.add("info");
  let pUserName = document.createElement("p");
  let iUserName = document.createElement("i");
  iUserName.classList.add("fa-solid", "fa-user");
  pUserName.textContent = user.name;
  pUserName.appendChild(iUserName);
  let pEmail = document.createElement("p");
  pEmail.textContent = `Email: ${user.email}`;
  let pPhone = document.createElement("p");
  pPhone.textContent = `Phone: ${user.phone}`;
  divInfo.appendChild(pUserName);
  divInfo.appendChild(pEmail);
  divInfo.appendChild(pPhone);
  //   div buttons
  let divbuttons = document.createElement("div");
  divbuttons.classList.add("buttons");
  let EditBut = document.createElement("button");
  EditBut.classList.add("btn", "Edit");
  EditBut.textContent = "Edit";
  EditBut.addEventListener("click", function (ele) {
    EditUser(this);
  });
  let DeleteBut = document.createElement("button");
  DeleteBut.classList.add("btn", "Delete");
  DeleteBut.textContent = "Delete";
  DeleteBut.addEventListener("click", function (ele) {
    DeleteUser(this);
  });
  divbuttons.appendChild(EditBut);
  divbuttons.appendChild(DeleteBut);

  //   append div
  articleEle.appendChild(divInfo);
  articleEle.appendChild(divbuttons);

  articleTemplate.appendChild(articleEle);
}

// serch
const serchInp = document.querySelector("#serch");
const userFond = document.querySelector(".userFond");
serchInp.addEventListener("input", function () {
  let result = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(serchInp.value.toLowerCase()) ||
      user.email.toLowerCase().includes(serchInp.value.toLowerCase()) ||
      user.phone.toLowerCase().includes(serchInp.value.toLowerCase()),
  );
  if (serchInp.value === "") {
    articleTemplate.innerHTML = "";
    userFond.classList.add("displaynone");

    for (let itme of allUsers) {
      templateUser(itme);
    }
  } else if (result.length === 0) {
    articleTemplate.innerHTML = "";
    userFond.classList.remove("displaynone");
    // userFond.classList.add("displayblock");
  } else if (result.length >= 1) {
    userFond.classList.add("displaynone");
    articleTemplate.innerHTML = "";
    result.forEach((user) => {
      templateUser(user);
    });
  }
});

// create Update User
const updateUsers = document.querySelector(".updateUsers");
const updateName = document.querySelector(".updateName");
const updateEmail = document.querySelector(".updateEmail");
const updatePhone = document.querySelector(".updatePhone");
// EditUser
let editingUserId = null;
function EditUser(ele) {
  let removEle = ele.parentElement.parentElement;
  let idEle = Number(removEle.dataset.id);
  editingUserId = idEle;
  let newUsers = allUsers.find((user) => user.id == idEle);
  console.log(newUsers);
  updateUsers.classList.remove("displaynone");
  updateName.value = "";
  updateEmail.value = "";
  updatePhone.value = "";
  updateName.value = newUsers.name;
  updateEmail.value = newUsers.email;
  updatePhone.value = newUsers.phone;
}
// Delete User
function DeleteUser(ele) {
  let removEle = ele.parentElement.parentElement;
  let idEle = Number(removEle.dataset.id);
  let newUsers = allUsers.find((user) => user.id == idEle);
  allUsers = allUsers.filter((user) => user.id != idEle);
  removEle.remove();
  DeleteUsers(newUsers);
}
// cansel Update
const cancelUpdate = document.querySelector(".cancelUpdate");
cancelUpdate.addEventListener("click", function () {
  updateUsers.classList.add("displaynone");
  updateName.value = "";
  updateEmail.value = "";
  updatePhone.value = "";
});
// update user
const UpdateDone = document.querySelector(".UpdateDone");
UpdateDone.addEventListener("click", function () {
  if (
    updateName.value == "" ||
    updateEmail.value == "" ||
    updatePhone.value == ""
  )
    return;
  const checkUserEmail = allUsers.some(
    (user) => user.email === updateEmail.value && user.id !== editingUserId,
  );

  if (checkUserEmail) {
    alert("This email already exists.");
    return;
  }

  const checkuserPhone = allUsers.some(
    (user) => user.email === updateEmail.value && user.id !== editingUserId,
  );
  if (checkuserPhone) {
    alert("This phone number already exists.");
    return;
  }
  console.log(editingUserId);
  const user = {
    id: editingUserId,
    name: updateName.value,
    email: updateEmail.value,
    phone: updatePhone.value,
  };
  updateName.value = "";
  updateEmail.value = "";
  updatePhone.value = "";
  console.log(user);
  updateUsers.classList.add("displaynone");
  UpdateUser(user);
  console.log(allUsers);
});

// Add New User
const addNewName = document.querySelector(".addNewName");
const addNewEmail = document.querySelector(".addNewEmail");
const addNewPhone = document.querySelector(".addNewPhone");
const cancelNewUser = document.querySelector(".cancelNewUser");
const NewUserDone = document.querySelector(".NewUserDone");
const divAddNewUser = document.querySelector(".divAddNewUser");
const addNewUser = document.querySelector(".user");
addNewUser.addEventListener("click", function () {
  console.log("ok");
  divAddNewUser.classList.remove("displaynone");
});
NewUserDone.addEventListener("click", function () {
  if (
    addNewName.value.trim() == "" ||
    addNewEmail.value == "" ||
    addNewPhone.value == ""
  ) {
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(addNewEmail.value.trim())) {
    alert("Please enter a valid email.");
    return;
  }

  const phoneRegex = /^[0-9]+$/;

  if (!phoneRegex.test(addNewPhone.value.trim())) {
    alert("Please enter a valid phone number.");
    return;
  }
  let crateIdUser = allUsers.reduce((sum, user) => {
    if (user.id > sum) {
      sum = user.id;
    }
    return sum;
  }, 0);
  let idUser = ++crateIdUser;
  const crateNewUser = {
    id: idUser,
    name: addNewName.value,
    email: addNewEmail.value,
    phone: addNewPhone.value,
  };
  const checkEmail = allUsers.some((user) => user.email === crateNewUser.email);
  if (checkEmail) {
    alert("This email already exists.");
    return;
  }
  const checkPhone = allUsers.some((user) => user.phone === crateNewUser.phone);
  if (checkPhone) {
    alert("This  phone number already exists.");
    return;
  }
  console.log(checkEmail, checkPhone);
  CreateNewUser(crateNewUser);
  addNewName.value = "";
  addNewEmail.value = "";
  addNewPhone.value = "";
  divAddNewUser.classList.add("displaynone");
});

cancelNewUser.addEventListener("click", function () {
  addNewName.value = "";
  addNewEmail.value = "";
  addNewPhone.value = "";
  divAddNewUser.classList.add("displaynone");
});

// PATCH API
async function UpdateUser(user) {
  try {
    const response = await fetch(`${url}/${user.id}`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: user.name,
        email: user.email,
        phone: user.phone,
      }),
    });
    if (!response.ok) {
      throw new Error("UpdateUser Has feali");
    } else {
      alert("User was successfully updated.");
      renderUsers();
    }
  } catch (error) {
    console.log(error.message);
    alert("Failed to update user. Please try again.");
  } finally {
    console.log("UpdateUser");
  }
}

// Delete API

async function DeleteUsers(user) {
  try {
    const response = await fetch(`${url}/${user.id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("DeleteUsers Has feali");
    } else {
      alert("User was successfully deleted.");
    }
  } catch (error) {
    console.log(error.message);
    alert("Failed to delete user. Please try again.");
  } finally {
    console.log("DeleteUsers");
  }
}
// POST API
async function CreateNewUser(user) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }),
    });
    if (!response.ok) {
      throw new Error("CreateNewUser Has feali");
    } else {
      allUsers.push(user);
      templateUser(user);
      alert("User was successfully added.");
    }
  } catch (error) {
    console.log(error.message);
    alert("Failed to create user. Please try again.");
  } finally {
    console.log("CreateNewUser");
  }
}
