const steps = document.querySelectorAll(".form-step");
const indicator = document.querySelector(".indicator.active");
const dots = indicator.querySelectorAll('.step-dot');
const topicButtons = document.querySelectorAll('.topic-button');
const stepCounter = indicator.querySelector('h5');

let topicList = [];
let nextIndex = 0;

let formData = {
    name: "",
    email: "",
    topics: []
};


function normalizeName(name) {
    return name
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

}

function normalizeEmail(email) {
    const regex = /^[a-zA-Z0-9\._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}


function createDotList() {
    let list = [];
    topicButtons.forEach((topic) => {
        topic.addEventListener('click', () => {
            const htmlValue = topic.textContent;
            const topicIndex = formData.topics.indexOf(htmlValue);

            if (topicIndex === -1) {

                formData.topics.push(htmlValue);
                topic.classList.add("active");

            } else {

                formData.topics.splice(topicIndex, 1);
                topic.classList.remove("active");

            }
        });
    });
}


function getMessage() {
    const language = navigator.language;

    const messages = {
        "pt-BR": "Por favor, informe um e-mail válido.",
        "en-US": "Please enter a valid email address.",
        "es-ES": "Por favor, introduce un correo electrónico válido."
    };

    const message = messages[language] || messages["en-US"];

    return message;
}


function updateSummary() {
    
    const summary = steps[2];

    const nameElement = summary.querySelectorAll(".user-data dd")[0];
    const emailElement = summary.querySelectorAll(".user-data dd")[1];
    const topicList = summary.querySelector(".summary-topic ul");

    nameElement.textContent = formData.name;
    emailElement.textContent = formData.email;

    topicList.innerHTML = "";

    formData.topics.forEach(topic => {

        const li = document.createElement("li");

        li.textContent = topic;

        topicList.appendChild(li);

    });

}


function nextStep(currentStep, index) {
    // Function responsable for change to the next step //

    nextIndex = index + 1;

    if (nextIndex > steps.length) {
        return;
    }

    // Deactivate current step form 
    currentStep.classList.toggle("active", false);

    // Activate next step
    steps[nextIndex].classList.toggle("active", true);

    if (nextIndex > 2) {
        indicator.classList.remove("active");
        return;
    } 

    // Change indicator text
    stepCounter.textContent = `Step ${nextIndex + 1} of 3`;

    // Deactivate current dot
    dots.forEach((item) => item.classList.remove("active"));

    // Activate next dot
    dots[nextIndex].classList.add('active');

}

function checkStep(item, index) {
    // A function responsible for validating the information 
    // on each tab and also for preparing the transition to the next tab. 

    let hasEmail = false;
    let hasName = false;

    let email = '';
    let userName = '';

    const currentStep = item.id

    if (currentStep === "stepOne") {
        
        const inputs = item.querySelectorAll('input');

        inputs.forEach((input) => {
            
            // Validate the information camming from input 
            if (!input.checkValidity()) {
                input.reportValidity();

            } else {

                if (input.name === "name") {
                    hasName = true;
                    userName = input.value;
                }

                if (input.name === "email") {

                    isValidEmail = normalizeEmail(input.value);
                    if (!isValidEmail) {

                        const message = getMessage();

                        input.setCustomValidity(message);
                        input.reportValidity();

                    } else {
                        hasEmail = true;
                        email = input.value;
                    }
                }
            }
        });

        if (!hasEmail || !hasName) {
            return;
        };

        userName = normalizeName(userName);

        formData.name = userName;
        formData.email = email;

        nextStep(item, index);
        return;
    }

    if (currentStep === "stepTwo") {
        
        if (formData.topics.length === 0) {
            return;
        }

        updateSummary();

        nextStep(item, index);
        return;
    }

    if (currentStep === "stepThree") {
        nextStep(item, index);
        return;
    }
    
}


function core() {
    // iter over the tebs
    steps.forEach((item, index) => {

        const nextButton = item.querySelector(".next-btn");
        
        if (nextButton && index < steps.length - 1) {
            
            nextButton.addEventListener("click", () => {
                checkStep(item, index);
            });   
        }    
    });

    // This needs to stay here so that we can add 
    // an event listener to the topic buttons.
    createDotList();
}

// function instance
core()