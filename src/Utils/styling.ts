import styled from "styled-components";

export const W4FlexRow = styled.div` 
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    height: 100vh;
`

export const W4FlexColumn = styled.div` 
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    width: 100%;
    height: 100vh;
`
export const OptionsButton = styled.button`
    margin: 10px;
    padding: 10px;
    border-radius: 20px;
    cursor: pointer;
`

export const SubmitButton = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 20px;
  cursor: pointer;
  background-color: lightblue;
  color: black;
  width: fit-content;
  &:hover{
    background-color: #0099ff;
  }
  &:disabled{
    background-color: lightgray;
    cursor: not-allowed;
  }
`

export const W4InputLabel = styled.label`
    display: inline;
`

export const W4Input = styled.input`
  display: inline;
  width: 20em;
`

export const W4P = styled.p`
  display: inline;
  width: max-content;
`

export const W4SubpageHeader = styled.h2`
    
`