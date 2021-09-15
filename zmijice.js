document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid div')// selektuje sve div-s
  const skorPrikaz = document.querySelector('span') // selektuje skor
  const startDugme = document.querySelector('.start')   // 

  const velicinaTable = 10
  let currentIndex = 0 //u prvom polju
  let appleIndex = 0 //u prvom polju
  let currentSnake = [2, 1, 0] // 2 je glava, 1 je telo, 0 je rep kada se nalaze u divu
  let dir = 1 // na koju stranu ide
  let skor = parseInt(localStorage.getItem("skor"))
  skorPrikaz.innerText = localStorage.getItem("skor")
  let brzina = 0.93
  let intervalTime = 0
  let interval = 0
  let started = 0;

  let previousLocation;


  //to start, and restart the game
  function startGame() {
    if (started != 1) {
      started = 1;
      // ocisti tablu, namesti vrednosti
      currentSnake.forEach(index => squares[index].classList.remove('snake'))//skloni celu zmiju
      squares[appleIndex].classList.remove('apple')
      clearInterval(interval)
      skor = parseInt(localStorage.getItem("skor"))
      //
      randomApple()
      dir = 1
      skorPrikaz.innerText = skor
      intervalTime = 500
      currentSnake = [2, 1, 0]
      currentIndex = 0
      currentSnake.forEach(index => squares[index].classList.add('snake'))
      interval = setInterval(movement, intervalTime)
    }
  }

  function movement() {
    //fail state
    if (
      (currentSnake[0] + velicinaTable >= (velicinaTable * velicinaTable) && dir === velicinaTable) || //pod
      (currentSnake[0] % velicinaTable === velicinaTable - 1 && dir === 1) || //desno
      (currentSnake[0] % velicinaTable === 0 && dir === -1) || //levo
      (currentSnake[0] - velicinaTable < 0 && dir === -velicinaTable) ||  //gore
      (squares[currentSnake[0] + dir].classList.contains('snake') && squares[currentSnake[0] + dir] != previousLocation) //u smau sebe
    ) {
      localStorage.setItem('skor', skor);// zapamti skor za dalje
      document.location = 'index.html';
      //return clearInterval(interval) //pojeo se tako da cistimo tablu
    }
    previousLocation = squares[currentSnake[0]]


    const tail = currentSnake.pop() // izbaci rep iz steka ali ga i dalje prikazuje
    squares[tail].classList.remove('snake')  //izbacuje da rep ne vazi kao deo zmije
    currentSnake.unshift(currentSnake[0] + dir) //gives dir to the head of the array, edituje array da je pomeri

    //jede
    if (squares[currentSnake[0]].classList.contains('apple')) {
      squares[currentSnake[0]].classList.remove('apple')
      squares[tail].classList.add('snake')
      currentSnake.push(tail)
      randomApple()
      skor += 2;
      skorPrikaz.textContent = skor
      clearInterval(interval)
      intervalTime = intervalTime * brzina
      interval = setInterval(movement, intervalTime)
    }
    squares[currentSnake[0]].classList.add('snake')
  }


  //stvori novu jabuku
  function randomApple() {
    do {
      appleIndex = Math.floor(Math.random() * squares.length)// broj od 1-100 (jer ima 10x10 polja = 100)
    } while (squares[appleIndex].classList.contains('snake')) //ako stavi da se stvori na zmiji da nadje novu lokaciju
    squares[appleIndex].classList.add('apple')//stori jabuku
  }


  //pomeranje
  function control(event) {
    squares[currentIndex].classList.remove('snake')

    if (started == 0 && event.keyCode === 32) {
      startGame();
    }

    if (event.keyCode === 39 && squares[currentSnake[0] + 1] != previousLocation) {//desna strelica
      dir = 1
    } else if (event.keyCode === 38 && squares[currentSnake[0] + -velicinaTable] != previousLocation) {//gore strelica
      dir = -velicinaTable
    } else if (event.keyCode === 37 && squares[currentSnake[0] - 1] != previousLocation) {//levo strelica
      dir = -1
    } else if (event.keyCode === 40 && squares[currentSnake[0] + velicinaTable] != previousLocation) {//desno strelica
      dir = +velicinaTable
    }
  }

  document.addEventListener('keyup', control)
  startDugme.addEventListener('click', startGame)
})