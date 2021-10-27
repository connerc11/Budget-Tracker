let db;

const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result
    db.createObjectStore('budget', { autoIncrement: true});
}

request.onsuccess = function(event) {
    db = event.target.result
    if (navigator.online) {
        uploadBudget();
    }
};

request.onerror = function(event){
    console.log(event.target.errorCode);
}

function saveRecord(record) {
    const transaction = db.transaction(['new_budget'], 'readwrite');

    const budgetTrackerObjectStore = transaction.objectStore('new_budget');

    budgetTrackerObjectStore.add(record);
}