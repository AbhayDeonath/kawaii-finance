/* =========================================
   KAWAII FINANCE
   COMPLETE APPLICATION
========================================= */


/* =========================================
   1. CONSTANTS AND STORAGE
========================================= */

const STORAGE_KEY = "kawaiiTransactions";
const RESET_MIGRATION_KEY = "kawaiiFreshStartV2";

const CURRENCY = "INR";


/*
   ONE-TIME FRESH START

   The first launch after installing this version
   clears the previous demo transaction storage.

   After this migration, normal saved data,
   imports and new transactions are preserved.
*/

function performFreshStartMigration() {

    try {

        const migrationDone =
            localStorage.getItem(RESET_MIGRATION_KEY);

        if (migrationDone !== "done") {

            localStorage.removeItem(STORAGE_KEY);

            localStorage.setItem(
                RESET_MIGRATION_KEY,
                "done"
            );

        }

    } catch (error) {

        console.error("Fresh start migration failed:", error);

    }

}

performFreshStartMigration();


/* =========================================
   2. TRANSACTION CATEGORIES
========================================= */

const transactionCategories = {

    expense: [
        { value: "Food", label: "🍕 Food" },
        { value: "Shopping", label: "🛍️ Shopping" },
        { value: "Transport", label: "🚌 Transport" },
        { value: "Education", label: "📚 Education" },
        { value: "Entertainment", label: "🎮 Entertainment" },
        { value: "Health", label: "💊 Health" },
        { value: "Bills", label: "🧾 Bills" },
        { value: "Other", label: "🌸 Other" }
    ],

    income: [
        { value: "Pocket Money", label: "💵 Pocket Money" },
        { value: "Salary", label: "💼 Salary" },
        { value: "Scholarship", label: "🎓 Scholarship" },
        { value: "Freelance", label: "💻 Freelance" },
        { value: "Gift", label: "🎁 Gift" },
        { value: "Other Income", label: "✨ Other Income" }
    ]

};


/* =========================================
   3. CATEGORY HELPERS
========================================= */

function getCategoryIcon(category) {

    const icons = {

        Food: "🍕",
        Shopping: "🛍️",
        Transport: "🚌",
        Education: "📚",
        Entertainment: "🎮",
        Health: "💊",
        Bills: "🧾",
        Other: "🌸",

        Income: "💵",
        Salary: "💼",
        "Pocket Money": "💵",
        Scholarship: "🎓",
        Freelance: "💻",
        Gift: "🎁",
        "Other Income": "✨"

    };

    return icons[category] || "🌸";

}


function getCategoryClass(category) {

    if (category === "Food") return "category-food";

    if (category === "Shopping") return "category-shopping";

    if (category === "Transport") return "category-transport";

    return "category-other";

}


/* =========================================
   4. DATE AND CURRENCY HELPERS
========================================= */

function getDateString(offset = 0) {

    const date = new Date();

    date.setDate(date.getDate() - offset);

    return getDateStringForDate(date);

}


function getDateStringForDate(date) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function formatDate(dateString) {

    if (!dateString) return "—";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}


function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: CURRENCY,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(amount) || 0);

}


function initializeDate() {

    const today = new Date();

    document.getElementById("currentDate").textContent =
        today.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    document.getElementById("currentYear").textContent =
        today.getFullYear();

}


/* =========================================
   5. LOAD AND SAVE TRANSACTIONS
========================================= */

function normalizeTransaction(transaction, index = 0) {

    if (!transaction || typeof transaction !== "object") {
        throw new Error("Invalid transaction record.");
    }

    const name = String(transaction.name ?? "").trim();

    const amount = Number(transaction.amount);

    const date = String(transaction.date ?? "");

    const type = transaction.type;

    if (!name) {
        throw new Error("A transaction is missing its name.");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error(`Invalid amount in transaction: ${name}`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error(`Invalid date in transaction: ${name}`);
    }

    if (!["income", "expense"].includes(type)) {
        throw new Error(`Invalid transaction type: ${name}`);
    }

    return {

        id: String(
            transaction.id ?? `${Date.now()}-${index}`
        ),

        name,

        description: String(
            transaction.description ?? ""
        ),

        category: String(
            transaction.category ?? "Other"
        ),

        amount,

        type,

        date

    };

}


function loadTransactions() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return [];

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) return [];

        return parsed.map(normalizeTransaction);

    } catch (error) {

        console.error("Could not load transactions:", error);

        return [];

    }

}


let transactions = loadTransactions();


function saveTransactions() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(transactions)
        );

        updateSettingsOverview();

        return true;

    } catch (error) {

        console.error("Could not save transactions:", error);

        alert(
            "Unable to save your transactions. Check your browser storage."
        );

        return false;

    }

}


/* =========================================
   6. DOM ELEMENTS
========================================= */

const sidebar = document.getElementById("sidebar");

const menuToggle = document.getElementById("menuToggle");

const breadcrumbPage = document.getElementById("breadcrumbPage");

const addExpenseBtn = document.getElementById("addExpenseBtn");

const transactionsAddExpense =
    document.getElementById("transactionsAddExpense");

const viewAllTransactions =
    document.getElementById("viewAllTransactions");


/* Pages */

const dashboardPage = document.getElementById("dashboardPage");

const transactionsPage = document.getElementById("transactionsPage");

const analyticsPage = document.getElementById("analyticsPage");

const settingsPage = document.getElementById("settingsPage");


/* Add transaction modal */

const expenseModal = document.getElementById("expenseModal");

