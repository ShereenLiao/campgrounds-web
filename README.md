# CampWeb

install dependency manually:

npm i express mongoose ejs method-override uuid

## API Routes Documentation for Customers

| HTTP Method | URL | Description|Input|Return
| :--- | :--- | :--- | :--- | :--- |
|`GET` | `/` | Get information about the customer service  |None|Json
| `GET` | `/customers/{customer_id}` | Get customer by Customer_ID |'customer_id': string|CustomerModel Object
| `GET` | `/customers` | Returns a list of all the Customers |None|CustomerModel Object
| `POST` | `/customers` | Creates a new Customer record in the database |{'first_name': string, 'last_name': string, 'nickname': string, 'email': string, 'gender': 'FEMALE' or 'MALE' or'UNKNOWN', 'birthday': string, 'password': string, 'is_active': boolean}|CustomerModel Object
| `PUT` | `/customers/{customer_id}` | Updates/Modify a Customer record in the database |'customer_id': string, 'first_name': string, 'last_name': string, 'nickname': string, 'email': string, 'gender': 'FEMALE' or 'MALE' or'UNKNOWN', 'birthday': string, 'password': string|CustomerModel Object
| `DELETE` | `/customers/{customer_id}` | Delete the Customer with the given id number |'customer_id': string|204 Status Code
|`GET` | `/customers/{customer_id}/addresses` | Returns a list of all Addresses of a Customer |'customer_id': string, 'address_id': integer|Address Object
|`GET` | `/customers/{customer_id}/addresses/{address_id}` | Get an Address by address_id |'customer_id': string|Customer Object
|`POST` | `/customers/{customer_id}/addresses` | Creates a new Address record in the database |{'customer_id': string, 'address_id': integer, 'address': string}| Address Object
|`PUT` | `/customers/{customer_id}/addresses/{address_id}` | Updates/Modify an Address record in the database |'customer_id': string, 'address_id': integer, 'address': string|AddressModel Object
|`DELETE` | `/customers/{customer_id}` | Delete the Address with the given address_id number |'customer_id': string|204 Status Code
|`GET`|`/customers?birthday=<string:birthday>`|List customers by birthday|'birthday': string|200 Status Code|
|`GET`|`/customers?nickname=<string:email>`|List customers by email|'email': string|200 Status Code|
|`GET`|`/customers?firstname=<string:firstname>&lastname=<string:lastname>`|List customers by their name|'firstname': string, 'lastname': string|200 Status Code|
|`GET`|`/customers?nickname=<string:nickname>`|List customers by nickname|'nickname': string|200 Status Code|
|`PUT`|`/customers/<int:customer_id>/activate`|Active a customer|--|204 Status Code|
|`DELETE`|`/customers/<int:customer_id>/deactivate`|Deactive a customer|--|204 Status Code|


POST /campgrounds/:id/reviews

