from fastapi import FastApi

app = FastApi()

@app.get("/")
def home():
    return {status : 200}

@app.post("/check")
def take():
    return "alright"