const expenseForm = document.getElementById("expenseForm");

const closeModalButton = document.getElementById("closeModal");

const saveTransactionBtn =
    document.getElementById("saveTransactionBtn");

const expenseCategory =
    document.getElementById("expenseCategory");


/* Edit transaction modal */

const editTransactionModal =
    document.getElementById("editTransactionModal");

const editTransactionForm =
    document.getElementById("editTransactionForm");

const closeEditModalButton =
    document.getElementById("closeEditModal");


/* Tables */

const transactionList =
    document.getElementById("transactionList");

const allTransactionsList =
    document.getElementById("allTransactionsList");


/* =========================================
   7. UPDATE DASHBOARD SUMMARY
========================================= */

function updateSummary() {

    const income = transactions

        .filter(transaction => transaction.type === "income")

        .reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );


    const expenses = transactions

        .filter(transaction => transaction.type === "expense")

        .reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );


    const balance = income - expenses;


    document.getElementById("totalIncome").textContent =
        formatCurrency(income);


    document.getElementById("totalExpense").textContent =
        formatCurrency(expenses);


    document.getElementById("totalBalance").textContent =
        formatCurrency(balance);

}


/* =========================================
   8. RECENT TRANSACTIONS
========================================= */

function renderTransactions() {

    transactionList.innerHTML = "";

    const recent = [...transactions]

        .sort((a, b) => {

            return new Date(`${b.date}T00:00:00`) -
                new Date(`${a.date}T00:00:00`);

        })

        .slice(0, 5);


    document.getElementById("recentEmpty").hidden =
        recent.length !== 0;


    recent.forEach(transaction => {

        const row = document.createElement("tr");

        const isIncome = transaction.type === "income";


        const nameCell = document.createElement("td");

        const nameWrapper = document.createElement("div");

        nameWrapper.className = "transaction-name";


        const icon = document.createElement("div");

        icon.className = "transaction-icon";

        icon.textContent = getCategoryIcon(transaction.category);


        const details = document.createElement("div");

        const name = document.createElement("strong");

        name.textContent = transaction.name;


        const description = document.createElement("small");

        description.textContent =
            transaction.description || transaction.category;


        details.append(name, description);

        nameWrapper.append(icon, details);

        nameCell.appendChild(nameWrapper);


        const categoryCell = document.createElement("td");

        categoryCell.textContent = transaction.category;


        const dateCell = document.createElement("td");

        dateCell.textContent = formatDate(transaction.date);


        const amountCell = document.createElement("td");

        amountCell.className =
            isIncome ? "income-amount" : "expense-amount";

        amountCell.textContent =
            `${isIncome ? "+" : "−"} ${formatCurrency(transaction.amount)}`;


        const typeCell = document.createElement("td");

        const badge = document.createElement("span");

        badge.className =
            `status-badge ${isIncome ? "received" : "completed"}`;

        badge.textContent = isIncome ? "Income" : "Expense";

        typeCell.appendChild(badge);


        row.append(
            nameCell,
            categoryCell,
            dateCell,
            amountCell,
            typeCell
        );

        transactionList.appendChild(row);

    });

}


/* =========================================
   9. DASHBOARD SPENDING CHART
========================================= */

const chartPeriod = document.getElementById("chartPeriod");


function renderChart() {

    const chartBars = document.getElementById("chartBars");
    chartBars.innerHTML = "";
    chartBars.classList.toggle("month-view", chartPeriod.value === "month");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dates = [];

    if (chartPeriod.value === "week") {

        const weekday = (today.getDay() + 6) % 7;
        const monday = new Date(today);
        monday.setDate(today.getDate() - weekday);

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            dates.push(date);
        }

    } else {

        const daysInMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
        ).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            dates.push(
                new Date(today.getFullYear(), today.getMonth(), day)
            );
        }

    }

    // Sum expenses for each day in the selected period.
    const totals = dates.map(date => {

        const dateString = getDateStringForDate(date);

        return transactions
            .filter(transaction =>
                transaction.type === "expense" &&
                transaction.date === dateString
            )
            .reduce(
                (sum, transaction) => sum + Number(transaction.amount),
                0
            );

    });

    const maximum = Math.max(...totals, 0);

    // Choose a readable scale instead of leaving every axis label at ₹0.
    let axisMaximum = 0;
    let step = 0;

    if (maximum > 0) {

        const rawStep = maximum / 4;
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const normalizedStep = rawStep / magnitude;

        const niceStep = normalizedStep <= 1 ? 1
            : normalizedStep <= 2 ? 2
            : normalizedStep <= 5 ? 5
            : 10;

        step = niceStep * magnitude;
        axisMaximum = step * 4;

    }

    function formatChartValue(value) {

        if (value >= 10000000) {
            return `₹${(value / 10000000).toFixed(1).replace(/\.0$/, "")}Cr`;
        }

        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(1).replace(/\.0$/, "")}L`;
        }

        if (value >= 1000) {
            return `₹${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
        }

        return `₹${Math.round(value).toLocaleString("en-IN")}`;

    }

    // Draw each daily bar and show its amount above the bar.
    totals.forEach((total, index) => {

        const date = dates[index];
        const group = document.createElement("div");
        group.className = "chart-day";

        const barHeight = axisMaximum > 0
            ? (total / axisMaximum) * 180
            : 2;

        const bar = document.createElement("div");
        bar.className = "chart-bar";
        bar.style.height = `${Math.max(barHeight, total > 0 ? 3 : 2)}px`;

        if (total > 0) {

            const amountLabel = document.createElement("span");
            amountLabel.className = "chart-amount-label";
            amountLabel.textContent = formatChartValue(total);
            amountLabel.style.bottom = `${Math.max(barHeight, 3) + 22}px`;
            group.appendChild(amountLabel);

        }

        const label = document.createElement("span");
        label.className = "chart-day-label";

        label.textContent = chartPeriod.value === "week"
            ? date.toLocaleDateString("en-IN", { weekday: "short" })
            : date.getDate();

        group.append(bar, label);
        chartBars.appendChild(group);

    });

}


