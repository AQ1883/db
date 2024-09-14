function getAllBranches() {
    const url = "http://localhost:3000/fetch-all-Branches";
    const tbody = document.getElementById('branchTable').getElementsByTagName('tbody')[0]; // الحصول على tbody

    // مسح محتويات الجدول قبل إضافة الفروع الجديدة
    tbody.innerHTML = '';

    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        branches = data; // تحديث المصفوفة بالبيانات الجديدة
        console.log("Branches available:", branches); // تحقق من البيانات المحملة
        data.forEach(branch => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = branch.ID;
            row.insertCell(1).textContent = branch.BRANCH_NAME;
            row.insertCell(2).textContent = branch.CITY;
            row.insertCell(3).textContent = branch.PAYMENT_LINK;
            row.insertCell(4).textContent = branch.MERCHANDIZER;

            const actionsCell = row.insertCell(5);
            actionsCell.innerHTML = `
                <button onclick="editBranch('${branch.ID}')">Edit</button>
                <button onclick="deleteBranch('${branch.ID}')">Delete</button>
            `;
        });
    })
    .catch((error) => {
        console.error('Error fetching branches:', error);
    });
}




// استدعاء الدالة عند تحميل الصفحة
window.onload = getAllBranches;




// مصفوفة لتخزين بيانات الفروع
let branches = [];





// فتح نموذج الإدخال
function openForm() {
    document.getElementById('formContainer').classList.remove('hidden');
}

// إغلاق نموذج الإدخال
function closeForm() {
    document.getElementById('formContainer').classList.add('hidden');
    document.getElementById('branchForm').reset(); // إعادة تعيين النموذج
}

// تحويل النص إلى أحرف كبيرة
function toUpperCase(value) {
    return value.toUpperCase();
}

// حفظ البيانات وإضافتها إلى المصفوفة وتحديث الجدول
function saveBranch() {
    const branchIDElem = document.getElementById('branchID');
    const branchNameElem = document.getElementById('branchName');
    const cityElem = document.getElementById('city');
    const paymentLinkElem = document.getElementById('paymentLink');
    const merchandiserElem = document.getElementById('merchandizer');

    if (!branchIDElem || !branchNameElem || !cityElem || !paymentLinkElem || !merchandiserElem) {
        console.error('One or more required elements are missing in the HTML.');
        return;
    }

    const branchID = branchIDElem.value;
    const branchName = toUpperCase(branchNameElem.value);
    const city = toUpperCase(cityElem.value);
    const paymentLink = paymentLinkElem.value;
    const merchandiser = toUpperCase(merchandiserElem.value);

    // التحقق من صحة البيانات
    if (branchID && branchName && city && merchandiser) {
        fetch("http://localhost:3000/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ branchID, branchName, city, paymentLink, merchandiser })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Branch saved successfully:", data);
            getAllBranches(); // تحديث الجدول بعد الحفظ بنجاح
            closeForm(); // إغلاق النموذج
        })
        .catch(error => {
            console.error("Failed to save branch:", error);
        });
    } else {
        console.error('Please fill all required fields.');
    }
}

  
// تحديث محتوى الجدول
function updateTable() {
    const tbody = document.getElementById('branchTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // مسح محتوى الجدول

    // إضافة بيانات الفروع إلى الجدول
    branches.forEach(branch => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = branch.branchID;
        row.insertCell(1).textContent = branch.branchName;
        row.insertCell(2).textContent = branch.city;
        row.insertCell(3).textContent = branch.paymentLink;
        row.insertCell(4).textContent = branch.merchandizer;

        // إضافة أزرار التعديل والحذف
        const actionsCell = row.insertCell(5);
        actionsCell.innerHTML = '<button onclick="editBranch(\'' + branch.branchID + '\')">Edit</button> <button onclick="deleteBranch(\'' + branch.branchID + '\')">Delete</button>';
    });
}

// حذف فرع من المصفوفة وتحديث الجدول
function deleteBranch(branchID) {
    console.log("Attempting to delete branch with ID:", branchID); // تحقق من ID
    if (confirm("Are you sure you want to delete this branch?")) {
        fetch(`http://localhost:3000/delete/${Number(branchID)}`, { // تحويل إلى عدد صحيح
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete branch");
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log(data.message);
                alert(data.message);
                getAllBranches();
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
}

function editBranch(branchID) {
    console.log("Editing branch with ID:", branchID); // تسجيل الـ ID

    // تأكد من أن ID الذي تبحث عنه موجود في المصفوفة
    console.log("Branches available:", branches);

    // البحث عن الفرع في المصفوفة
    const branch = branches.find(branch => {
        console.log("Checking branch ID:", branch.ID, "against", Number(branchID)); // تحويل إلى عدد صحيح
        return branch.ID === Number(branchID);
    });

    if (branch) {
        console.log("Branch found:", branch); // تسجيل تفاصيل الفرع
        document.getElementById('branchID').value = branch.ID;
        document.getElementById('branchName').value = branch.BRANCH_NAME;
        document.getElementById('city').value = branch.CITY;
        document.getElementById('paymentLink').value = branch.PAYMENT_LINK;
        document.getElementById('merchandizer').value = branch.MERCHANDIZER;
        openForm();
    } else {
        console.log("Branch not found"); // إذا لم يتم العثور على الفرع
    }
}




// إضافة ميزة البحث في الجدول
document.getElementById('search').addEventListener('input', function () {
    const searchValue = this.value.toUpperCase(); // تحويل قيمة البحث إلى أحرف كبيرة
    const rows = document.querySelectorAll('#branchTable tbody tr');
    rows.forEach(row => {
        // الحصول على القيم من الصف
        const branchID = row.cells[0].textContent.toUpperCase();
        const branchName = row.cells[1].textContent.toUpperCase();
        const city = row.cells[2].textContent.toUpperCase();
        const merchandizer = row.cells[4].textContent.toUpperCase();

        // التحقق مما إذا كانت قيمة البحث تتطابق مع أي من القيم
        if (branchID.includes(searchValue) || branchName.includes(searchValue) || city.includes(searchValue) || merchandizer.includes(searchValue)) {
            row.style.display = ''; // عرض الصف إذا كان يتطابق مع البحث
        } else {
            row.style.display = 'none'; // إخفاء الصف إذا لم يكن يتطابق
        }
    });
});




