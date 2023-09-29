let myLeads = [];
const inputEl = document.getElementById("input-el");
const saveBtn = document.getElementById("save-btn");
const ulEl = document.getElementById("ul-el");
const delBtn = document.getElementById('del-btn');
const tabBtn = document.getElementById('tab-btn');
const downloadButton = document.getElementById('download-btn');

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage;
    render(myLeads);
}

saveBtn.addEventListener("click", function () {
    myLeads.push(inputEl.value);
    inputEl.value = "";
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
});

delBtn.addEventListener('dblclick', function () {
    localStorage.clear();
    myLeads = [];
    render(myLeads);
});

tabBtn.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        myLeads.push(tabs[0].url);
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    });
});

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

downloadButton.addEventListener('click', function () {
    
    const leads = myLeads.map(url => ({ name: extractNameFromLinkedInURL(url), link: url }));

   
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


function extractNameFromLinkedInURL(url) {
   
    const parts = url.split('/');

    if (parts.length >= 5) {
        return parts[4];
    }
    return "";
}


