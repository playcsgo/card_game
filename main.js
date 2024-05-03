//DOM

const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  Check: 'check',
  CardsMatch: 'CardsMatch',
  CardMatchFailed: 'CardMatchFailed',
  Completed: 'Completed'
}

//model { }
const model = {
  // deck: Array.from(Array(52).keys()),
  revealedCards: [],
  curScore: 0,
  goal: 20,
  curTried: 1,
}

//view{ }
const view = {
  symbol:[
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', //spade
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // heart
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', //diamond
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' //club
  ],
 
  // 按照輸入的index轉換成撲克牌
  getCardElement(index) {
    return `<div class="card back" data-index="${index}"></div>`
  },
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = this.symbol[Math.floor(index / 13)]
    return `
    <p>${number}</p>
    <img src=${symbol} alt="card-type">
    <p>${number}</p>
    `
  },

  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  renderCards(amount) {
    cards.innerHTML = this.shuffle(amount).map(index => this.getCardElement(index)).join('')
  },
  // 不用.mpa(),  使用forEach的方式
  // renderCards2(indexes){
  //   let rawHTML = ''
  //   indexes.forEach(index => {
  //     const number = this.transformNumber(index % 13 + 1)
  //     const cardSymbol = this.symbol[Math.floor(index / 13)]
  //     rawHTML += `
  //     <div class="card ">
  //       <p>${number}</p>
  //       <img src=${cardSymbol} alt="card-type">
  //       <p>${number}</p>
  //     </div>
  //     `
  //   })
  //   cards.innerHTML = rawHTML
  // },
  shuffle(amount){
    const number = Array.from(Array(amount).keys())
    for (let i = number.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      [number[i], number[randomIndex]] = 
      [number[randomIndex], number[i]]
    }
    return number
  },
  flipCard(card) {
    if (!card.classList.contains('card')) {
      return
    }
    //如果是背面 -> 翻正面
    if (card.classList.contains('back')) {
      card.classList.remove('back')
      card.innerHTML = view.getCardContent(index)
    } else {   //如果是正面 -> 翻背面
      card.innerHTML = ''
      card.classList.add('back')
    }
  },
  showScore() {
    const score = document.querySelector('.score')
    score.textContent = `Score: ${model.curScore}`
  },
  showTired() {
    const tried = document.querySelector('.tried')
    tried.textContent = `You've tried: ${model.curTried} times`
  }
}
// controller { }
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,

  setListenerOnCards() {
    // 使用querySelectorAll 每一張牌都綁監聽器
    const card = document.querySelectorAll('.card')
    card.forEach(card => {
      card.addEventListener('click', event => {
        index = Number(event.target.dataset.index)
        controller.dispatchActions(card)
      })
    })
  },
  
  dispatchActions(card) {
    if (!card.classList.contains('back')) return
    switch(this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCard(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits:
        view.flipCard(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.Check
        this.checkMatch()
        break
    }
    //console.log(model.score);
    console.log(model.revealedCards);
  },

  generateCards(amount) {
    view.renderCards(amount)
  },

  checkMatch() {
    const firstCard = Number(model.revealedCards[0].dataset.index) % 13
    const secondCard = Number(model.revealedCards[1].dataset.index) % 13

    if (firstCard === secondCard) {
      model.curScore += 10
      view.showScore()
      model.revealedCards = []
      if (model.curScore === model.goal) {
        this.currentState = GAME_STATE.Completed
        setTimeout(() => {
          alert('~過關啦~')
        }, '500') 
      } else {
        this.currentState = GAME_STATE.FirstCardAwaits
      }
    } else {
      model.curTried += 1
      view.showTired()
      setTimeout(() => {
        model.revealedCards.map(card => {
          view.flipCard(card)
        })
        model.revealedCards = []
        this.currentState = GAME_STATE.FirstCardAwaits
      }, '1000')
    }
  },
}


// main
controller.generateCards(52)
controller.setListenerOnCards()