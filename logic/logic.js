/**
 * @typedef {Object} User
 * @property {number|string} id
 * @property {string} username
 * @property {string} password
 * @property {string} fullName
 * @property {string} role  // "employee" or "hr"
 */

/**
 * @typedef {Object} HrRequest
 * @property {string} id
 * @property {number|string} userId
 * @property {string} type         // e.g. "Leave", "Sick", "Other"
 * @property {string} comment
 * @property {string} status       // "Submitted", "Approved", "Rejected"
 * @property {string} createdAt    // ISO date string
 */

/**
 * Find a user by username and password.
 * @param {string} username
 * @param {string} password
 * @param {User[]} users
 * @returns {User|null}
 */
export function login(username, password, users) {
    return (
        users.find(
            (u) => u.username === username && u.password === password
        ) || null
    );
}

/**
 * Generate a simple unique id string.
 * @returns {string}
 */
export function generateId() {
    return String(Date.now()) + '-' + String(Math.floor(Math.random() * 100000));
}

/**
 * Create a new HR request for a user.
 * This function mutates the requests array by pushing a new item.
 *
 * @param {number|string} userId
 * @param {string} type
 * @param {string} comment
 * @param {HrRequest[]} requests
 * @returns {HrRequest} the created request
 */
export function createRequest(userId, type, comment, requests) {
    const newRequest = {
        id: generateId(),
        userId: userId,
        type: type,
        comment: comment,
        status: 'Submitted',
        createdAt: new Date().toISOString(),
    };

    requests.push(newRequest);
    return newRequest;
}

/**
 * Get all requests for a specific user.
 *
 * @param {number|string} userId
 * @param {HrRequest[]} requests
 * @returns {HrRequest[]}
 */
export function getUserRequests(userId, requests) {
    return requests.filter((r) => r.userId === userId);
}

/**
 * Get all requests (for HR view).
 *
 * @param {HrRequest[]} requests
 * @returns {HrRequest[]}
 */
export function getAllRequests(requests) {
    return requests;
}

/**
 * Change request status (for HR).
 *
 * @param {string} requestId
 * @param {"Submitted"|"Approved"|"Rejected"} newStatus
 * @param {HrRequest[]} requests
 * @returns {HrRequest|null} updated request or null if not found
 */
export function changeRequestStatus(requestId, newStatus, requests) {
    const request = requests.find((r) => r.id === requestId);
    if (!request) {
        return null;
    }

    request.status = newStatus;
    return request;
}

// Find a user object by its ID
function findUserById(userId) {
    return users.find(u => u.id === userId) || null;
}

// Update the status of a request (Approve / Reject / Reset)
function updateRequestStatus(requestId, newStatus) {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    // Update status
    req.status = newStatus;

    // If using localStorage, save changes
    // localStorage.setItem('requests', JSON.stringify(requests));

    // Refresh HR view
    renderHrRequestsList();

    // If logged-in user is an employee, refresh their screen
    if (currentUser && currentUser.role === 'employee') {
        renderMyRequests();
    }
}