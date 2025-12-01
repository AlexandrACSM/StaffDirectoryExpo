// api/requestsApi.js

const BASE_URL = 'http://localhost:3001';

export async function fetchRequestsApi() {
    const response = await fetch(`${BASE_URL}/requests`);
    return response.json();
}

export async function createRequestApi({ userId, type, comment }) {
    const payload = {
        userId,        type,
        comment,
        status: 'Submitted',
        createdAt: new Date().toISOString(),
    };

    const response = await fetch(`${BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return response.json();
}

export async function updateRequestStatusApi(id, status) {
    const response = await fetch(`${BASE_URL}/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });

    return response.json();
}
