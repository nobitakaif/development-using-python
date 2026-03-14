from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def home():
    return {"status" : 200}

@app.post("/id/{id}")
def take(id:int):
    return {id: "alright"}

