const cols=document.querySelectorAll('.col');
 
//смена цвета при нажатии пробела
document.addEventListener('keydown', (event)=>{
   

    if (event.code.toLocaleLowerCase()==='space'){
        event.preventDefault();
        setRandomColors();
    } 
})


//меняем класс
document.addEventListener('click', (event) => {
    const type = event.target.dataset.type;

    if (type === 'lock') {
        const node =
            event.target.tagName.toLowerCase() === 'i'
                ? event.target
                : event.target.children[0];

        node.classList.toggle('fa-lock-open');
        node.classList.toggle('fa-lock');
    } else if (type === 'copy') {
        const notificationP = event.target.nextElementSibling;
        if (notificationP) {
            copyToClickboard(event.target.textContent, notificationP);
        }
    }
});


//функуия генератор цвета (не используем, используем библиотеку chroma)
function generateRandomColor(){  
    //RGB
    //#FF000
    //#00FF00
    //#0000FF

    const hexCodes='0123456789ABCDEF';
    let color='';
    for (let i=0; i<6; i++){
        color+= hexCodes[Math.floor(Math.random()*hexCodes.length)]
    }
    return '#'+ color;
}

//меняет цвет колонки и h2 текст с помощью библиотеки chroma
function setRandomColors(isInitial) { 
      const colors = isInitial ? getColorsFromHash():[]
    cols.forEach((col, index)=>{
        const isLocked = col.querySelector('i').classList.contains('fa-lock')
        const text=col.querySelector('h2');
        const button = col.querySelector('button');
       


        if (isLocked) {
            colors.push(text.textContent)
            return
        } 

        const color=isInitial //добавляем цвет в массив для создания ссылки
         ? colors[index] 
         ?colors[index]
         :chroma.random()
         : chroma.random()

         if (!isInitial) {
        colors.push(color)
         }

 
        text.textContent=color;
       col.style.background=color;

       setTextColor(text, color);
       setTextColor(button,color);
      
    })

    updateColorsHash(colors)
}


//копируем в буфер обмена
function copyToClickboard(text, notificationP) {
    return navigator.clipboard.writeText(text)
        .then(() => {
            if (notificationP) {
                notificationP.textContent = 'Color copied';
                notificationP.classList.add('copied-message');
                setTimeout(() => {
                    notificationP.classList.add('hidden');
                }, 1500);

                // Удаление классов и сброс текста после анимации
                setTimeout(() => {
                    notificationP.classList.remove('copied-message', 'hidden');
                    notificationP.textContent = '';
                }, 2000);
            }
        })
        .catch((error) => {
            console.error('Error when copying text to clipboard:', error);
        });
}


//Определяем каким будет текст
function setTextColor(text, color){
  const luminance =   chroma(color).luminance();
  text.style.color=luminance > 0.5 ? 'black' : 'white';
}


//ссылка с цветами
function updateColorsHash(colors = []){
    document.location.hash=colors
    .map((col) => {
        return col.toString().substring(1)
    })
    .join('-')
}


//убираем "-" добавляем # в ссылке
function getColorsFromHash(){
    if (document.location.hash.length>1){
      return  document.location.hash
      .substring(1)
      .split('-')
      .map(color => '#'+color)
    }
    return[]
}

setRandomColors(true);


