import './App.css';
import NumberButton from './component/number_button';
import OperationButton from './component/operation_button';
import React, { useReducer } from 'react'

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.number === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.number === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.number}`

      }
    case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand == null && state.previousOperand == null) {
          return state
        }
  
        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation,
          }
        }
        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          }
        }
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,
        }
    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
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
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
   
  }
}
function evaluate({ previousOperand, currentOperand, operation }) {
  let prev = parseFloat(previousOperand);
  let curr = parseFloat(currentOperand);
  let compute;
  switch (operation) {
    case "x":
      compute = prev * curr;
      break;
    case "+":
      compute = prev + curr;
      break;
    case "-":
      compute = prev - curr;
      break;
    case "%":
      compute= prev%curr;
       break;
    case "&#x000F7;":
      compute=prev/curr;
      break;
  }
  return compute.toString();
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
  const [{ currentOperand, previousOperand, operation }, Dispatch] = useReducer(reducer, {})
  return (
    <div className="App">
      <div className="output">
        <div className="previous_selector">{formatOperand(previousOperand)}{operation}</div>
        <div className="current_selector">{formatOperand(currentOperand)}</div>
      </div>
      <button onClick={() => Dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => Dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton dispatch={Dispatch} operation="%" />
      <OperationButton dispatch={Dispatch} operation="&#x000F7;" />
      <NumberButton dispatch={Dispatch} number="1" />
      <NumberButton dispatch={Dispatch} number="2" />
      <NumberButton dispatch={Dispatch} number="3" />
      <OperationButton dispatch={Dispatch} operation="x" />
      <NumberButton dispatch={Dispatch} number="4" />
      <NumberButton dispatch={Dispatch} number="5" />
      <NumberButton dispatch={Dispatch} number="6" />
      <OperationButton dispatch={Dispatch} operation="+" />
      <NumberButton dispatch={Dispatch} number="7" />
      <NumberButton dispatch={Dispatch} number="8" />
      <NumberButton dispatch={Dispatch} number="9" />
      <OperationButton dispatch={Dispatch} operation="-" />
      <NumberButton dispatch={Dispatch} number="." />
      <NumberButton dispatch={Dispatch} number="0" />
      <button className="spanTwo"onClick={() => Dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
