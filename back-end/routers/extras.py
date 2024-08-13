from fastapi import APIRouter
from fastapi import Depends, HTTPException, status
from ..common import getCurrentUser, getDB, dbCommit
import socket
from dotenv import load_dotenv
import os
load_dotenv()

LOCK_PORT = os.getenv("LOCK_PORT")
LOCK_PASSWORD = os.getenv("LOCK_PASSWORD")
HOUSE_IP = os.getenv("HOUSE_IP")

router = APIRouter()

def make_request():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Connect the socket to the port where the server is listening
    server_address = (HOUSE_IP , int(LOCK_PORT))
    print( f'connecting to {server_address[0]} port {server_address[1]}' )
    sock.connect(server_address)
    response = ""
    try:
        while response != 'done':
            # Send data
            message = LOCK_PASSWORD

            sock.sendto(message.encode(), server_address)
            #set response to the data received from the server
            response = sock.recv(1024).decode()
            print ( f'received "{response}"' )
    except:
        return False
    finally:
        print( 'closing socket')
        sock.close()
        return True

@router.get("/lock")
def lock(user: Depends(getCurrentUser)):
    if user.admin == 1:
        if make_request():
            return {
                "response":True
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="error",
                headers={"WWW-Authenticate": "Bearer"},
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )