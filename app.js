// Get the necessary DOM elements
const transactionForm = document.getElementById('transaction-form');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');
const amountInput = document.getElementById('amount');
const balanceAmount = document.getElementById('balance-amount');
const transactionList = document.getElementById('transaction-list');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

let currentPage = 1;
const transactionsPerPage = 5; // Set the desired number of transactions per page

let transactions = [];
let balance = 0;
const categories = {
  income: ['Salary', 'Freelance', 'Investments', 'Other'],
  expense: ['Groceries', 'Bills', 'Entertainment', 'Transportation', 'Others']
};



// Function to update the category select options based on the selected type
function updateCategoryOptions() {
  const selectedType = typeSelect.value;
  const selectedCategories = categories[selectedType];

  categorySelect.innerHTML = '';
  selectedCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.innerText = category;
    categorySelect.appendChild(option);
  });

  categorySelect.disabled = false;
}

// Function to update the category select options based on the selected type and selected category
function UpdateCategoryOptions(typeSelect, categorySelect, selectedType, selectedCategory) {
  const selectedCategories = categories[selectedType];

  categorySelect.innerHTML = '';
  selectedCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.innerText = category;
    if (category === selectedCategory) {
      option.selected = true;
    }
    categorySelect.appendChild(option);
  });

  categorySelect.disabled = false;
}


// Event listener for type select change
typeSelect.addEventListener('change', updateCategoryOptions);

// Function to enable inline editing of a transaction
function enableInlineEditing(listItem, transaction, index) {
  listItem.innerHTML = '';

  const typeSelect = document.createElement('select');
  typeSelect.classList.add('type');
  typeSelect.addEventListener('change', () => {
    UpdateCategoryOptions(typeSelect, categorySelect, typeSelect.value, categorySelect.value);
  });

  const categorySelect = document.createElement('select');
  categorySelect.classList.add('category');

  const amountInput = document.createElement('input');
  amountInput.type = 'number';
  amountInput.classList.add('amount');

  const saveButton = document.createElement('button');
  saveButton.innerText = 'Save';
  saveButton.classList.add('save-btn');
  saveButton.addEventListener('click', () => saveTransaction(listItem, transaction, index));

  const cancelButton = document.createElement('button');
  cancelButton.innerText = 'Cancel';
  cancelButton.classList.add('cancel-btn');
  cancelButton.addEventListener('click', () => cancelEditing(listItem, transaction));

  const typeOptions = ['income', 'expense'];
  typeOptions.forEach(option => {
    const typeOption = document.createElement('option');
    typeOption.value = option;
    typeOption.innerText = option.charAt(0).toUpperCase() + option.slice(1);
    if (option === transaction.type) {
      typeOption.selected = true;
    }
    typeSelect.appendChild(typeOption);
  });

  UpdateCategoryOptions(typeSelect, categorySelect, transaction.type, transaction.category);

  const listItemContent = document.createElement('div');
  listItemContent.classList.add('list-item-content');

  listItemContent.appendChild(typeSelect);
  listItemContent.appendChild(categorySelect);
  listItemContent.appendChild(amountInput);
  listItemContent.appendChild(saveButton);
  listItemContent.appendChild(cancelButton);

  listItem.appendChild(listItemContent);

  amountInput.value = Math.abs(transaction.amount);
  amountInput.focus();
}