chartPeriod.addEventListener("change", renderChart);


/* =========================================
   10. TRANSACTION FORM
========================================= */

const transactionTypeInputs = document.querySelectorAll(
    'input[name="transactionType"]'
);


function getSelectedTransactionType() {

    return document.querySelector(
        'input[name="transactionType"]:checked'
    ).value;

}


function updateTransactionForm() {

    const type = getSelectedTransactionType();

    const categories = transactionCategories[type];


    expenseCategory.innerHTML = categories.map(category => {

        return `
            <option value="${category.value}">
                ${category.label}
            </option>
        `;

    }).join("");


    const isIncome = type === "income";


    document.getElementById("expenseName").placeholder =

        isIncome
            ? "e.g. Pocket Money, Scholarship..."
            : "e.g. Food, Books, Shopping...";


    document.querySelector(
        'label[for="expenseName"]'
    ).textContent = isIncome

        ? "Where did the money come from?"

        : "What did you spend on?";


    saveTransactionBtn.textContent = isIncome

        ? "Save Income 💰"

        : "Save Expense 💗";

}


function openModal() {

    expenseForm.reset();


    document.querySelector(
        'input[name="transactionType"][value="expense"]'
    ).checked = true;


    document.getElementById("expenseDate").value =
        getDateString(0);


    updateTransactionForm();

    expenseModal.classList.add("show");

    document.getElementById("expenseName").focus();

}


function closeExpenseModal() {

    expenseModal.classList.remove("show");

}


transactionTypeInputs.forEach(input => {

    input.addEventListener("change", updateTransactionForm);

});


addExpenseBtn.addEventListener("click", openModal);

transactionsAddExpense.addEventListener("click", openModal);

closeModalButton.addEventListener("click", closeExpenseModal);


expenseModal.addEventListener("click", event => {

    if (event.target === expenseModal) {
        closeExpenseModal();
    }

});


/* =========================================
   11. ADD TRANSACTION
========================================= */

expenseForm.addEventListener("submit", event => {

    event.preventDefault();


    const type = getSelectedTransactionType();

    const name = document.getElementById("expenseName").value.trim();

    const description =
        document.getElementById("expenseDescription").value.trim();

    const amount =
        Number(document.getElementById("expenseAmount").value);

    const category = expenseCategory.value;

    const date = document.getElementById("expenseDate").value;


    if (
        !name ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !date
    ) {

        alert("Please enter valid transaction details. 🌸");

        return;

    }


    if (date > getDateString(0)) {

        alert("Transaction date cannot be in the future. 🌷");

        return;

    }


    const newTransaction = {

        id: String(Date.now()),

        name,

        description: description || (
            type === "income"
                ? "Personal income"
                : "Personal expense"
        ),

        category,

        amount,

        type,

        date

    };


    transactions.push(newTransaction);


    if (!saveTransactions()) {

        transactions.pop();

        return;

    }


    updateDashboard();

    closeExpenseModal();

    expenseForm.reset();

    updateTransactionForm();


    alert(
        type === "income"
            ? "Income added successfully! 💰"
            : "Expense added successfully! 💗"
    );

});


/* =========================================
   12. PAGE NAVIGATION
========================================= */

const pageLinks = document.querySelectorAll(".nav-item[data-page]");


function showPage(pageName) {

    const pages = {

        dashboard: dashboardPage,

        transactions: transactionsPage,

        analytics: analyticsPage,

        settings: settingsPage

    };


    Object.entries(pages).forEach(([name, element]) => {

        element.hidden = name !== pageName;

    });


    const pageNames = {

        dashboard: "Dashboard",

        transactions: "Transactions",

        analytics: "Analytics",

        settings: "Settings"

    };


    breadcrumbPage.textContent =
        pageNames[pageName] || "Dashboard";


    pageLinks.forEach(link => {

        link.classList.toggle(
            "active",
            link.dataset.page === pageName
        );

    });


    if (pageName === "transactions") {
        renderAllTransactions();
    }

    if (pageName === "analytics") {
        renderAnalytics();
    }

    if (pageName === "settings") {
        updateSettingsOverview();
    }


    sidebar.classList.remove("open");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


pageLinks.forEach(link => {

    link.addEventListener("click", event => {

        event.preventDefault();

        const pageName = link.dataset.page;

        showPage(pageName);

        history.replaceState(null, "", `#${pageName}`);

    });

});


viewAllTransactions.addEventListener("click", () => {

    showPage("transactions");

    history.replaceState(null, "", "#transactions");

});


/* =========================================
   13. MOBILE SIDEBAR
========================================= */

menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});


