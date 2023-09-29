// public/main.js

let myLeads = [];
const inputEl = document.getElementById("input-el");
const saveBtn = document.getElementById("save-btn");
const ulEl = document.getElementById("ul-el");
const delBtn = document.getElementById('del-btn');
const tabBtn = document.getElementById('tab-btn');
const downloadButton = document.getElementById('download-btn');

// Load leads from local storage
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage;
    render(myLeads);
}

// Save button click event
saveBtn.addEventListener("click", function () {
    myLeads.push(inputEl.value);
    inputEl.value = "";
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
});

// Delete button double-click event
delBtn.addEventListener('dblclick', function () {
    localStorage.clear();
    myLeads = [];
    render(myLeads);
});

// Tab button click event
tabBtn.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        myLeads.push(tabs[0].url);
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    });
});

// Render function
function render(leads) {
    let listItems = "";
    for (let i = 0; i < myLeads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
}

// Event listener for the download button
downloadButton.addEventListener('click', function () {
    // Replace with your list of LinkedIn URLs
    const leads = myLeads.map(url => ({ name: extractNameFromLinkedInURL(url), link: url }));

    // Create a Blob and a download link for the CSV file
    const csvHeader = "Name,Link\n";
    let csvContent = csvHeader;
    leads.forEach(lead => {
        const csvRow = `"${lead.name}","${lead.link}"\n`;
        csvContent += csvRow;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'linkedin_data.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
});

// Extract the name from a LinkedIn URL (simplified for demonstration)
// Extract the name from a LinkedIn URL
// Extract the name from a LinkedIn URL
function extractNameFromLinkedInURL(url) {
    // Split the URL by '/'
    const parts = url.split('/');

    // The name should be the fifth part of the URL (index 4)
    if (parts.length >= 5) {
        return parts[4];
    }

    // If the format is unexpected or doesn't contain a valid name, return an empty string or handle it as needed
    return "";
}


