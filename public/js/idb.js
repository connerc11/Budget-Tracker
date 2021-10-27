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

function uploadData() {
   
    const transaction = db.transaction(['new_budget'], 'readwrite');
  
    
    const budgetTrackerObjectStore = transaction.objectStore('new_budget');
  
    
    const getAll = budgetTrackerObjectStore.getAll();
  
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
          fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(serverResponse => {
              if (serverResponse.message) {
                throw new Error(serverResponse);
              }
              
              const transaction = db.transaction(['new_budget'], 'readwrite');
             
              const budgetTrackerObjectStore = transaction.objectStore('new_budget');
             
              budgetTrackerObjectStore.clear();
    
              alert('All of the saved budgets has been submitted!');
            })
            .catch(err => {
              console.log(err);
            });
        }
      };
  }

  window.addEventListener('online', uploadData);