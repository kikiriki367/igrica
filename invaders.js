const grid = document.querySelector('.grid')
const skorPrikaz = document.querySelector('.score')
let currentPlayerIndex = 202
let sirinaTable = 15
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let score = parseInt(localStorage.getItem("skor"))


skorPrikaz.innerHTML = localStorage.getItem("skor")


for (let i = 0; i < 225; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

function drawInvaders() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if(!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader')
    }
  }
}

drawInvaders()

function removeInvaders() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
  }
}

squares[currentPlayerIndex].classList.add('player')


function moveplayer(e) {
  squares[currentPlayerIndex].classList.remove('player')
  switch(e.key) {
    case 'ArrowLeft':
      if (currentPlayerIndex % sirinaTable !== 0) currentPlayerIndex -=1
      break
    case 'ArrowRight' :
      if (currentPlayerIndex % sirinaTable < sirinaTable -1) currentPlayerIndex +=1
      break
  }
  squares[currentPlayerIndex].classList.add('player')
}
document.addEventListener('keydown', moveplayer)

function moveInvaders() {
  const leftEdge = alienInvaders[0] % sirinaTable === 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % sirinaTable === sirinaTable -1
  removeInvaders()

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += sirinaTable +1
      direction = -1
      goingRight = false
    }
  }

  if(leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += sirinaTable -1
      direction = 1
      goingRight = true
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  }

  drawInvaders()

  if (squares[currentPlayerIndex].classList.contains('invader', 'player')) {
    localStorage.setItem('skor', score);// zapamti skor za dalje
    document.location = 'index.html';
    clearInterval(invadersId)
  }
  //DA IZGUBIS KAD TE PRODJU
  for (let i = 210; i < squares.length; i++) {
    if(squares[i].classList.contains('invader')) {//ako je polje dole onda izgubi
      localStorage.setItem('skor', score);// zapamti skor za dalje
      document.location = 'index.html';
      clearInterval(invadersId)
    }
  }
  ////
  if (aliensRemoved.length === alienInvaders.length) {
    score+=20 // ZA pobedu poeni
    localStorage.setItem('skor', score);// zapamti skor za dalje
    document.location = 'index.html';
    clearInterval(invadersId)
  }
}
invadersId = setInterval(moveInvaders, 150)

function shoot(e) {
  let laserId
  let currentLaserIndex = currentPlayerIndex
  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser')
    currentLaserIndex -= sirinaTable
    squares[currentLaserIndex].classList.add('laser')

    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser')
      squares[currentLaserIndex].classList.remove('invader')
      squares[currentLaserIndex].classList.add('boom')

      setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300)
      clearInterval(laserId)

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
      aliensRemoved.push(alienRemoved)
      score++
      skorPrikaz.innerHTML = score
      console.log(aliensRemoved)

    }

  }
  
  if(e.keyCode === 32){
    laserId = setInterval(moveLaser, 200)
  }
}

document.addEventListener('keydown', shoot)