document.addEventListener("click", event => {

    if (
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {

        sidebar.classList.remove("open");

    }

});


/* =========================================
   14. TRANSACTION SEARCH AND FILTERS
========================================= */

const transactionSearch =
    document.getElementById("transactionSearch");

const transactionTypeFilter =
    document.getElementById("transactionTypeFilter");

const transactionCategoryFilter =
    document.getElementById("transactionCategoryFilter");

const transactionSort =
    document.getElementById("transactionSort");

const transactionResultsCount =
    document.getElementById("transactionResultsCount");

const transactionsEmpty =
    document.getElementById("transactionsEmpty");


function updateCategoryFilterOptions() {

    const previousValue = transactionCategoryFilter.value;

    const categories = [
        ...new Set(transactions.map(item => item.category))
    ].sort();


    transactionCategoryFilter.innerHTML =
        '<option value="all">All categories</option>';


    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;

        option.textContent = category;

        transactionCategoryFilter.appendChild(option);

    });


    if (categories.includes(previousValue)) {
        transactionCategoryFilter.value = previousValue;
    }

}


function getFilteredTransactions() {

    const searchTerm =
        transactionSearch.value.trim().toLowerCase();

    const selectedType = transactionTypeFilter.value;

    const selectedCategory = transactionCategoryFilter.value;

    const selectedSort = transactionSort.value;


    let filtered = transactions.filter(transaction => {

        const searchableText = [

            transaction.name,

            transaction.description,

            transaction.category

        ].join(" ").toLowerCase();


        const matchesSearch =
            searchableText.includes(searchTerm);


        const matchesType =
            selectedType === "all" ||
            transaction.type === selectedType;


        const matchesCategory =
            selectedCategory === "all" ||
            transaction.category === selectedCategory;


        return matchesSearch && matchesType && matchesCategory;

    });


    filtered.sort((a, b) => {

        if (selectedSort === "newest") {

            return b.date.localeCompare(a.date) ||
                Number(b.id) - Number(a.id);

        }


        if (selectedSort === "oldest") {

            return a.date.localeCompare(b.date) ||
                Number(a.id) - Number(b.id);

        }


        if (selectedSort === "highest") {

            return b.amount - a.amount;

        }


        if (selectedSort === "lowest") {

            return a.amount - b.amount;

        }


        return 0;

    });


    return filtered;

}


/* =========================================
   15. RENDER ALL TRANSACTIONS
========================================= */

function renderAllTransactions() {

    allTransactionsList.innerHTML = "";


    const filteredTransactions = getFilteredTransactions();


    transactionResultsCount.textContent =

        `${filteredTransactions.length} transaction` +
        `${filteredTransactions.length === 1 ? "" : "s"}`;


    transactionsEmpty.hidden =
        filteredTransactions.length !== 0;


    filteredTransactions.forEach(transaction => {

        const isIncome = transaction.type === "income";

        const row = document.createElement("tr");


        const nameCell = document.createElement("td");

        const wrapper = document.createElement("div");

        wrapper.className = "transaction-name";


        const icon = document.createElement("div");

        icon.className = "transaction-icon";

        icon.textContent = getCategoryIcon(transaction.category);


        const details = document.createElement("div");

        const name = document.createElement("strong");

        name.textContent = transaction.name;


        const description = document.createElement("small");

        description.textContent =
            transaction.description || transaction.category;


        details.append(name, description);

        wrapper.append(icon, details);

        nameCell.appendChild(wrapper);


        const categoryCell = document.createElement("td");

        categoryCell.textContent = transaction.category;


        const dateCell = document.createElement("td");

        dateCell.textContent = formatDate(transaction.date);


        const amountCell = document.createElement("td");

        amountCell.className =
            isIncome ? "income-amount" : "expense-amount";

        amountCell.textContent =
            `${isIncome ? "+" : "−"} ${formatCurrency(transaction.amount)}`;


        const typeCell = document.createElement("td");

        const badge = document.createElement("span");

        badge.className =
            `status-badge ${isIncome ? "received" : "completed"}`;

        badge.textContent = isIncome ? "Income" : "Expense";

        typeCell.appendChild(badge);


        const actionsCell = document.createElement("td");

        const actions = document.createElement("div");

        actions.className = "transaction-actions";


        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.className = "transaction-action-btn";

        editButton.dataset.action = "edit";

        editButton.dataset.id = transaction.id;

        editButton.textContent = "✏️ Edit";


        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "transaction-action-btn delete";

        deleteButton.dataset.action = "delete";

        deleteButton.dataset.id = transaction.id;

        deleteButton.textContent = "🗑️ Delete";


        actions.append(editButton, deleteButton);

        actionsCell.appendChild(actions);


        row.append(
            nameCell,
            categoryCell,
            dateCell,
            amountCell,
            typeCell,
            actionsCell
        );


        allTransactionsList.appendChild(row);

    });

}


[
    transactionSearch,
    transactionTypeFilter,
    transactionCategoryFilter,
    transactionSort
].forEach(control => {

    control.addEventListener("input", renderAllTransactions);

    control.addEventListener("change", renderAllTransactions);

});


allTransactionsList.addEventListener("click", event => {

    const button = event.target.closest("button[data-action]");

    if (!button) return;


    if (button.dataset.action === "edit") {

        openEditTransaction(button.dataset.id);

    }


    if (button.dataset.action === "delete") {

        deleteTransaction(button.dataset.id);

    }

});


/* =========================================
   16. EDIT TRANSACTION
========================================= */

let editingTransactionId = null;


function populateEditCategories(type, selectedCategory) {

    const select =
        document.getElementById("editTransactionCategory");


    const categories = [
        ...transactionCategories[type]
    ];


    if (
        !categories.some(item => item.value === selectedCategory)
    ) {

        categories.push({
            value: selectedCategory,
            label: selectedCategory
        });

    }


    select.innerHTML = categories.map(category => {

        return `
            <option value="${escapeHtml(category.value)}">
                ${escapeHtml(category.label)}
            </option>
        `;

    }).join("");


    select.value = selectedCategory;

}


