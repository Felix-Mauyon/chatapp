import { Client, Databases, ID, Account } from 'appwrite'

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('670d0c1c00294ee8df25');

const databases = new Databases(client)

const account = new Account(client)

export { databases, ID, client, account}