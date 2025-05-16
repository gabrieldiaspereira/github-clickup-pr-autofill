(function () {
    'use strict';

    let titleFilled = false;
    let autoAssignExecuted = false;
    let prFormObserver = null;

    function fillTitleAndAutoAssign() {
        const branchNameElementSelector = '#head-ref-selector > summary > span > span.Button-label > span.css-truncate.css-truncate-target';
        const branchNameElement = document.querySelector(branchNameElementSelector);
        const titleInput = document.querySelector('#pull_request_title');
        const assignSelfButtonSelector = 'button.js-issue-assign-self[type="submit"][value="38802740"]';
        const assignSelfButton = document.querySelector(assignSelfButtonSelector);

        if (branchNameElement && branchNameElement.textContent && titleInput && !titleFilled) {
            const fullBranchName = branchNameElement.textContent.trim();
            const parts = fullBranchName.split('-');
            const ticket = parts.slice(0, 2).join('-');
            const description = parts.slice(2).join(' ').replace(/-/g, ' ');
            const formattedTitle = `[${ticket}] ${description}`;

            titleInput.value = formattedTitle;
            titleFilled = true;
        }

        if (assignSelfButton && !autoAssignExecuted) {
            assignSelfButton.click();
            autoAssignExecuted = true;
        }

        if (titleFilled && autoAssignExecuted && prFormObserver) {
            prFormObserver.disconnect();
        }
    }

    function observePRForm() {
        const prFormContainer = document.querySelector('#new_pull_request');
        if (prFormContainer) {
            prFormObserver = new MutationObserver(fillTitleAndAutoAssign);
            prFormObserver.observe(prFormContainer, { childList: true, subtree: true });
            // Try to execute immediately if the elements are already there
            fillTitleAndAutoAssign();
        } else {
            // PR form not found. Trying again...
            setTimeout(observePRForm, 1000); // Try again after one second
        }
    }

    window.addEventListener('load', observePRForm);

})();