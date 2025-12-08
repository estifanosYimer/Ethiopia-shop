import { Order } from '../types';

const STORAGE_KEY = 'abyssinia_orders';

// Simulate network latency for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const saveOrder = async (order: Order): Promise<void> => {
  await delay(1500); // Simulate API call

  try {
    const existingOrdersStr = localStorage.getItem(STORAGE_KEY);
    const existingOrders: Order[] = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    
    // Add new order to the beginning of the list
    existingOrders.unshift(order);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingOrders));
    console.log("Order successfully saved to backend:", order);
  } catch (error) {
    console.error("Failed to save order:", error);
    throw new Error("Backend storage failed");
  }
};

export const getOrders = async (): Promise<Order[]> => {
  await delay(500); // Simulate API call
  const existingOrdersStr = localStorage.getItem(STORAGE_KEY);
  return existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
};

export const clearOrders = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEY);
};