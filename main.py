from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# body 로 받을때 메모 형식 지정
class Memo(BaseModel):
    id:str
    content:str

memos = []

app = FastAPI()

# memos의 get 요청이 들어오면 값 읽어서 전달
@app.get("/memos")
def read_memo():
    return memos

# memos의 post 요청이 들어오면 memos[ ]에 값 추가
@app.post("/memos")
def create_memo(memo:Memo):
    memos.append(memo)
    return '메모 추가에 성공!'

@app.put("/memos/{memo_id}")
def put_memo(req_memo:Memo):
    for memo in memos:
        if memo.id == req_memo.id:
            memo.content = req_memo.content
            return '업데이트 성공!'
    return '업데이트 실패..'

@app.delete("/memos/{memo_id}")
def delete_memo(memo_id):
    # enumerate : index와 값을 같이 뽑아주는 함수
    for index,memo in enumerate(memos):
        if memo.id == memo_id:
            memos.pop(index)
            return '메모 삭제 성공!'
    return '삭제 실패..'

app.mount("/", StaticFiles(directory="static" , html=True), name="static")