import itemData from '../Data/itemDetails.json';
import customerData from '../Data/customerDetails.json';
import categoryData from '../Data/itemCategory.json';

export const getItems = async () => {
    return itemData;
}
export const getCustomers = async () => {
    return customerData;
}
export const getCategories = async () => {
    return categoryData;
}

export const getItemById = (itemId: number) => {
    return itemData.find(item => item.productid === itemId);
}

export const getCustomerById = (customerId: number) => {
    return customerData.find(customer => customer.customerId === customerId);
}

export const getCategoryById = (categoryId: number) => {
    return categoryData.find(category => category.categoryId === categoryId);
}