function openEditTransaction(transactionId) {

    const transaction = transactions.find(item =>
        String(item.id) === String(transactionId)
    );


    if (!transaction) return;


    editingTransactionId = transaction.id;


    document.getElementById("editTransactionName").value =
        transaction.name;


    document.getElementById("editTransactionDescription").value =
        transaction.description;


    document.getElementById("editTransactionAmount").value =
        transaction.amount;


    document.getElementById("editTransactionType").value =
        transaction.type;


    populateEditCategories(
        transaction.type,
        transaction.category
    );


    document.getElementById("editTransactionDate").value =
        transaction.date;


    editTransactionModal.classList.add("show");

}


document.getElementById("editTransactionType")
    .addEventListener("change", event => {

        const type = event.target.value;

        const firstCategory = transactionCategories[type][0].value;

        populateEditCategories(type, firstCategory);

    });


function closeEditTransactionModal() {

    editTransactionModal.classList.remove("show");

    editingTransactionId = null;

}


closeEditModalButton.addEventListener(
    "click",
    closeEditTransactionModal
);


editTransactionModal.addEventListener("click", event => {

    if (event.target === editTransactionModal) {
        closeEditTransactionModal();
    }

});


/* =========================================
   17. SAVE EDITED TRANSACTION
========================================= */

editTransactionForm.addEventListener("submit", event => {

    event.preventDefault();


    if (editingTransactionId === null) return;


    const index = transactions.findIndex(item =>
        String(item.id) === String(editingTransactionId)
    );


    if (index === -1) return;


    const previousTransaction = transactions[index];


    const updatedTransaction = {

        ...previousTransaction,

        name: document.getElementById("editTransactionName").value.trim(),

        description:
            document.getElementById("editTransactionDescription").value.trim(),

        amount:
            Number(document.getElementById("editTransactionAmount").value),

        type:
            document.getElementById("editTransactionType").value,

        category:
            document.getElementById("editTransactionCategory").value,

        date:
            document.getElementById("editTransactionDate").value

    };


    if (
        !updatedTransaction.name ||
        !Number.isFinite(updatedTransaction.amount) ||
        updatedTransaction.amount <= 0 ||
        !updatedTransaction.date
    ) {

        alert("Please enter valid transaction details. 🌸");

        return;

    }


    if (updatedTransaction.date > getDateString(0)) {

        alert("Transaction date cannot be in the future. 🌷");

        return;

    }


    transactions[index] = updatedTransaction;


    if (!saveTransactions()) {

        transactions[index] = previousTransaction;

        return;

    }


    updateDashboard();

    closeEditTransactionModal();


    alert("Transaction updated successfully! 💗");

});


/* =========================================
   18. DELETE TRANSACTION
========================================= */

function deleteTransaction(transactionId) {

    const transaction = transactions.find(item =>
        String(item.id) === String(transactionId)
    );


    if (!transaction) return;


    const confirmed = confirm(
        `Delete "${transaction.name}"? This action cannot be undone.`
    );


    if (!confirmed) return;


    const previousTransactions = [...transactions];


    transactions = transactions.filter(item =>
        String(item.id) !== String(transactionId)
    );


    if (!saveTransactions()) {

        transactions = previousTransactions;

        return;

    }


    updateDashboard();

}


/* =========================================
   19. ANALYTICS DATE FILTERS
========================================= */

const analyticsRange =
    document.getElementById("analyticsRange");

const analyticsCustomDates =
    document.getElementById("analyticsCustomDates");

const analyticsStartDate =
    document.getElementById("analyticsStartDate");

const analyticsEndDate =
    document.getElementById("analyticsEndDate");


function getAnalyticsRange() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const todayString = getDateStringForDate(today);

    const selected = analyticsRange.value;


    let start;

    let end = new Date(today);


    if (selected === "week") {

        start = new Date(today);

        const weekday = (today.getDay() + 6) % 7;

        start.setDate(today.getDate() - weekday);

    }

    else if (selected === "month") {

        start = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

    }

    else if (selected === "lastMonth") {

        start = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            1
        );

        end = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        );

    }

    else if (selected === "year") {

        start = new Date(today.getFullYear(), 0, 1);

    }

    else if (selected === "custom") {

        if (!analyticsStartDate.value || !analyticsEndDate.value) {
            return null;
        }

        if (analyticsStartDate.value > analyticsEndDate.value) {
            return null;
        }

        return {

            start: analyticsStartDate.value,

            end: analyticsEndDate.value,

            label:
                `${formatDate(analyticsStartDate.value)} – ` +
                `${formatDate(analyticsEndDate.value)}`

        };

    }

    else {

        const dates = transactions
            .map(transaction => transaction.date)
            .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
            .sort();


        start = dates.length
            ? new Date(`${dates[0]}T00:00:00`)
            : new Date(today);


        end = dates.length
            ? new Date(`${dates[dates.length - 1]}T00:00:00`)
            : new Date(today);


        return {

            start: getDateStringForDate(start),

            end: getDateStringForDate(end),

            label: "All recorded transaction history"

        };

    }


    return {

        start: getDateStringForDate(start),

        end: getDateStringForDate(end),

        label:
            `${formatDate(getDateStringForDate(start))} – ` +
            `${formatDate(getDateStringForDate(end))}`

    };

}


