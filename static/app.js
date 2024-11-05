// 6. 저장된 메모 삭제 (delete -> DELETE 요청)
// id 값으로 데이터 삭제 가능
async function deleteMemo(event) {
  const id = event.target.dataset.id  // id 값 확인
  const res = await fetch(`/memos/${id}`,{
    method : "DELETE",
    // body에 값을 넣고 보내는게 아니라 삭제만 할거라 body 부분 필요 없음
  });
  readMemo();
}

// 5. 저장된 메모 수정 (update -> PUT 요청)
// 특정 메모 수정시 id를 알아야 수정 가능
async function editMemo(event) {
  const id = event.target.dataset.id  // 버튼 눌렀을때 id 값 확인
  const editInput = prompt('수정할 값을 입력하세요!'); // prompt : 창 띄우기
  const res = await fetch(`/memos/${id}`,{
    method : "PUT",
    headers : {
      "Content-Type" : "application/json",
    },
    body : JSON.stringify({ 
        id : id,  // id (생략가능)
        content: editInput,
    }),
  });
  readMemo();

}

// 4. 서버에서 불러온 메모들을 html에 추가
function displayMemo(memo) {
    const ul = document.querySelector("#memo-ul");

    const li = document.createElement("li");  // list 태그 생성
    li.innerText = `${memo.content}`;   // list 안에 memo 넣기

    const editBtn = document.createElement("button"); // 업데이트 버튼
    editBtn.innerText = "수정";
    editBtn.addEventListener("click",editMemo);
    editBtn.dataset.id = memo.id; // data-id 속성에 id 값을 넣어줌

    const delBtn = document.createElement("button");
    delBtn.innerText = "삭제";
    delBtn.addEventListener("click",deleteMemo);
    delBtn.dataset.id = memo.id;

    li.appendChild(editBtn); // 수정버튼 추가
    li.appendChild(delBtn); // 삭제버튼 추가
    ul.appendChild(li);   // ul 안에 li 추가
    
}


// 3. 서버에서 생성한 메모를 다시 불러 와야 함
async function readMemo() {
    const res = await fetch("/memos"); // default (get요청)
    const jsonRes = await res.json(); // 응답받은 값을 다시 json 으로 변경
    const ul = document.querySelector("#memo-ul");
    ul.innerText = ""; // ul 에 남아있는 값들이 중복으로 입력되기 때문에 값을 보여주기 전에 ul 초기화 시켜줘야함

    // jsonRes = [{id:123,content:'블라블라}] 
    jsonRes.forEach(displayMemo);   // jsonRes 배열에 담겨있는 값들이 각각 displayMemo 함수를 실행
    
}


// 2. 메모를 생성 , 서버에 메모 만들어달라고 요청 (POST요청)
async function createMemo(value) {
  const res = await fetch("/memos",{
    method : "POST",
    headers : {
      "Content-Type" : "application/json",
    },
    body : JSON.stringify({ // body안에 객체를 넣어서 전달 -> 그냥 전달시 전달 안됨 -> json.stringify로 변환해서 전달해야함
        id : new Date().getTime().toString(),
        content: value,
    }),
  });
  readMemo();  // 메모 생성후 서버에 업데이트 되어 있는 메모들 가져와서 읽어줘야 함
}



// 1. submit 이벤트가 발생했을때 메모를 서버에 보내줌
function handleSubmit(event) {
  event.preventDefault(); // 새로고침되는 이벤트를 막아줌
  const input = document.querySelector("#memo-input");
  createMemo(input.value);
  input.value = "";
}


// 이벤트 걸어주기 (항상 메모가 생성되면 안되니까)
const form = document.querySelector('#memo-form'); // form 으로 감싸서 
form.addEventListener("submit",handleSubmit); // form 안에서 submit 이벤트가 발생되면 createMemo 호출

readMemo();  // 맨 처음 서버에 있는 데이터 값을 한번 불러와야 함
