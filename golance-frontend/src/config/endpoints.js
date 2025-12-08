// Base URL for all API endpoints
const BASE_URL = 'http://localhost:8080/api';

// Auth endpoints
export const AUTH = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/users/register`,
};

// User endpoints
export const USER = {
  GET_USER: (userId) => `${BASE_URL}/users/${userId}`,
};

// Task endpoints
export const TASKS = {
  GET_ALL: `${BASE_URL}/tasks`,
  GET_BY_USER: (userId) => `${BASE_URL}/tasks/user/${userId}`,
  GET_ASSIGNED: (userId) => `${BASE_URL}/tasks/user/${userId}/assigned-tasks`,
  CREATE: `${BASE_URL}/tasks`,
  DELETE: (taskId) => `${BASE_URL}/tasks/${taskId}`,
  UPDATE_STATUS: (taskId) => `${BASE_URL}/tasks/${taskId}/status`,
};

// Bid endpoints
export const BIDS = {
  GET_BY_TASK: (taskId) => `${BASE_URL}/bids/tasks/${taskId}`,
  GET_BY_USER: (userId) => `${BASE_URL}/bids/user/${userId}`,
  CREATE: (taskId) => `${BASE_URL}/bids/tasks/${taskId}`,
  DELETE: (bidId) => `${BASE_URL}/bids/${bidId}`,
  ALLOCATE: (taskId, bidId) => `${BASE_URL}/bids/tasks/${taskId}/allocate/${bidId}`,
};

// Wallet endpoints
export const WALLET = {
  GET_BALANCE: (userId) => `${BASE_URL}/wallet/balance/${userId}`,
  RECHARGE: `${BASE_URL}/wallet/recharge`,
  TRANSFER: `${BASE_URL}/wallet/transfer`,
};

// Transaction endpoints
export const TRANSACTIONS = {
  GET_BY_USER: (userId) => `${BASE_URL}/transactions/${userId}`,
};

// Message endpoints
export const MESSAGES = {
  START_CHAT: `${BASE_URL}/messages/start`,
  GET_CONTACTS: (userId) => `${BASE_URL}/messages/contacts/${userId}`,
  GET_CONVERSATION: (userId, contactId) => `${BASE_URL}/messages/conversation/${userId}/${contactId}`,
};

export default {
  AUTH,
  USER,
  TASKS,
  BIDS,
  WALLET,
  TRANSACTIONS,
  MESSAGES,
};