function getFilteredAnalyticsTransactions() {

    const range = getAnalyticsRange();

    if (!range) return null;


    return transactions.filter(transaction => {

        return (
            transaction.date >= range.start &&
            transaction.date <= range.end
        );

    });

}


/* =========================================
   20. RENDER ANALYTICS
========================================= */

function renderAnalytics() {

    analyticsCustomDates.hidden =
        analyticsRange.value !== "custom";


    const range = getAnalyticsRange();

    const filtered = getFilteredAnalyticsTransactions();


    const dateCaption =
        document.getElementById("analyticsDateCaption");


    if (!range || !filtered) {

        dateCaption.textContent =
            "Please select a valid date range.";


        [
            "analyticsIncome",
            "analyticsExpenses",
            "analyticsNet",
            "analyticsSavingsRate",
            "analyticsTransactionCount",
            "analyticsAverageExpense",
            "analyticsLargestExpense",
            "analyticsTopCategory"
        ].forEach(id => {

            document.getElementById(id).textContent = "—";

        });


        document.getElementById("analyticsTrendChart").innerHTML =
            '<div class="analytics-no-data">Please choose a valid date range.</div>';


        document.getElementById("analyticsCategoryList").innerHTML =
            '<div class="analytics-no-data">Choose a valid date range.</div>';


        document.getElementById("analyticsTopCategories").innerHTML =
            '<div class="analytics-no-data">Choose a valid date range.</div>';


        return;

    }


    dateCaption.textContent =
        `Showing transactions from ${range.label}`;


    const incomeTransactions = filtered.filter(
        item => item.type === "income"
    );


    const expenseTransactions = filtered.filter(
        item => item.type === "expense"
    );


    const income = incomeTransactions.reduce(
        (sum, item) => sum + item.amount,
        0
    );


    const expenses = expenseTransactions.reduce(
        (sum, item) => sum + item.amount,
        0
    );


    const net = income - expenses;


    const savingsRate = income > 0
        ? (net / income) * 100
        : null;


    document.getElementById("analyticsIncome").textContent =
        formatCurrency(income);


    document.getElementById("analyticsExpenses").textContent =
        formatCurrency(expenses);


    const netElement = document.getElementById("analyticsNet");

    netElement.textContent =
        `${net < 0 ? "− " : ""}${formatCurrency(Math.abs(net))}`;

    netElement.style.color =
        net < 0 ? "#e78ba1" : "#8c80cb";


    document.getElementById("analyticsSavingsRate").textContent =
        savingsRate === null
            ? "N/A"
            : `${savingsRate.toFixed(1)}%`;


    /* PERIOD DETAILS */

    const averageExpense = expenseTransactions.length
        ? expenses / expenseTransactions.length
        : 0;


    const largestExpense = expenseTransactions.length
        ? Math.max(...expenseTransactions.map(item => item.amount))
        : 0;


    document.getElementById("analyticsTransactionCount").textContent =
        filtered.length;


    document.getElementById("analyticsAverageExpense").textContent =
        formatCurrency(averageExpense);


    document.getElementById("analyticsLargestExpense").textContent =
        formatCurrency(largestExpense);


    /* CATEGORY TOTALS */

    const categoryTotals = {};


    expenseTransactions.forEach(transaction => {

        const category = transaction.category || "Other";

        categoryTotals[category] =
            (categoryTotals[category] || 0) + transaction.amount;

    });


    const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1]);


    document.getElementById("analyticsTopCategory").textContent =
        sortedCategories.length
            ? sortedCategories[0][0]
            : "—";


    renderAnalyticsCategories(sortedCategories, expenses);

    renderAnalyticsTrend(filtered, range);

}


/* =========================================
   21. ANALYTICS CATEGORY BREAKDOWN
========================================= */

function renderAnalyticsCategories(categories, totalExpenses) {

    const categoryList =
        document.getElementById("analyticsCategoryList");

    const topList =
        document.getElementById("analyticsTopCategories");


    categoryList.innerHTML = "";

    topList.innerHTML = "";


    if (!categories.length) {

        const message =
            '<div class="analytics-no-data">No expense transactions in this period. Your chart will bloom when you add some! 🌸</div>';


        categoryList.innerHTML = message;

        topList.innerHTML = message;

        return;

    }


    categories.forEach(([category, amount]) => {

        const percentage = totalExpenses > 0
            ? (amount / totalExpenses) * 100
            : 0;


        const row = document.createElement("div");

        row.className = "analytics-category-row";


        const name = document.createElement("div");

        name.className = "analytics-category-name";

        name.textContent =
            `${getCategoryIcon(category)} ${category}`;


        const track = document.createElement("div");

        track.className = "analytics-category-track";


        const fill = document.createElement("div");

        fill.className = "analytics-category-fill";

        fill.style.width = `${percentage}%`;


        track.appendChild(fill);


        const value = document.createElement("div");

        value.className = "analytics-category-amount";

        value.textContent = formatCurrency(amount);


        row.append(name, track, value);

        categoryList.appendChild(row);

    });


    categories.slice(0, 5).forEach(([category, amount], index) => {

        const row = document.createElement("div");

        row.className = "analytics-top-row";


        const left = document.createElement("div");

        left.className = "analytics-top-left";


        const rank = document.createElement("div");

        rank.className = "analytics-top-rank";

        rank.textContent = `#${index + 1}`;


        const name = document.createElement("div");

        name.className = "analytics-top-name";

        name.textContent =
            `${getCategoryIcon(category)} ${category}`;


        const value = document.createElement("div");

        value.className = "analytics-top-amount";

        value.textContent = formatCurrency(amount);


        left.append(rank, name);

        row.append(left, value);

        topList.appendChild(row);

    });

}


