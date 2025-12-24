from fastapi import FastAPI

app = FastAPI(title="Economic Shock Explorer API")

@app.get("/")
def health_check():
    return {"status": "ok"}
