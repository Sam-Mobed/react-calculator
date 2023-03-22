import logo from './logo.svg';
import './App.css';
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS ={
  ADD_DIGIT: 'add-digit', //when we click on a number
  CHOOSE_OPERATION: 'choose-operation', //when we click on +,-, 8 and so on
  CLEAR: 'clear', //when we click on AC
  DELETE_DIGIT: 'delete-digit', //when we click on DEL
  EVALUATE: 'evalutate' //when we click on =

};

function reducer(state, {type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite){
        return {
          ...state, 
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if(payload.digit === "0" && state.currentOperand === "0") return state;
      if(payload.digit === "." && state.currentOperand.includes(".")) return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}` //add the digit at the end of the operand, if current operand is null, we default to empty string
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

    case ACTIONS.CHOOSE_OPERATION:
      //if we choose an operation and nothing has been typed out yet, we do nothing
      if (state.currentOperand == null && state.previousOperand == null){
        return state;
      }

      if (state.currentOperand == null){
        return {
          ...state,
          operation: payload.operation,
        }
      }
      //take the current operand and make it the previous one
      if (state.previousOperand == null){
        return {
          ...state,
          operation : payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      //in case there is a previous operand, it does the computation and puts the result.
      return {
        ...state, 
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      };

    case ACTIONS.CLEAR:
      return {};
    
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null};
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1) //remove the last digit from the current operand. 
      }
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      } //we just don't have enough enough info to compute, so we don't do anything
      
      return{
        ...state,
        overwrite: true, //once we're done with an evaluation, next time we click a button it will clear the result. 
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
  }

} //this function helps manage all of our states for us
//function reducer(state, action), action is broken up into type and payload, since we know that we will have a number of different actions,
//different types of actions, and they will pass along parameters. 

function evaluate({ currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return ""; //incase there is an issue when converting strings to float.
  let computation = ""
  switch (operation){
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString();

}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {});

  return ( //we are using css grid here, hence the format of the classnames
  //calculator-grid contains the entire calculator
  //output contains the black section at the top of the calculator
  //we will use a reducer inside of react that will manage all the different states
  //different states: current operand previous operand and the operation that we have
    <div className="calculator-grid"> 
      <div className="output"> 
        <div className="previous-operand">{previousOperand} {operation}</div> 
        <div className="current-operand">{currentOperand}</div> 
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button> 
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
