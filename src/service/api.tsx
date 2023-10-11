import axios from "axios"

export const login = ((username: string, password: string) => {
    return (
        axios({
            url: "https://purrfectpawsshopapi.azurewebsites.net/api/UserLogin/Login",
            method: 'POST',
            data: {
                email: username,
                password: password
            }
        })
    )
})

export const signUp = ((body: { name: string; email: string; password: string; streetAddr1: string; streetAddr2: string; city: string; state: string; poscode: string }) => {
    return (
        axios({
            url: "https://purrfectpawsshopapi.azurewebsites.net/api/TUsers",
            method: 'POST',
            data: {
                "role": "customer",
                "name": body.name,
                "email": body.email,
                "password": body.password,
                "isBillingAddressSame": true,
                "street_1": body.streetAddr1,
                "street_2": body.streetAddr2,
                "city": body.city,
                "state": body.state,
                "postcode": body.poscode,
                "billingStreet_1": body.streetAddr1,
                "billingStreet_2": body.streetAddr2,
                "billingCity": body.city,
                "billingState": body.state,
                "billingPostcode": body.poscode

            }
        })
    )
})

export const logout = ((id: any) => {
    return (
        axios({
            url: `https://purrfectpawsshopapi.azurewebsites.net/api/UserLogin/Logout/${id}`,
            method: 'DELETE'
        })
    )
})

export const userOrder = ((id:any) => {
    return(
        axios({
            url:`https://purrfectpawsshopapi.azurewebsites.net/api/TOrders/${id}`,
            method:'GET'
        })
    )
})

export const getCart = ((userId: any) => {
    return (
        axios({
            url: `https://purrfectpawsshopapi.azurewebsites.net/api/TCarts/${userId}`,
            method: 'GET'
        })
    )
})

export const updateItemQuantity = ((cartId: any, quantity: any) => {
    return (
        axios({
            url: `https://purrfectpawsshopapi.azurewebsites.net/api/TCarts/EditCartQuantity/${cartId}/${quantity}`,
            method: "PUT"
        })
    )
})

export const deleteCartItem = ((productId: any) => {
    return (
        axios({
            url: `https://purrfectpawsshopapi.azurewebsites.net/api/TCarts/${productId}`,
            method: "DELETE"
        })
    )
})

export const proceedOrder = ((userId:any, totalPrice:number, shippingAddressId:any, billingAddressId:any) => {
    return(
        axios({
            url:`https://purrfectpawsshopapi.azurewebsites.net/api/TOrders`,
            method:"POST",
            data: {
                "orderStatusId": 1,
                "shippingAddressId": shippingAddressId,
                "billingAddressId": billingAddressId,
                "totalPrice": totalPrice,
                "userId": userId,
                "paymentStatusId": 3,
            }
        })
    )
})

export const getTransactionLog = (() => {
    return (
        axios({
            url: "https://purrfectpawsshopapi.azurewebsites.net/api/TTransactions",
            method: 'GET'
        })
    )
})

export const getUserProfile = ((id: any) => {
    return (
        axios({
            url: `https://purrfectpawsshopapi.azurewebsites.net/api/TUsers/${id}`,
            method: 'GET',
        })
    )
})

export const updatePassword = ((oldPass: string, newPass: string, id: any) => {
    return (
        axios({
            url: `https://purrfectpawsshopapi.azurewebsites.net/api/TUsers/changePassword/${id}`,
            method: 'PUT',
            data: {
                oldPassword: oldPass,
                newPassword: newPass
            }
        })
    )
})

export const updateDetails = ((formData: { name: string, email: string, streetAddr1: string, streetAddr2: string, city: string, state: string, poscode: string }, id: any) => {
    return (
        axios({
            url: `https://purrfectpawsshopapi.azurewebsites.net/api/TUsers/${id}`,
            method: 'PUT',
            data: {
                "name": formData.name,
                "email": formData.email,
                "street_1": formData.streetAddr1,
                "street_2": formData.streetAddr2,
                "isBillingAddressSame": true,
                "city": formData.city,
                "state": formData.state,
                "postcode": formData.poscode,
                "billingStreet_1": formData.streetAddr1,
                "billingStreet_2": formData.streetAddr2,
                "billingCity": formData.city,
                "billingState": formData.state,
                "billingPostcode": formData.poscode
            }
        })
    )
})

export const updateShippingAddress = ((formData: { name: string, streetAddr1: string, streetAddr2: string, city: string, state: string, postCode: string, country: string }, id: any) => {
    return (
        axios({
            url: `https://purrfectpawsshopapi.azurewebsites.net/api/TUsers/${id}`,
            method: 'PUT',
            data: {
                "name": formData.name,
                "streetAddr1": formData.streetAddr1,
                "streetAddr2": formData.streetAddr2,
                "city": formData.city,
                "state": formData.state,
                "poscode": formData.postCode,
                "country": formData.country
            }
        })
    )
})

export const getOrderListing = (() => {
    return (
        axios({
            url: "https://purrfectpawsshopapi.azurewebsites.net/api/TOrders",
            method: 'GET'
        })
    )
})


export const updateOrderStatus = (( orderMasterId: any, orderStatusId:any ) => {
    return (
        axios({
            url: `https://purrfectpawsshopapi.azurewebsites.net/api/TOrders/OrderStatus/${orderMasterId}/${orderStatusId}`,
            method: 'PUT',
            data: {
                orderMasterId: orderMasterId,
                status: orderStatusId,
            }
        })
    )
})

export const updateOrderList = ((orderId: any, orderStatusId: any) => {
    return (
        axios({
            url:`https://purrfectpawsshopapi.azurewebsites.net/api/TUsers/${id}`,
            method:'POST',
            data: {
                orderId: orderId,
                orderStatusId: orderStatusId,
            }
        })
    )
})

export const deleteProductDetails = ((productDetailsId: any) => {
    return (
        axios({
            url: `https://purrfectpawsshopapi.azurewebsites.net/api/TProductsDetails/${productDetailsId}`,
            method: 'DELETE'
        })
    )
})