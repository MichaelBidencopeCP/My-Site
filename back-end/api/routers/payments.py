from fastapi import APIRouter
from fastapi import Depends, HTTPException, status
from api.common import getCurrentUser, getDB, dbCommit
from api.projectTypes import User, Client, Payment, Invoice
import sqlite3
import stripe
from dotenv import load_dotenv
import os

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET")

router = APIRouter()

@router.get("/clients")
async def getClient(user:User = Depends(getCurrentUser), db:sqlite3.Connection = Depends(getDB)) -> list[Client]:
    cursor = db.cursor()
    if user.admin == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    clientsQuery = cursor.execute("SELECT * FROM clients").fetchall()
    clients: list[Client] = [Client(id=client[0], name=client[1]) for client in clientsQuery]
    return clients

@router.get("/clients/<client>")
async def getClient(client:int, user:User = Depends(getCurrentUser), db:sqlite3.Connection = Depends(getDB)):
    cursor:sqlite3.Cursor = db.cursor()
    if user.admin == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    cleint = cursor.execute("SELECT id FROM clients WHERE id = ?", (client,)).fetchone()
    if client is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payments = cursor.execute("SELECT * FROM payments WHERE client = ?", (client,)).fetchall()
    return {
        "client": client,
        "payments": payments
    }
@router.post("/clients")
async def newClient(client: Client, user:User = Depends(getCurrentUser), db:sqlite3.Connection = Depends(getDB)):
    cursor:sqlite3.Cursor = db.cursor()
    if user.admin == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    cursor.execute("INSERT INTO clients (name) VALUES (?)", (client.name,))
    id = cursor.execute("SELECT max(id) FROM clients").fetchone()
    client.id = id[0]
    dbCommit()
    return client
    
    

@router.post("/payment")
async def newPayment(payment:Payment, user: User = Depends(getCurrentUser), db:sqlite3.Connection = Depends(getDB)) -> Payment :
    '''
        This route creates a new payment in the database and returns the key for the payment link
    '''
    cursor = db.cursor()
    if user.admin == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    cursor.execute("INSERT INTO payments ( amount, client, status) VALUES (?, ?, ?)", (payment.amount, payment.client.id, payment.status ))
    key = cursor.lastrowid
    dbCommit()
    payment.id = key
    return payment

@router.get("/payment")
async def getPayments(user:User = Depends(getCurrentUser), db:sqlite3.Connection = Depends(getDB)) -> list[Payment]:
    '''
        This route returns all payments in the database
    '''
    cursor = db.cursor()
    if user.admin == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    paymentsQuery = cursor.execute("SELECT payments.id, payments.amount, clients.id, clients.name, payments.status FROM payments JOIN clients ON payments.client = clients.id").fetchall()
    payments: list[Payment] = [Payment(id=payment[0], amount=payment[1], client=Client(id=payment[2], name=payment[3]), status=payment[4]) for payment in paymentsQuery]
    return payments
    

@router.post("/payment/{key}")
async def payment(key: str, db:sqlite3.Connection = Depends(getDB)) -> dict:
    '''
        This route is the payment link that the client will use to pay
    '''
    cursor = db.cursor()
    payment = cursor.execute("SELECT amount, status FROM payments WHERE id = ?", (key,)).fetchone()
    if payment is None:
        return {
            "error": "Payment not found"
        }
    if payment[1] == 'completed':
        return {
            "error": "Payment already completed"
        }
    
    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        paymentIntent = stripe.PaymentIntent.create(
            amount = payment[0],
            currency='usd',
            payment_method_types=['card']
        )
        return paymentIntent
    except Exception as e:
        return {
            "error": str(e)
        }
@router.put("/payment/{key}")
async def updatePayment(key: int, db:sqlite3.Connection = Depends(getDB)) -> bool:
    '''
        This route updates the status of a payment
    '''
    cursor = db.cursor()
    cursor.execute("UPDATE payments SET status = ? WHERE id = ?", ('completed', key))
    dbCommit()

    return True

@router.post("/invoice")
async def invoice(invoice: Invoice, db:sqlite3.Connection = Depends(getDB)) -> Invoice:
    '''
        This route creates an invoice for the client
    '''
    cursor = db.cursor()
    #set the autoincrment id number to the invoice number
    cursor.execute("UPDATE sqlite_sequence SET seq = ? WHERE name = 'payments';", (invoice.number-1,))


    dbCommit()
    return invoice
    