/* =========================================
   22. ANALYTICS TREND CHART
========================================= */

function renderAnalyticsTrend(filtered, range) {

    const chart =
        document.getElementById("analyticsTrendChart");

    chart.innerHTML = "";


    if (!filtered.length) {

        chart.innerHTML =
            '<div class="analytics-no-data">No transactions in this period yet. Your chart will bloom when you add some! 🌸</div>';

        return;

    }


    const start = new Date(`${range.start}T00:00:00`);

    const end = new Date(`${range.end}T00:00:00`);


    const totalDays =
        Math.floor((end - start) / 86400000) + 1;


    const buckets = [];


    if (totalDays <= 14) {

        for (let i = 0; i < totalDays; i++) {

            const date = new Date(start);

            date.setDate(start.getDate() + i);


            buckets.push({

                start: getDateStringForDate(date),

                end: getDateStringForDate(date),

                label: date.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short"
                })

            });

        }

    }

    else if (totalDays <= 90) {

        for (
            let cursor = new Date(start);
            cursor <= end;
        ) {

            const bucketEnd = new Date(cursor);

            bucketEnd.setDate(bucketEnd.getDate() + 6);

            if (bucketEnd > end) {
                bucketEnd.setTime(end.getTime());
            }


            buckets.push({

                start: getDateStringForDate(cursor),

                end: getDateStringForDate(bucketEnd),

                label:
                    `${cursor.getDate()} ` +
                    cursor.toLocaleDateString("en-IN", {
                        month: "short"
                    })

            });


            cursor = new Date(bucketEnd);

            cursor.setDate(cursor.getDate() + 1);

        }

    }

    else {

        let cursor = new Date(
            start.getFullYear(),
            start.getMonth(),
            1
        );


        while (cursor <= end) {

            const monthEnd = new Date(
                cursor.getFullYear(),
                cursor.getMonth() + 1,
                0
            );


            const bucketStart = cursor < start
                ? start
                : cursor;


            const bucketEnd = monthEnd > end
                ? end
                : monthEnd;


            buckets.push({

                start: getDateStringForDate(bucketStart),

                end: getDateStringForDate(bucketEnd),

                label: cursor.toLocaleDateString("en-IN", {
                    month: "short",
                    year: "2-digit"
                })

            });


            cursor = new Date(
                cursor.getFullYear(),
                cursor.getMonth() + 1,
                1
            );

        }

    }


    const totals = buckets.map(bucket => {

        const items = filtered.filter(transaction => {

            return (
                transaction.date >= bucket.start &&
                transaction.date <= bucket.end
            );

        });


        return {

            ...bucket,

            income: items

                .filter(item => item.type === "income")

                .reduce(
                    (sum, item) => sum + item.amount,
                    0
                ),


            expenses: items

                .filter(item => item.type === "expense")

                .reduce(
                    (sum, item) => sum + item.amount,
                    0
                )

        };

    });


    const maxValue = Math.max(

        ...totals.map(item =>
            Math.max(item.income, item.expenses)
        ),

        1

    );


    totals.forEach(item => {

        const group = document.createElement("div");

        group.className = "analytics-period-group";


        const bars = document.createElement("div");

        bars.className = "analytics-bars";


        const incomeBar = document.createElement("div");

        incomeBar.className = "analytics-bar income";

        incomeBar.style.height =
            `${item.income > 0 ? Math.max((item.income / maxValue) * 100, 3) : 2}%`;

        incomeBar.dataset.tooltip = `Income: ${formatCurrency(item.income)}`;
        incomeBar.title = `Income: ${formatCurrency(item.income)}`;
        incomeBar.setAttribute("aria-label", `Income: ${formatCurrency(item.income)}`);


        const expenseBar = document.createElement("div");

        expenseBar.className = "analytics-bar expense";

        expenseBar.style.height =
            `${item.expenses > 0 ? Math.max((item.expenses / maxValue) * 100, 3) : 2}%`;

        expenseBar.dataset.tooltip = `Expenses: ${formatCurrency(item.expenses)}`;
        expenseBar.title = `Expenses: ${formatCurrency(item.expenses)}`;
        expenseBar.setAttribute("aria-label", `Expenses: ${formatCurrency(item.expenses)}`);


        bars.append(incomeBar, expenseBar);


        const label = document.createElement("span");

        label.className = "analytics-period-label";

        label.textContent = item.label;


        group.append(bars, label);

        chart.appendChild(group);

    });

}


/* =========================================
   23. ANALYTICS EVENT LISTENERS
========================================= */

analyticsRange.addEventListener("change", () => {

    if (analyticsRange.value === "custom") {

        const dates = transactions
            .map(item => item.date)
            .sort();


        if (!analyticsStartDate.value) {

            analyticsStartDate.value =
                dates[0] || getDateString(0);

        }


        if (!analyticsEndDate.value) {

            analyticsEndDate.value = getDateString(0);

        }

    }


    renderAnalytics();

});


analyticsStartDate.addEventListener("change", renderAnalytics);

analyticsEndDate.addEventListener("change", renderAnalytics);


/* =========================================
   24. SETTINGS OVERVIEW
========================================= */

