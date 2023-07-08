import React from 'react'
import { ACTIONS } from '../App'

export default function NumberButton({dispatch,number}){
return(
    <button
    onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload:{number}})}
  >
    {number}
    </button>);

}