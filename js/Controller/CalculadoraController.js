class CalculadoraController {
  constructor() {
    //Referenciando as classes dentro da variável
    this._dateEl = document.querySelector(".data")
    this._timeEl = document.querySelector(".hora")
    this._displayEl = document.querySelector(".expressao")
    this._prevEl = document.querySelector(".previa")
    this._listExp = ['0']
    this._prev = 0
    this.start()
    this.initAddEventsBtns()
    this.initAddEventsKeyboard()
    this._ifResult = false
  }

  start() {
    this.attDate()
    //Metodo nativo capaz de fazer atualização no período determinado em milisegundo
    setInterval(() => {
      this.attDate()
    }, 1000)
  }

  //Inverte o Numero
  inverse() {
    if (this.verifOperator(this.returnLast())) {
      this._listExp.pop()
    }
    if (this.returnLast() == '0') {
      return
    }
    this._listExp[this._listExp.length - 1] = (1 / this.returnLast()).toString()
    this._ifResult = true
    this.attDisplay()
  }

  //Método da Classe
  attDate() {
    //Classe que traz a data e hora atualizada
    let date = new Date()

    // _(underline) torna o método privado
    this._dateEl.innerHTML = date.toLocaleDateString('pt-BR')
    this._timeEl.innerHTML = date.toLocaleTimeString('pt-BR')
  }

  //Mostra eventos na tela
  attDisplay() {
    this._displayEl.innerHTML = this._listExp.join("")
    this._prevEl.innerHTML = this._prev
    this._displayEl.scrollBy(100, 0)
  }

  //Será acionado quando o botão AC for acionado
  clear() {
    this._listExp = ['0']
    this._prev = '0'
    this.attDisplay()
  }

  //Será acionado quando o botão backspace for acionado
  erase() {
    this._listExp[this._listExp.length - 1] = this.returnLast().slice(0, -1)
    if (this.returnLast() == '') {
      if (this._listExp.length == 1) {
        this._listExp = ['0']
      } else {
        this._listExp.pop()
      }
    }
    this.attDisplay()
  }

  error() {
    this._displayEl.innerHTML = 'ERROЯ'
    this._prevEl.innerHTML = ''
    this._ifResult = true
  }

  //Verifica se o ultimo valor é operador
  returnLast() {
    return this._listExp[this._listExp.length - 1]
  }

  //Verifica se um operador é maior que -1
  verifOperator(val) {
    return ['×', '÷', '+', '-'].indexOf(val) > -1
  }

  //Método que adiciona valor a listaExpressao
  addValExp(val) {
    if (this.verifOperator(val)) {
      //se não for número
      //mandar o val para um index novo na nossa lista
      if (this.verifOperator(this.returnLast())) {
        //substitui um operador por outro
        this._listExp[this._listExp.length - 1] = val
      } else {
        this._listExp.push(val)
      }
    } else {
      //se for número
      //adicionar o número dentro do último index da lista
      //verifica se o ultimo é operador
      if (this.verifOperator(this.returnLast())) {
        this._listExp.push(val)
      } else {
        if (this.returnLast() == '0' && val.toString() != '.') {
          this._listExp[this._listExp.length - 1] = ''
        }
        if (this.returnLast().indexOf('.') > -1 && val.toString() == '.') {
          return
        }
        this._listExp[this._listExp.length - 1] += val.toString()
      }
    }
    this.attDisplay()
  }


  multIndexOf(arrPrincipal, arr) {
    for (let i = 0; i < arrPrincipal.length; i++) {
      let v = arrPrincipal[i]
      for (let i2 = 0; i2 < arr.length; i2++) {
        let v2 = arr[i2]
        if (v == v2) {
          return [i, v2]
        }
      }
    }
    return [-1, '']
  }

  calculate(arr) {
    //Transformando String em Número
    for (let i = 0; i < arr.length; i += 2) {
      arr[i] = parseFloat(arr[i])
    }

    while (this.multIndexOf(arr, ['÷', '×'])[0] > -1) {
      let operation = this.multIndexOf(arr, ['÷', '×'])
      let result;
      switch (operation[1]) {
        case '÷':
          result = arr[operation[0] - 1] / arr[operation[0] + 1]
          break;
        case '×':
          result = arr[operation[0] - 1] * arr[operation[0] + 1]
          break;
      }
      arr.splice(operation[0] - 1, 3, result)

    }

    while (this.multIndexOf(arr, ['+', '-'])[0] > -1) {
      let operation = this.multIndexOf(arr, ['+', '-'])
      let result;
      switch (operation[1]) {
        case '+':
          result = arr[operation[0] - 1] + arr[operation[0] + 1]
          break;
        case '-':
          result = arr[operation[0] - 1] - arr[operation[0] + 1]
          break;
      }
      arr.splice(operation[0] - 1, 3, result)

    }
    this._ifResult = true
    arr[0] = arr[0].toString()
    this.attDisplay()
  }

  //Cálculo da Prévia
  calcPrev() {
    let listPrev = []
    this._listExp.forEach((v) => {
      listPrev.push(v)
    })
    this.calculate(listPrev)
    this._ifResult = false
    //Ignora o operador na Prévia
    if (isNaN(listPrev[0])) {
      return
    }
    this._prev = listPrev.join('')
    this.attDisplay()
  }

  //Eventos com a tecla
  initAddEventsKeyboard() {
    document.addEventListener('keyup', (e) => {

      switch (e.key) {
        case 'c':
          //Limpa tudo
          this.clear();
          break;
        case 'Backspace':
          //apaga ultimo caractere
          if (this._ifResult == true) {
            this.clear()
          }
          this.erase();
          this.calcPrev()
          break;
        case 'Enter':
          //calcular valor final
          if (this._ifResult == true) {
            return
          }
          this._prev = ''
          this.calculate(this._listExp)
          break;
        case '+':
        case '-':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
        case '.':
          //Após o resultado do calculo ele limpa a tela ao pressionar outro número, podendo fazer novos calculos 
          if (this._ifResult == true) {
            this.clear()
            this._ifResult = false
          }
          this.addValExp(e.key)
          this.calcPrev()
          //adicionar ma lista da expresão
          break;
        case '/':
          if (this._ifResult == true) {
            this.clear()
            this._ifResult = false
          }
          this.addValExp('÷')
          this.calcPrev()
          break;
        case '*':
          if (this._ifResult == true) {
            this.clear()
            this._ifResult = false
          }
          this.addValExp('×')
          this.calcPrev()
          break;
      }
      this.calcPrev()
      if (isNaN(this._listExp[0])) {
        this.error()
      }
    })
  }


  initAddEventsBtns() {
    //Selecionando todas as classes
    let buttons = document.querySelectorAll("table.botoes td");

    //Percorre os botões adicionando evento de click quando o botão for acionado
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        let value = button.innerHTML;

        switch (value) {
          case 'AC':
            //Limpa tudo
            this.clear();
            break;
          case 'backspace':
            //apaga ultimo caractere
            if (this._ifResult == true) {
              this.clear()
            }
            this.erase();
            this.calcPrev()
            break;
          case '=':
            //calcular valor final
            if (this._ifResult == true) {
              return
            }
            this._prev = ''
            this.calculate(this._listExp)
            break;
          case '1/x':
            //inverter ultimo valor digitado
            this.inverse();
            this.calcPrev()
            break;
          case '+':
          case '-':
          case '÷':
          case '×':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
          case '0':
          case '.':
            //Após o resultado do calculo ele limpa a tela ao pressionar outro número, podendo fazer novos calculos 
            if (this._ifResult == true) {
              this.clear()
              this._ifResult = false
            }
            this.addValExp(value)
            this.calcPrev()
            //adicionar ma lista da expresão
            break;
        }
        this.calcPrev()
        if (isNaN(this._listExp[0])) {
          this.error()
        }
      })
    })
  }
}