function updateSettingsOverview() {

    const totalValue = transactions.reduce(
        (sum, item) => sum + item.amount,
        0
    );


    document.getElementById("settingsTransactionCount").textContent =
        transactions.length;


    document.getElementById("settingsRecordedValue").textContent =
        formatCurrency(totalValue);

}


/* =========================================
   25. ESCAPE HTML
========================================= */

function escapeHtml(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#039;"

        };


        return entities[character];

    });

}


/* =========================================
   26. DOWNLOAD FILE HELPER
========================================= */

function downloadFile(content, filename, mimeType) {

    const blob = new Blob(
        [content],
        { type: mimeType }
    );


    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;


    document.body.appendChild(link);

    link.click();

    link.remove();


    URL.revokeObjectURL(url);

}


function getBackupFilename(extension) {

    const date = getDateString(0);

    return `kawaii-finance-backup-${date}.${extension}`;

}


/* =========================================
   27. EXPORT JSON BACKUP
========================================= */

document.getElementById("exportJsonBtn")
    .addEventListener("click", () => {

        const backup = {

            app: "Kawaii Finance",

            version: 1,

            exportedAt: new Date().toISOString(),

            transactions

        };


        downloadFile(

            JSON.stringify(backup, null, 2),

            getBackupFilename("json"),

            "application/json"

        );


        alert("Your JSON backup is ready!");

    });


/* =========================================
   28. EXPORT CSV
========================================= */

function csvEscape(value) {

    const text = String(value ?? "");

    return `"${text.replace(/"/g, '""')}"`;

}


document.getElementById("exportCsvBtn")
    .addEventListener("click", () => {

        const headers = [

            "ID",

            "Name",

            "Description",

            "Category",

            "Amount",

            "Type",

            "Date"

        ];


        const rows = transactions.map(item => [

            item.id,

            item.name,

            item.description,

            item.category,

            item.amount,

            item.type,

            item.date

        ]);


        const csv = [

            headers.map(csvEscape).join(","),

            ...rows.map(row =>
                row.map(csvEscape).join(",")
            )

        ].join("\n");


        downloadFile(

            "\uFEFF" + csv,

            getBackupFilename("csv"),

            "text/csv;charset=utf-8"

        );


        alert("Your CSV spreadsheet is ready!");

    });


/* =========================================
   29. IMPORT JSON BACKUP
========================================= */

const importFile = document.getElementById("importFile");


importFile.addEventListener("change", async event => {

    const file = event.target.files[0];

    if (!file) return;


    try {

        const text = await file.text();

        const parsed = JSON.parse(text);


        let importedRecords;


        if (Array.isArray(parsed)) {

            importedRecords = parsed;

        }

        else if (
            parsed &&
            parsed.app === "Kawaii Finance" &&
            Array.isArray(parsed.transactions)
        ) {

            importedRecords = parsed.transactions;

        }

        else {

            throw new Error(
                "This file is not a valid Kawaii Finance JSON backup."
            );

        }


        const normalized = importedRecords.map(normalizeTransaction);


        const confirmed = confirm(

            `Import ${normalized.length} transaction(s)?\n\n` +

            "This will replace all transactions currently stored in this browser."

        );


        if (!confirmed) return;


        const previousTransactions = [...transactions];


        transactions = normalized;


        if (!saveTransactions()) {

            transactions = previousTransactions;

            return;

        }


        updateDashboard();

        updateSettingsOverview();


        alert(
            `${normalized.length} transaction(s) imported successfully! 🌸`
        );


    } catch (error) {

        console.error("Import failed:", error);

        alert(
            `Import failed: ${error.message || "Invalid backup file."}`
        );

    } finally {

        importFile.value = "";

    }

});


/* =========================================
   30. RESET ALL TRANSACTIONS
========================================= */

document.getElementById("resetDataBtn")
    .addEventListener("click", () => {

        if (transactions.length === 0) {

            alert("Your transaction history is already empty. 🌸");

            return;

        }


        const firstConfirmation = confirm(

            "Are you sure you want to delete ALL transactions?\n\n" +

            "This will permanently erase your saved income and expenses."

        );


        if (!firstConfirmation) return;


        const secondConfirmation = confirm(

            "FINAL CONFIRMATION\n\n" +

            "This action cannot be undone.\n\n" +

            "Have you exported a backup if you need one?"

        );


        if (!secondConfirmation) return;


        const previousTransactions = [...transactions];


        transactions = [];


        if (!saveTransactions()) {

            transactions = previousTransactions;

            return;

        }


        updateDashboard();

        updateSettingsOverview();


        alert(
            "All transactions have been reset. Your fresh start begins now! 🌸"
        );

    });


/* =========================================
   31. UPDATE COMPLETE DASHBOARD
========================================= */

function updateDashboard() {

    updateSummary();

    renderTransactions();

    renderChart();

    updateCategoryFilterOptions();

    renderAllTransactions();

    renderAnalytics();

    updateSettingsOverview();

}


/* =========================================
   32. KEYBOARD SUPPORT
========================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeExpenseModal();

        closeEditTransactionModal();

    }

});


/* =========================================
   33. INITIALIZE APPLICATION
========================================= */

function initializeApp() {

    initializeDate();

    updateTransactionForm();

    updateDashboard();


    const requestedPage =
        window.location.hash.replace("#", "");


    const availablePages = [

        "dashboard",

        "transactions",

        "analytics",

        "settings"

    ];


    if (availablePages.includes(requestedPage)) {

        showPage(requestedPage);

    } else {

        showPage("dashboard");

    }


    console.log("🌸 Kawaii Finance is ready!");

}


initializeApp();
