import { orderApi } from "../api/order.api";
import type { Order } from "../types/order.type";

export const getAllOrders = async () => {
  try {
    const response = await orderApi.getAll();
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (id: number) => {
  try {
    const response = await orderApi.getById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    throw error;
  }
};

export const createOrder = async (data: Partial<Order>) => {
  try {
    const response = await orderApi.create(data);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updateOrder = async (id: number, data: Partial<Order>) => {
  try {
    const response = await orderApi.update(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating order with id ${id}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: string) => {
  try {
    const response = await orderApi.updateStatus(id, status);
    return response.data;
  } catch (error) {
    console.error(`Error updating status for order with id ${id}:`, error);
    throw error;
  }
};

export const deleteOrder = async (id: number) => {
  try {
    const response = await orderApi.delete(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order with id ${id}:`, error);
    throw error;
  }
};