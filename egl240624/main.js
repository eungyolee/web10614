// 색깔 버튼을 클릭했을 때 body의 background-color를 변경하는 함수
function handleColorClick(event) {
  const color = event.target.style.backgroundColor;  // click event가 발생한 버튼의 background-color를 가져와서 저장
  document.body.style.backgroundColor = color;  // body의 background-color를 위에서 저장한 color로 변경
}

// 색깔 버튼들을 모두 가져와서 각각에 대해 click event가 발생했을 때 handleColorClick 함수를 실행
Array.from(document.getElementsByClassName("controls_color")).forEach(color => color.addEventListener("click", handleColorClick));