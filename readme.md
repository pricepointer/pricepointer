# Pricepointer

A browser extension and app that will help you track product pricing and notify you to get the best deal!

## Contents

`app/` - The code for the API server

`extension` - The code for the browser extension

## Set-up

1. Install dependencies

    Install [PostgreSQL](https://www.postgresql.org/)
    
    Run:

        pip install -r requirements.txt
        npm install
        brew install redis

2.  Start celery processes
        
        brew services start redis
        cd app/ && celery worker -A dropshop --loglevel=info
        
    open a new terminal and run
    
        workon dropshop
        cd app/ && celery -A dropshop beat

See the `readme.md` files in each of the directories above for more details about their respective set-up steps.