// Function to save the edited transaction
function saveTransaction(listItem, transaction, index) {
  const typeSelect = listItem.querySelector('.type');
  const categorySelect = listItem.querySelector('.category');
  const amountInput = listItem.querySelector('.amount');

  const updatedType = typeSelect.value;
  const updatedCategory = categorySelect.value;
  const updatedAmount = parseFloat(amountInput.value);

  if (isNaN(updatedAmount) || updatedAmount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  const updatedTransaction = {
    type: updatedType,
    category: updatedCategory,
    amount: updatedType === 'expense' ? -updatedAmount : updatedAmount
  };

  balance -= transaction.amount;
  balance += updatedTransaction.amount;

  transactions[index] = updatedTransaction;

  displayTransactions();
  updateBalance();

  alert('Transaction updated successfully!');
}

// Function to cancel editing of a transaction
function cancelEditing(listItem, transaction) {
  listItem.innerHTML = '';

  const type = document.createElement('span');
  type.classList.add('type');
  type.innerText = transaction.type === 'income' ? 'Income' : 'Expense';

  const category = document.createElement('span');
  category.classList.add('category');
  category.innerText = transaction.category;

  const amount = document.createElement('span');
  amount.classList.add('amount');
  amount.innerText = formatCurrency(transaction.amount);

  if (transaction.type === 'income') {
    amount.classList.add('income');
  } else if (transaction.type === 'expense') {
    amount.classList.add('expense');
  }

  const actionButtons = document.createElement('div');
  actionButtons.classList.add('action-buttons');

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit';
  editButton.classList.add('edit-btn');
  editButton.addEventListener('click', () => enableInlineEditing(listItem, transaction));

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.classList.add('delete-btn');
  deleteButton.addEventListener('click', () => deleteTransaction(transaction));

  actionButtons.appendChild(editButton);
  actionButtons.appendChild(deleteButton);

  listItem.appendChild(type);
  listItem.appendChild(category);
  listItem.appendChild(amount);
  listItem.appendChild(actionButtons);
}


// Function to display the transactions
function displayTransactions() {
  // Clear the transaction list
  transactionList.innerHTML = '';

  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  currentTransactions.forEach((transaction, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('transaction');

    if (transaction.isEditing) {
      enableInlineEditing(listItem, transaction, startIndex + index);
    } else {
      const type = document.createElement('span');
      type.classList.add('type');
      type.innerText = transaction.type === 'income' ? 'Income' : 'Expense';
    
    const category = document.createElement('span');
    category.classList.add('category');
    category.innerText = transaction.category;

    const amount = document.createElement('span');
    amount.classList.add('amount');
    amount.innerText = formatCurrency(transaction.amount);

    if (transaction.type === 'income') {
      amount.classList.add('income');
    } else if (transaction.type === 'expense') {
      amount.classList.add('expense');
    }

    const actionButtons = document.createElement('div');
    actionButtons.classList.add('action-buttons');

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click', () => {
      transaction.isEditing = true;
      displayTransactions();
    });
    const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.classList.add('delete-btn');
      deleteButton.addEventListener('click', () => deleteTransaction(transaction));
     
      actionButtons.appendChild(editButton);
      actionButtons.appendChild(deleteButton);


    listItem.appendChild(type);
    listItem.appendChild(category);
    listItem.appendChild(amount);
    listItem.appendChild(actionButtons);}

    transactionList.appendChild(listItem);
    // Call the updateBalance() function after displaying the transactions
    updateBalance();
  });

  // Disable/enable pagination buttons based on current page
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = endIndex >= transactions.length;
  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  // Update page number display
  const pageNumberElement = document.getElementById('page-number');
  pageNumberElement.innerText = `${currentPage} / ${totalPages}`;
}


// Function to add a transaction
function addTransaction(event) {
  event.preventDefault();

  const type = typeSelect.value;
  const category = categorySelect.value;
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  const transaction = {
    type,
    category,
    amount: type === 'expense' ? -amount : amount
  };

  transactions.push(transaction);

  balance += transaction.amount;

  displayTransactions();

  updateBalance();

  // Reset the form inputs
  amountInput.value = '';
  categorySelect.selectedIndex = 0; // Reset the selected option to the default
  //categorySelect.disabled = true; // Remove this line to enable category select after adding a transaction

  alert('Transaction added successfully!');
}


// Function to delete a transaction
function deleteTransaction(transaction) {
  transactions = transactions.filter((t) => t !== transaction);
  balance -= transaction.amount;

  displayTransactions();
  updateBalance();

  alert('Transaction deleted successfully!');
}


// Function to edit a transaction
function editTransaction(transaction, index) {
  const updatedType = prompt('Enter the updated type (income/expense):', transaction.type);
  if (updatedType !== null && (updatedType === 'income' || updatedType === 'expense')) {
    const updatedCategory = prompt('Enter the updated category:', transaction.category);
    if (
      updatedCategory !== null &&
      (categories[updatedType].includes(updatedCategory) ||
        (updatedType === transaction.type && updatedCategory === transaction.category))
    ) {
      const updatedAmount = prompt('Enter the updated amount:', transaction.amount);
      if (updatedAmount !== null) {
        const parsedAmount = parseFloat(updatedAmount);
        if (!isNaN(parsedAmount)) {
          const updatedTransaction = {
            type: updatedType,
            category: updatedCategory,
            amount: updatedType === 'expense' ? -parsedAmount : parsedAmount
          };

          balance -= transaction.amount;
          balance += updatedTransaction.amount;

          transactions[index] = updatedTransaction;

          displayTransactions();
          updateBalance();

          alert('Transaction updated successfully!');
        } else {
          alert('Invalid amount entered. Transaction not updated.');
        }
      }
    } else {
      alert('Invalid category entered. Transaction not updated.');
    }
  } else {
    alert('Invalid type entered. Transaction not updated.');
  }
}



// Function to update the balance
function updateBalance() {
  balanceAmount.innerText = formatCurrency(balance);
}


// Function to format currency
function formatCurrency(amount, type) {
  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  });

  if (type === 'expense') {
    return `-${currencyFormatter.format(Math.abs(amount))}`;
  }

  return currencyFormatter.format(amount);
}


// Event listener for transaction form submission
transactionForm.addEventListener('submit', addTransaction);

// Previous button event listener
prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayTransactions();
  }
});

// Next button event listener
nextButton.addEventListener('click', () => {
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayTransactions();
  }
});

// Initial setup
updateCategoryOptions();
