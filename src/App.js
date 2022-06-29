/* eslint-disable default-case */
import { useReducer } from 'react'
import DigitButton from './components/DigitButton'
import OperationButton from './components/OperationButton'

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate"

}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes('.')) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION: 
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }

      case ACTIONS.CLEAR:
        return {}

      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: null,
          }
        }
        if (state.currentOperand == null) return state
        if (state.currentOperand.length < 1) {
          return {
            ...state,
            currentOperand: null,
          }
        }
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        }

        case ACTIONS.EVALUATE:
          if (
            state.operation == null ||
            state.currentOperand == null ||
            state.previousOperand == null
          ) return state
          return {
            ...state,
            overwrite: true,
            previousOperand:null,
            operation: null,
            currentOperand: evaluate(state),
          }
  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return ""
  let compute = ''
  switch(operation) {
    case "+":
    compute = prev + current
    break

    case "-":
      compute = prev - current
      break
    
    case "x":
      compute = prev * current
      break
    
    case "÷":
      compute = prev / current
      break
  }
  return compute.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-container">
      <div className="calculator-display">
        <div className="prev-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button className='del-btn' onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={40}><path d="M576 384C576 419.3 547.3 448 512 448H205.3C188.3 448 172 441.3 160 429.3L9.372 278.6C3.371 272.6 0 264.5 0 256C0 247.5 3.372 239.4 9.372 233.4L160 82.75C172 70.74 188.3 64 205.3 64H512C547.3 64 576 92.65 576 128V384zM271 208.1L318.1 256L271 303C261.7 312.4 261.7 327.6 271 336.1C280.4 346.3 295.6 346.3 304.1 336.1L352 289.9L399 336.1C408.4 346.3 423.6 346.3 432.1 336.1C442.3 327.6 442.3 312.4 432.1 303L385.9 256L432.1 208.1C442.3 199.6 442.3 184.4 432.1 175C423.6 165.7 408.4 165.7 399 175L352 222.1L304.1 175C295.6 165.7 280.4 165.7 271 175C261.7 184.4 261.7 199.6 271 208.1V208.1z"/></svg></button>
      <OperationButton operation={"÷"} dispatch={dispatch} />
      <DigitButton digit={'7'} dispatch={dispatch} />
      <DigitButton digit={'8'} dispatch={dispatch} />
      <DigitButton digit={'9'} dispatch={dispatch} />
      <OperationButton operation={"x"} dispatch={dispatch} />
      <DigitButton digit={'4'} dispatch={dispatch} />
      <DigitButton digit={'5'} dispatch={dispatch} />
      <DigitButton digit={'6'} dispatch={dispatch} />
      <OperationButton operation={"-"} dispatch={dispatch} />
      <DigitButton digit={'1'} dispatch={dispatch} />
      <DigitButton digit={'2'} dispatch={dispatch} />
      <DigitButton digit={'3'} dispatch={dispatch} />
      <OperationButton operation={"+"} dispatch={dispatch} />
      <DigitButton digit={'0'} dispatch={dispatch} />
      <DigitButton digit={'.'} dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App