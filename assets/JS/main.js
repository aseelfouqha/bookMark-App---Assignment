
const inputs = Array.from(document.querySelectorAll('.form-control'));
const bookMarkForm = document.querySelector('.bookMarkForm');
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const removeAllBtn = document.querySelector(".removeAll");
const searchInput = document.querySelector(".search-input");


let sites = JSON.parse(localStorage.getItem("sites") || "[]");
let editIndex = null;


function setError(input, message) {
  const errorSpan = input.parentElement.querySelector(".error-message");
  errorSpan.textContent = message;
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
}

function setValid(input) {
  const errorSpan = input.parentElement.querySelector(".error-message");
  errorSpan.textContent = "";
  input.classList.add("is-valid");
  input.classList.remove("is-invalid");
}

function validateSiteName() {
  const value = inputs[0].value.trim();
  if (!value) {
    setError(inputs[0], "Site name is required.");
    return false;
  }
  if (value.length < 4 || value.length > 10) {
    setError(inputs[0], "Site name must be 4-10 letters.");
    return false;
  }
  if (!/^[A-Z]/.test(value)) {
    setError(inputs[0], "Site name must start with uppercase.");
    return false;
  }
  if (!/^[A-Za-z]+$/.test(value)) {
    setError(inputs[0], "Site name must contain only letters.");
    return false;
  }
  setValid(inputs[0]);
  return true;
}

function validateSiteURL() {
  const value = inputs[1].value.trim();
  const regex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
  if (!value) {
    setError(inputs[1], "Site URL is required.");
    return false;
  }
  if (!regex.test(value)) {
    setError(inputs[1], "Enter a valid URL (http:// or https://).");
    return false;
  }
  setValid(inputs[1]);
  return true;
}

function validateEmail() {
  const value = inputs[2].value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    setError(inputs[2], "Email is required.");
    return false;
  }
  if (!regex.test(value)) {
    setError(inputs[2], "Enter a valid email.");
    return false;
  }
  setValid(inputs[2]);
  return true;
}

function validatePassword() {
  const value = inputs[3].value.trim();
  if (!value) {
    setError(inputs[3], "Password is required.");
    return false;
  }
  if (value.length < 6) {
    setError(inputs[3], "Password must be at least 6 characters.");
    return false;
  }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    setError(inputs[3], "Password must contain letters and numbers.");
    return false;
  }
  setValid(inputs[3]);
  return true;
}


inputs[0].addEventListener("input", validateSiteName);
inputs[1].addEventListener("input", validateSiteURL);
inputs[2].addEventListener("input", validateEmail);
inputs[3].addEventListener("input", validatePassword);


function displaySites(filteredSites = sites) {
  const tableBody = document.querySelector(".sites_data");
  if (filteredSites.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No bookmarks found</td></tr>`;
    return;
  }

  tableBody.innerHTML = filteredSites
    .map((site, index) => {
      return `<tr>
        <td>${index + 1}</td>
        <td>${site.siteName}</td>
        <td><a href="${site.siteURL}" target="_blank">${site.siteURL}</a></td>
        <td>${site.siteEmail}</td>
        <td>${site.sitePass}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editSite(${index})">Update</button>
          <button class="btn btn-sm btn-danger" onclick="removeSite(${index})">Delete</button>
        </td>
      </tr>`;
    })
    .join("");
}


bookMarkForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const isValid =
    validateSiteName() &&
    validateSiteURL() &&
    validateEmail() &&
    validatePassword();

  if (!isValid) return;

  const site = {
    siteName: inputs[0].value,
    siteURL: inputs[1].value,
    siteEmail: inputs[2].value,
    sitePass: inputs[3].value,
  };

  if (editIndex !== null) {
    sites[editIndex] = site;
    editIndex = null;
    submitBtn.textContent = "Add";
    submitBtn.classList.remove("btn-warning");
    submitBtn.classList.add("btn-outline-info");
  } else {
    sites.push(site);
  }

  localStorage.setItem("sites", JSON.stringify(sites));
  bookMarkForm.reset();
  inputs.forEach(input => {
    input.classList.remove("is-valid", "is-invalid");
  });
  displaySites();
});


window.editSite = (index) => {
  const site = sites[index];
  inputs[0].value = site.siteName;
  inputs[1].value = site.siteURL;
  inputs[2].value = site.siteEmail;
  inputs[3].value = site.sitePass;
  editIndex = index;

  submitBtn.textContent = "Update";
  submitBtn.classList.remove("btn-outline-info");
  submitBtn.classList.add("btn-warning");
};


window.removeSite = (index) => {
  sites.splice(index, 1);
  localStorage.setItem("sites", JSON.stringify(sites));
  displaySites();
};


removeAllBtn.addEventListener("click", () => {
  sites = [];
  localStorage.removeItem("sites");
  displaySites();
});


resetBtn.addEventListener("click", () => {
  bookMarkForm.reset();
  editIndex = null;
  submitBtn.textContent = "Add";
  submitBtn.classList.remove("btn-warning");
  submitBtn.classList.add("btn-outline-info");
  inputs.forEach(input => {
    input.classList.remove("is-valid", "is-invalid");
    input.parentElement.querySelector(".error-message").textContent = "";
  });
});


searchInput.addEventListener("input", () => {
  const filterText = searchInput.value.toLowerCase();
  const filteredSites = sites.filter(site =>
    site.siteName.toLowerCase().includes(filterText)
  );
  displaySites(filteredSites);
});


displaySites();
