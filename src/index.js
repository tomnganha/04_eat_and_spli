import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function FriendList({
  friendList,
  showFormAddFriend,
  showFormSplitBill,
  onShowFormAdd,
  onShowFormSplitBill,
}) {
  return (
    <>
      <ul>
        {friendList.map((friend) => (
          <FriendItem
            friend={friend}
            key={friend.id}
            showFormSplitBill={showFormSplitBill}
            onShowFormSplitBill={onShowFormSplitBill}
          ></FriendItem>
        ))}
      </ul>

      {!showFormAddFriend && (
        <button className="button" onClick={onShowFormAdd}>
          Add friend
        </button>
      )}
    </>
  );
}

function FriendItem({ friend, showFormSplitBill, onShowFormSplitBill }) {
  /* const message =
    friend.balance > 0
      ? `${friend.name} owes you ${friend.balance}$`
      : `You owe ${friend.name} ${-friend.balance}$`; */
  let message;
  let nameClass;
  if (friend.balance > 0) {
    message = `${friend.name} owes you ${friend.balance}$`;
    nameClass = "green";
  } else if (friend.balance < 0) {
    message = `You owe ${friend.name} ${-friend.balance}$`;
    nameClass = "red";
  } else {
    message = `You and ${friend.name} are even`;
    nameClass = "";
  }
  return (
    <li>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      <p className={nameClass}>{message}</p>
      <button className="button" onClick={() => onShowFormSplitBill(friend.id)}>
        {showFormSplitBill === friend.id ? "Close" : "Select"}
      </button>
    </li>
  );
}
function FormAddFriend({ friendList, onAddFriend, onShowFormAdd }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://i.pravatar.cc/48?u=499476");
  const id = Math.floor(Math.random() * 100000 + 1);
  const newFriend = {
    id,
    name,
    image: `https://i.pravatar.cc/48?u=${id}`,
    balance: 0,
  };
  function handlerSubmit(e) {
    e.preventDefault();
    onAddFriend(newFriend);
    setName("");
    onShowFormAdd();
  }
  return (
    <>
      <form className="form-add-friend" onSubmit={handlerSubmit}>
        <label>👭Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>📎Image URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" className="button">
          Add
        </button>
      </form>
      <button className="button" onClick={onShowFormAdd}>
        Close
      </button>
    </>
  );
}
function FormSplitBill({ currentFriend, onUpdate, showFormSplitBill }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [selectPay, setSelectPay] = useState("you");
  const expenseOfFriend = bill - yourExpense;

  function handlerSubmit(e) {
    e.preventDefault();
    if (!(bill > 0 && yourExpense > 0)) return;
    const updateBalance =
      selectPay === "you"
        ? expenseOfFriend + currentFriend.balance
        : Number(-yourExpense) + currentFriend.balance;
    const updateFriend = { ...currentFriend, balance: updateBalance };
    onUpdate(updateFriend);
    console.log(updateBalance);
    console.log(updateFriend);
    setBill("");
    setYourExpense("");
    setSelectPay("you");
    showFormSplitBill();
  }
  return (
    <>
      <form className="form-split-bill" onSubmit={handlerSubmit}>
        <h2>SPLIT A BILL WITH {currentFriend.name} thaidop</h2>
        <label>💰Bill value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) =>
            setBill(+e.target.value.trim() ? +e.target.value.trim() : "")
          }
        />
        <label>🧍‍♂️Your expense</label>
        <input
          type="text"
          value={yourExpense}
          onChange={(e) =>
            setYourExpense(
              +e.target.value.trim() <= bill
                ? +e.target.value.trim()
                : yourExpense
            )
          }
        />
        <label>👩🏼‍🤝‍👩🏻{currentFriend.name}'s expense</label>
        <input type="number" disabled value={expenseOfFriend} />
        <label>🤑Who is paying the bill?</label>
        <select
          value={selectPay}
          onChange={(e) => setSelectPay(e.target.value)}
        >
          <option value="you">You</option>
          <option value={currentFriend.name}>{currentFriend.name}</option>
        </select>
        <button className="button" type="submit" onClick={handlerSubmit}>
          Split bill
        </button>
      </form>
    </>
  );
}

function App() {
  const [friendList, setFriendList] = useState(initialFriends);
  const [showFormAddFriend, setShowFormAddFriend] = useState(false);
  const [showFormSplitBill, setShowFormSplitBill] = useState(null);
  const [currentFriend] = friendList.filter(
    (fr) => fr.id === showFormSplitBill
  );
  function handlerUpdateFriendList(updateFriend) {
    setFriendList((pre) =>
      pre.map((fr) =>
        Number(fr.id) === Number(updateFriend.id) ? updateFriend : fr
      )
    );
    console.log(friendList);
  }
  function handlerShowFormAdd() {
    setShowFormAddFriend((pre) => !pre);
  }
  function handlerAddFriend(friend) {
    setFriendList((list) => [...list, friend]);
  }
  function handlerShowFormSplitBill(id) {
    if (showFormAddFriend) setShowFormAddFriend(false);
    setShowFormSplitBill((pre) => (pre === id ? null : id));
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friendList={friendList}
          showFormAddFriend={showFormAddFriend}
          showFormSplitBill={showFormSplitBill}
          onShowFormAdd={handlerShowFormAdd}
          onShowFormSplitBill={handlerShowFormSplitBill}
        />
        {showFormAddFriend && (
          <FormAddFriend
            friendList={friendList}
            onAddFriend={handlerAddFriend}
            onShowFormAdd={handlerShowFormAdd}
          />
        )}
      </div>
      {showFormSplitBill && (
        <FormSplitBill
          currentFriend={currentFriend}
          onUpdate={handlerUpdateFriendList}
          showFormSplitBill={handlerShowFormSplitBill}
          key={currentFriend.id}
        />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
