// Input validation utilities (simple validation without external dependencies)

// Auth validation
export function validateRegister(data: { name: string; email: string; password: string }): void {
  if (!data.name || data.name.length < 2) {
    throw new Error('Name must be at least 2 characters');
  }
  if (data.name.length > 50) {
    throw new Error('Name must be at most 50 characters');
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Invalid email address');
  }
  if (!data.password || data.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  if (data.password.length > 100) {
    throw new Error('Password must be at most 100 characters');
  }
}

export function validateLogin(data: { email: string; password: string }): void {
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Invalid email address');
  }
  if (!data.password) {
    throw new Error('Password is required');
  }
}

// Wallet validation
export function validateAddMoney(data: { amount: number }): void {
  if (!data.amount || data.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  if (data.amount > 100000) {
    throw new Error('Amount cannot exceed $100,000');
  }
}

// Transaction validation
export function validateTransfer(data: { receiverId: string; amount: number }): void {
  if (!data.receiverId) {
    throw new Error('Receiver ID is required');
  }
  if (!data.amount || data.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  if (data.amount > 100000) {
    throw new Error('Amount cannot exceed $100,000');
  }
}

// Investment validation
export function validateBuyStock(data: { symbol: string; name: string; quantity: number; price: number }): void {
  if (!data.symbol || data.symbol.length === 0) {
    throw new Error('Stock symbol is required');
  }
  if (data.symbol.length > 10) {
    throw new Error('Stock symbol must be at most 10 characters');
  }
  if (!data.name || data.name.length === 0) {
    throw new Error('Stock name is required');
  }
  if (data.name.length > 100) {
    throw new Error('Stock name must be at most 100 characters');
  }
  if (!data.quantity || data.quantity <= 0 || !Number.isInteger(data.quantity)) {
    throw new Error('Quantity must be a positive integer');
  }
  if (data.quantity > 1000000) {
    throw new Error('Quantity cannot exceed 1,000,000');
  }
  if (!data.price || data.price <= 0) {
    throw new Error('Price must be greater than 0');
  }
  if (data.price > 1000000) {
    throw new Error('Price cannot exceed $1,000,000');
  }
}

export function validateSellStock(data: { symbol: string; quantity: number; price: number }): void {
  if (!data.symbol || data.symbol.length === 0) {
    throw new Error('Stock symbol is required');
  }
  if (!data.quantity || data.quantity <= 0 || !Number.isInteger(data.quantity)) {
    throw new Error('Quantity must be a positive integer');
  }
  if (data.quantity > 1000000) {
    throw new Error('Quantity cannot exceed 1,000,000');
  }
  if (!data.price || data.price <= 0) {
    throw new Error('Price must be greater than 0');
  }
  if (data.price > 1000000) {
    throw new Error('Price cannot exceed $1,000,000');
  }
}

// Security validation
export function validateSetPin(data: { pin: string }): void {
  if (!data.pin || !/^\d{4}$/.test(data.pin)) {
    throw new Error('PIN must be exactly 4 digits');
  }
}

export function validatePin(data: { pin: string }): void {
  if (!data.pin) {
    throw new Error('PIN is required');
  }
}

// Savings goal validation
export function validateCreateGoal(data: { name: string; targetAmount: number; deadline?: string; category?: string }): void {
  if (!data.name || data.name.length === 0) {
    throw new Error('Goal name is required');
  }
  if (data.name.length > 100) {
    throw new Error('Goal name must be at most 100 characters');
  }
  if (!data.targetAmount || data.targetAmount <= 0) {
    throw new Error('Target amount must be greater than 0');
  }
  if (data.targetAmount > 1000000) {
    throw new Error('Target amount cannot exceed $1,000,000');
  }
}

